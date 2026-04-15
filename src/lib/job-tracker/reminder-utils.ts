import type { JobApplication } from '@/lib/job-tracker/types';

export type FollowUpState = 'overdue' | 'today' | 'upcoming' | 'none';

export function toInputDateTimeValue(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60_000);
  return local.toISOString().slice(0, 16);
}

export function fromInputDateTimeValue(value: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function getFollowUpState(nextFollowUpAt?: string, now = new Date()): FollowUpState {
  if (!nextFollowUpAt) return 'none';
  const due = new Date(nextFollowUpAt);
  if (Number.isNaN(due.getTime())) return 'none';

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  if (due.getTime() < now.getTime()) return 'overdue';
  if (due >= start && due < end) return 'today';
  return 'upcoming';
}

export function getFollowUpSummary(job: JobApplication): { state: FollowUpState; label: string } {
  const state = getFollowUpState(job.nextFollowUpAt);
  if (state === 'none') return { state, label: 'No follow-up set' };

  const due = new Date(job.nextFollowUpAt as string);
  const dateLabel = Number.isNaN(due.getTime())
    ? 'Invalid date'
    : due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  if (state === 'overdue') return { state, label: `Overdue since ${dateLabel}` };
  if (state === 'today') return { state, label: `Follow up today (${dateLabel})` };
  return { state, label: `Next follow-up ${dateLabel}` };
}
