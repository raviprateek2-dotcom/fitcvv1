'use client';

import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarDays, ExternalLink, GripVertical, MoreHorizontal, Star } from 'lucide-react';
import type { JobApplication, JobStatus } from '@/lib/job-tracker/types';
import { JOB_STATUS_LABELS } from '@/lib/job-tracker/types';
import { cn } from '@/lib/utils';

type Props = {
  job: JobApplication;
  onOpen: (job: JobApplication) => void;
  onMove: (jobId: string, status: JobStatus) => void;
  onDelete: (jobId: string) => void;
};

function formatCompactDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function statusBadgeClass(status: JobStatus) {
  if (status === 'saved') return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  if (status === 'applied') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  if (status === 'interview') return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
  if (status === 'offer') return 'bg-green-500/10 text-green-500 border-green-500/20';
  return 'bg-red-500/10 text-red-500 border-red-500/20';
}

export const JobCard = memo(function JobCard({ job, onOpen, onMove, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-xl border bg-card p-3 shadow-sm transition-colors',
        isDragging ? 'opacity-60 border-primary/40' : 'hover:border-primary/30'
      )}
      data-testid={`job-card-${job.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="text-left flex-1 min-w-0"
          onClick={() => onOpen(job)}
          data-testid={`open-job-${job.id}`}
        >
          <p className="font-semibold truncate">{job.company}</p>
          <p className="text-sm text-muted-foreground truncate">{job.title}</p>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-grab active:cursor-grabbing"
            aria-label="Drag job card"
            data-testid={`drag-job-${job.id}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" data-testid={`job-menu-${job.id}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((status) => (
                <DropdownMenuItem key={status} onClick={() => onMove(job.id, status)}>
                  Move to {JOB_STATUS_LABELS[status]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(job.id)}>
                Delete job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={cn('capitalize', statusBadgeClass(job.status))}>
          {JOB_STATUS_LABELS[job.status]}
        </Badge>
        {job.jobUrl ? (
          <a href={job.jobUrl} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1">
            JD
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          {formatCompactDate(job.deadline || job.dateApplied || job.dateAdded)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3" />
          {job.rating}
        </span>
      </div>
    </div>
  );
});
