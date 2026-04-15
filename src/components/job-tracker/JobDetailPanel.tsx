'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ExternalLink, Star } from 'lucide-react';
import type { JobApplication, JobStatus } from '@/lib/job-tracker/types';
import { JOB_STATUS_LABELS } from '@/lib/job-tracker/types';
import { fromInputDateTimeValue, getFollowUpSummary, toInputDateTimeValue } from '@/lib/job-tracker/reminder-utils';

type Props = {
  job: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (jobId: string, patch: Partial<JobApplication>, source?: 'detail_save' | 'followup_snooze' | 'followup_complete') => void;
};

export function JobDetailPanel({ job, open, onOpenChange, onSave }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [status, setStatus] = useState<JobStatus>('saved');
  const [nextFollowUpAt, setNextFollowUpAt] = useState('');

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!job) return;
    setNotes(job.notes ?? '');
    setNextAction(job.nextAction ?? '');
    setStatus(job.status);
    setNextFollowUpAt(toInputDateTimeValue(job.nextFollowUpAt));
  }, [job]);

  const title = useMemo(() => {
    if (!job) return 'Job details';
    return `${job.company} — ${job.title}`;
  }, [job]);

  if (!job) return null;
  const followUp = getFollowUpSummary(job);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className={isMobile ? 'h-[88vh] max-h-[88vh]' : 'w-full sm:max-w-xl'}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Track this application and update progress as you move forward.</SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-5 overflow-y-auto pr-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{job.location}</Badge>
            {job.salary ? <Badge variant="outline">{job.salary}</Badge> : null}
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3" />
              {job.rating}
            </span>
          </div>

          <div className="rounded-xl border p-3 space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Timeline</p>
            <p className="text-sm inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Added {new Date(job.dateAdded).toLocaleDateString('en-IN')}
            </p>
            {job.dateApplied ? <p className="text-sm">Applied {new Date(job.dateApplied).toLocaleDateString('en-IN')}</p> : null}
            {job.jobUrl ? (
              <a href={job.jobUrl} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1">
                Open Job Posting
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as JobStatus)}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((value) => (
                  <SelectItem key={value} value={value}>
                    {JOB_STATUS_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next-action">Next action</Label>
            <Input
              id="next-action"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="Follow up on Friday / Prepare case study"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next-followup">Follow-up reminder</Label>
            <Input
              id="next-followup"
              type="datetime-local"
              value={nextFollowUpAt}
              onChange={(e) => setNextFollowUpAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{followUp.label}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const due = new Date();
                  due.setDate(due.getDate() + 1);
                  const iso = due.toISOString();
                  onSave(
                    job.id,
                    {
                      nextFollowUpAt: iso,
                      followUpCount: (job.followUpCount ?? 0) + 1,
                    },
                    'followup_snooze'
                  );
                  setNextFollowUpAt(toInputDateTimeValue(iso));
                }}
              >
                Snooze 1 day
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const due = new Date();
                  due.setDate(due.getDate() + 3);
                  const iso = due.toISOString();
                  onSave(
                    job.id,
                    {
                      nextFollowUpAt: iso,
                      followUpCount: (job.followUpCount ?? 0) + 1,
                    },
                    'followup_snooze'
                  );
                  setNextFollowUpAt(toInputDateTimeValue(iso));
                }}
              >
                Snooze 3 days
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onSave(
                    job.id,
                    {
                      lastFollowUpAt: new Date().toISOString(),
                      nextFollowUpAt: undefined,
                      followUpCount: (job.followUpCount ?? 0) + 1,
                    },
                    'followup_complete'
                  );
                  setNextFollowUpAt('');
                }}
              >
                Mark follow-up done
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-notes-editor">Notes</Label>
            <Textarea
              id="job-notes-editor"
              value={notes}
              rows={7}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interview notes, recruiter context, prep checklist..."
            />
          </div>

          <div className="sticky bottom-0 bg-card/95 backdrop-blur py-2">
            <Button
              className="w-full min-h-[46px]"
              onClick={() => {
                const followUpPatch = nextFollowUpAt
                  ? {
                      nextFollowUpAt: fromInputDateTimeValue(nextFollowUpAt),
                    }
                  : {
                      nextFollowUpAt: undefined,
                    };
                onSave(job.id, { notes, nextAction, status, ...followUpPatch }, 'detail_save');
                onOpenChange(false);
              }}
            >
              Save updates
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
