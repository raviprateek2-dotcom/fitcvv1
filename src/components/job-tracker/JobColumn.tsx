'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import type { JobApplication, JobStatus } from '@/lib/job-tracker/types';
import { JOB_STATUS_LABELS } from '@/lib/job-tracker/types';
import { JobCard } from './JobCard';
import { cn } from '@/lib/utils';

type Props = {
  status: JobStatus;
  items: JobApplication[];
  onOpen: (job: JobApplication) => void;
  onMove: (jobId: string, status: JobStatus) => void;
  onDelete: (jobId: string) => void;
};

export function JobColumn({ status, items, onOpen, onMove, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        'w-[290px] sm:w-[320px] shrink-0 rounded-2xl border bg-muted/25 p-3 snap-start',
        isOver ? 'border-primary/50 bg-primary/5' : 'border-border'
      )}
      data-testid={`column-${status}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide">{JOB_STATUS_LABELS[status]}</h2>
        <span className="text-xs text-muted-foreground">({items.length})</span>
      </div>

      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div className="space-y-2 min-h-[120px]">
          {items.map((job) => (
            <JobCard key={job.id} job={job} onOpen={onOpen} onMove={onMove} onDelete={onDelete} />
          ))}
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">No jobs yet</div>
          ) : null}
        </div>
      </SortableContext>
    </section>
  );
}
