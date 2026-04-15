'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { collection, doc, type Firestore } from 'firebase/firestore';
import { BriefcaseBusiness, Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import { useCollection } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { JobFormDialog } from './JobFormDialog';
import { JobColumn } from './JobColumn';
import { JobDetailPanel } from './JobDetailPanel';
import { countByStatus, groupJobsByStatus, moveJobStatus } from '@/lib/job-tracker/board-utils';
import { JOB_STATUS_ORDER, type JobActivityAction, type JobApplication, type JobApplicationInput, type JobStatus } from '@/lib/job-tracker/types';
import { trackEvent } from '@/lib/analytics-events';
import { getFollowUpState } from '@/lib/job-tracker/reminder-utils';

type Props = {
  user: User | null;
  firestore: Firestore | null;
  demoMode?: boolean;
};

const DEMO_KEY = 'fitcv-job-board-demo-v1';

function normalizeJob(raw: Partial<JobApplication> & { id: string }): JobApplication {
  const now = new Date().toISOString();
  return {
    id: raw.id,
    title: raw.title ?? '',
    company: raw.company ?? '',
    location: raw.location ?? '',
    salary: raw.salary ?? '',
    jobUrl: raw.jobUrl ?? '',
    status: (raw.status as JobStatus) ?? 'saved',
    dateAdded: raw.dateAdded ?? now,
    dateApplied: raw.dateApplied,
    deadline: raw.deadline,
    resumeUsed: raw.resumeUsed,
    coverLetterUsed: raw.coverLetterUsed,
    notes: raw.notes ?? '',
    nextAction: raw.nextAction,
    interviewDate: raw.interviewDate,
    interviewRound: raw.interviewRound,
    nextFollowUpAt: raw.nextFollowUpAt,
    lastFollowUpAt: raw.lastFollowUpAt,
    followUpCount: raw.followUpCount ?? 0,
    rating: raw.rating ?? 2,
    tags: raw.tags ?? [],
    atsKeywords: raw.atsKeywords ?? [],
    matchScore: raw.matchScore,
    updatedAt: raw.updatedAt ?? now,
  };
}

export function JobBoard({ user, firestore, demoMode = false }: Props) {
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingEnrichmentJobId, setPendingEnrichmentJobId] = useState<string | null>(null);
  const [demoJobs, setDemoJobs] = useState<JobApplication[]>([]);
  const [demoHydrated, setDemoHydrated] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [optimisticJobs, setOptimisticJobs] = useState<JobApplication[] | null>(null);
  const [enrichmentPromptSnoozedUntil, setEnrichmentPromptSnoozedUntil] = useState<number | null>(null);
  const { toast } = useToast();

  const jobsQuery = useMemoFirebase(
    () => (!demoMode && user && firestore ? collection(firestore, `users/${user.uid}/jobApplications`) : null),
    [demoMode, firestore, user]
  );
  const activityQuery = useMemoFirebase(
    () => (!demoMode && user && firestore ? collection(firestore, `users/${user.uid}/applicationActivity`) : null),
    [demoMode, firestore, user]
  );

  const { data: jobsData, isLoading: isJobsLoading } = useCollection<JobApplication>(jobsQuery);

  useEffect(() => {
    if (!demoMode) return;
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as JobApplication[];
      setDemoJobs(parsed.map((j) => normalizeJob(j)));
    } catch {
      setDemoJobs([]);
    } finally {
      setDemoHydrated(true);
    }
  }, [demoMode]);

  useEffect(() => {
    if (!demoMode || !demoHydrated) return;
    localStorage.setItem(DEMO_KEY, JSON.stringify(demoJobs));
  }, [demoJobs, demoMode, demoHydrated]);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    const apply = () => setIsCoarsePointer(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  const jobs = useMemo(() => {
    if (optimisticJobs) return optimisticJobs;
    if (demoMode) return demoJobs;
    return (jobsData ?? []).map((item) => normalizeJob(item));
  }, [demoJobs, demoMode, jobsData, optimisticJobs]);

  useEffect(() => {
    if (!optimisticJobs) return;
    if (demoMode) return;
    setOptimisticJobs(null);
  }, [jobsData, optimisticJobs, demoMode]);

  const grouped = useMemo(() => groupJobsByStatus(jobs), [jobs]);
  const counts = useMemo(() => countByStatus(jobs), [jobs]);
  const pendingEnrichmentJob = useMemo(
    () => jobs.find((job) => job.id === pendingEnrichmentJobId) ?? null,
    [jobs, pendingEnrichmentJobId]
  );
  const shouldShowEnrichmentPrompt =
    Boolean(pendingEnrichmentJob) &&
    (!enrichmentPromptSnoozedUntil || Date.now() >= enrichmentPromptSnoozedUntil);

  function hasEnrichmentDetails(job: JobApplication): boolean {
    return Boolean(
      job.location.trim() ||
        job.salary.trim() ||
        job.jobUrl.trim() ||
        job.notes.trim() ||
        (job.nextAction ?? '').trim()
    );
  }

  async function logActivity(jobId: string, action: JobActivityAction) {
    if (!activityQuery || demoMode) return;
    await addDocumentNonBlocking(activityQuery, {
      jobId,
      action,
      createdAt: new Date().toISOString(),
    });
  }

  async function createJob(input: JobApplicationInput) {
    const hasDetails =
      Boolean(input.location.trim()) ||
      Boolean(input.salary.trim()) ||
      Boolean(input.jobUrl.trim()) ||
      Boolean(input.notes.trim());
    const now = new Date().toISOString();
    const payload = {
      ...input,
      dateAdded: now,
      updatedAt: now,
      dateApplied: input.status === 'applied' ? now : undefined,
    };

    if (demoMode) {
      const localId = `demo-${crypto.randomUUID()}`;
      const next = [...demoJobs, normalizeJob({ id: localId, ...payload })];
      setDemoJobs(next);
      trackEvent('job_added', { source: 'demo', status: input.status, quick_add: !hasDetails });
      if (!hasDetails) {
        setPendingEnrichmentJobId(localId);
        setEnrichmentPromptSnoozedUntil(null);
      }
      return;
    }
    if (!jobsQuery) return;
    setIsSubmitting(true);
    try {
      const ref = await addDocumentNonBlocking(jobsQuery, payload);
      setOptimisticJobs((prev) => prev ?? [...jobs, normalizeJob({ id: ref.id, ...payload })]);
      await logActivity(ref.id, 'created');
      trackEvent('job_added', { source: 'job_form', status: input.status, quick_add: !hasDetails });
      if (!hasDetails) {
        setPendingEnrichmentJobId(ref.id);
        setEnrichmentPromptSnoozedUntil(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateJob(
    jobId: string,
    patch: Partial<JobApplication>,
    source: 'detail_save' | 'followup_snooze' | 'followup_complete' = 'detail_save'
  ) {
    const current = jobs.find((job) => job.id === jobId);
    const updatePatch = { ...patch, updatedAt: new Date().toISOString() };
    const nextCandidate = current ? normalizeJob({ ...current, ...updatePatch, id: jobId }) : null;
    if (demoMode) {
      setDemoJobs((prev) => prev.map((job) => (job.id === jobId ? normalizeJob({ ...job, ...updatePatch }) : job)));
      if (current && patch.status && patch.status !== current.status) {
        trackEvent('job_stage_changed', { from: current.status, to: patch.status, source: 'detail_panel' });
      }
      if (patch.nextFollowUpAt) trackEvent('job_followup_set', { source });
      if (source === 'followup_snooze') trackEvent('job_followup_snoozed', { source });
      if (source === 'followup_complete') trackEvent('job_followup_completed', { source });
      if (
        source === 'detail_save' &&
        pendingEnrichmentJobId === jobId &&
        nextCandidate &&
        hasEnrichmentDetails(nextCandidate)
      ) {
        trackEvent('job_add_enrich_complete', { source: 'detail_panel' });
        setPendingEnrichmentJobId(null);
        setEnrichmentPromptSnoozedUntil(null);
        toast({
          title: 'Details saved',
          description: 'Great. This job now has richer context for follow-ups and tracking.',
        });
      }
      return;
    }
    if (!user || !firestore) return;
    updateDocumentNonBlocking(doc(firestore, `users/${user.uid}/jobApplications/${jobId}`), updatePatch);
    await logActivity(jobId, 'updated');
    if (current && patch.status && patch.status !== current.status) {
      trackEvent('job_stage_changed', { from: current.status, to: patch.status, source: 'detail_panel' });
      await logActivity(jobId, 'status_changed');
    }
    if (patch.nextFollowUpAt) {
      trackEvent('job_followup_set', { source });
      await logActivity(jobId, 'followup_set');
    }
    if (source === 'followup_snooze') {
      trackEvent('job_followup_snoozed', { source });
      await logActivity(jobId, 'followup_snoozed');
    }
    if (source === 'followup_complete') {
      trackEvent('job_followup_completed', { source });
      await logActivity(jobId, 'followup_completed');
    }
    if (
      source === 'detail_save' &&
      pendingEnrichmentJobId === jobId &&
      nextCandidate &&
      hasEnrichmentDetails(nextCandidate)
    ) {
      trackEvent('job_add_enrich_complete', { source: 'detail_panel' });
      setPendingEnrichmentJobId(null);
      setEnrichmentPromptSnoozedUntil(null);
      toast({
        title: 'Details saved',
        description: 'Great. This job now has richer context for follow-ups and tracking.',
      });
    }
  }

  async function deleteJob(jobId: string) {
    if (demoMode) {
      setDemoJobs((prev) => prev.filter((job) => job.id !== jobId));
      return;
    }
    if (!user || !firestore) return;
    deleteDocumentNonBlocking(doc(firestore, `users/${user.uid}/jobApplications/${jobId}`));
    await logActivity(jobId, 'deleted');
  }

  async function moveJob(
    jobId: string,
    status: JobStatus,
    source: 'quick_action' | 'menu' | 'drag' = 'drag'
  ) {
    const moved = moveJobStatus(jobs, jobId, status);
    if (!moved.changed) return;
    const previous = jobs.find((j) => j.id === jobId);
    if (!previous) return;

    if (demoMode) {
      setDemoJobs(moved.items);
      trackEvent('job_stage_changed', {
        from: previous.status,
        to: status,
        source,
      });
      return;
    }
    if (!user || !firestore) return;

    setOptimisticJobs(moved.items);
    const patch: Partial<JobApplication> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (moved.autoDateApplied) patch.dateApplied = moved.autoDateApplied;

    try {
      updateDocumentNonBlocking(doc(firestore, `users/${user.uid}/jobApplications/${jobId}`), patch);
      await logActivity(jobId, 'status_changed');
      if (moved.autoDateApplied) await logActivity(jobId, 'date_applied_auto_set');
      trackEvent('job_stage_changed', {
        from: previous.status,
        to: status,
        source,
      });
    } catch {
      setOptimisticJobs(jobs);
      toast({
        variant: 'destructive',
        title: 'Could not update stage',
        description: 'We restored the previous stage. Try again in a moment.',
      });
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isCoarsePointer
        ? {
            delay: 180,
            tolerance: 10,
          }
        : {
            distance: 6,
          },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    let targetStatus: JobStatus | null = null;
    if (JOB_STATUS_ORDER.includes(overId as JobStatus)) {
      targetStatus = overId as JobStatus;
    } else {
      const targetJob = jobs.find((job) => job.id === overId);
      targetStatus = targetJob?.status ?? null;
    }
    if (!targetStatus) return;
    void moveJob(activeId, targetStatus, 'drag');
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (!JOB_STATUS_ORDER.includes(overId as JobStatus)) return;
    const targetStatus = overId as JobStatus;
    const current = jobs.find((job) => job.id === activeId);
    if (!current || current.status === targetStatus) return;
    void moveJob(activeId, targetStatus, 'drag');
  }

  if (!demoMode && !user) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center">
        <p className="font-semibold">Sign in to use your Job Tracker board</p>
        <p className="text-sm text-muted-foreground mt-1">Track each application from saved to offer in one place.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    );
  }

  if (!demoMode && isJobsLoading) {
    return (
      <div className="rounded-2xl border p-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-headline font-bold inline-flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-primary" />
            My Job Search Board
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Move jobs across stages and keep context in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <JobFormDialog onCreate={createJob} isSubmitting={isSubmitting} />
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex gap-3 overflow-auto">
        {JOB_STATUS_ORDER.map((status) => (
          <span key={status}>
            {JOB_STATUS_ORDER.indexOf(status) + 1}. {status.toUpperCase()} ({counts[status]})
          </span>
        ))}
      </div>

      {shouldShowEnrichmentPrompt ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p>
            <span className="font-semibold">Nice start.</span> Add quick details for{' '}
            <span className="font-semibold">{pendingEnrichmentJob?.company ?? 'this role'}</span> to improve follow-up quality.
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedJob(pendingEnrichmentJob);
                setIsPanelOpen(true);
                trackEvent('job_add_enrich_start', { source: 'quick_add_prompt' });
              }}
            >
              Add details now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const snoozeMs = 10 * 60 * 1000;
                setEnrichmentPromptSnoozedUntil(Date.now() + snoozeMs);
                trackEvent('job_add_enrich_snoozed', { source: 'quick_add_prompt', minutes: 10 });
              }}
            >
              Later
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border p-2">
          <p className="text-muted-foreground">Due today</p>
          <p className="font-semibold">{jobs.filter((j) => getFollowUpState(j.nextFollowUpAt) === 'today').length}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-muted-foreground">Overdue</p>
          <p className="font-semibold">{jobs.filter((j) => getFollowUpState(j.nextFollowUpAt) === 'overdue').length}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-muted-foreground">This week</p>
          <p className="font-semibold">
            {
              jobs.filter((j) => {
                if (!j.nextFollowUpAt) return false;
                const due = new Date(j.nextFollowUpAt);
                if (Number.isNaN(due.getTime())) return false;
                const now = new Date();
                const in7 = new Date();
                in7.setDate(in7.getDate() + 7);
                return due >= now && due <= in7;
              }).length
            }
          </p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {JOB_STATUS_ORDER.map((status) => (
            <JobColumn
              key={status}
              status={status}
              items={grouped[status]}
              onOpen={(job) => {
                setSelectedJob(job);
                setIsPanelOpen(true);
              }}
              onMove={moveJob}
              onDelete={deleteJob}
            />
          ))}
        </div>
      </DndContext>

      <div className="md:hidden flex items-center justify-center gap-1">
        {JOB_STATUS_ORDER.map((status) => (
          <span key={status} className={`h-1.5 w-1.5 rounded-full ${counts[status] ? 'bg-primary/70' : 'bg-muted-foreground/30'}`} />
        ))}
      </div>

      <JobDetailPanel
        job={selectedJob}
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        onSave={(jobId, patch, source) => {
          void updateJob(jobId, patch, source);
        }}
      />
    </div>
  );
}
