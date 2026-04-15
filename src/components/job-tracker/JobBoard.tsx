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
import { JobFormDialog } from './JobFormDialog';
import { JobColumn } from './JobColumn';
import { JobDetailPanel } from './JobDetailPanel';
import { countByStatus, groupJobsByStatus, moveJobStatus } from '@/lib/job-tracker/board-utils';
import { JOB_STATUS_ORDER, type JobActivityAction, type JobApplication, type JobApplicationInput, type JobStatus } from '@/lib/job-tracker/types';

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
  const [demoJobs, setDemoJobs] = useState<JobApplication[]>([]);
  const [demoHydrated, setDemoHydrated] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

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
    if (demoMode) return demoJobs;
    return (jobsData ?? []).map((item) => normalizeJob(item));
  }, [demoJobs, demoMode, jobsData]);

  const grouped = useMemo(() => groupJobsByStatus(jobs), [jobs]);
  const counts = useMemo(() => countByStatus(jobs), [jobs]);

  async function logActivity(jobId: string, action: JobActivityAction) {
    if (!activityQuery || demoMode) return;
    await addDocumentNonBlocking(activityQuery, {
      jobId,
      action,
      createdAt: new Date().toISOString(),
    });
  }

  async function createJob(input: JobApplicationInput) {
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
      return;
    }
    if (!jobsQuery) return;
    setIsSubmitting(true);
    try {
      const ref = await addDocumentNonBlocking(jobsQuery, payload);
      await logActivity(ref.id, 'created');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateJob(jobId: string, patch: Partial<JobApplication>) {
    const updatePatch = { ...patch, updatedAt: new Date().toISOString() };
    if (demoMode) {
      setDemoJobs((prev) => prev.map((job) => (job.id === jobId ? normalizeJob({ ...job, ...updatePatch }) : job)));
      return;
    }
    if (!user || !firestore) return;
    updateDocumentNonBlocking(doc(firestore, `users/${user.uid}/jobApplications/${jobId}`), updatePatch);
    await logActivity(jobId, 'updated');
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

  async function moveJob(jobId: string, status: JobStatus) {
    const moved = moveJobStatus(jobs, jobId, status);
    if (!moved.changed) return;

    if (demoMode) {
      setDemoJobs(moved.items);
      return;
    }
    if (!user || !firestore) return;

    const patch: Partial<JobApplication> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (moved.autoDateApplied) patch.dateApplied = moved.autoDateApplied;

    updateDocumentNonBlocking(doc(firestore, `users/${user.uid}/jobApplications/${jobId}`), patch);
    await logActivity(jobId, 'status_changed');
    if (moved.autoDateApplied) await logActivity(jobId, 'date_applied_auto_set');
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
    void moveJob(activeId, targetStatus);
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
    void moveJob(activeId, targetStatus);
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
        onSave={(jobId, patch) => {
          void updateJob(jobId, patch);
        }}
      />
    </div>
  );
}
