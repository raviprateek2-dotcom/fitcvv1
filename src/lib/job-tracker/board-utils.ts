import { JOB_STATUS_ORDER, type JobApplication, type JobStatus } from './types';

export function groupJobsByStatus(items: JobApplication[]): Record<JobStatus, JobApplication[]> {
  const grouped: Record<JobStatus, JobApplication[]> = {
    saved: [],
    applied: [],
    interview: [],
    offer: [],
    rejected: [],
  };

  for (const item of items) {
    grouped[item.status].push(item);
  }

  for (const status of JOB_STATUS_ORDER) {
    grouped[status].sort((a, b) => (b.updatedAt ?? b.dateAdded).localeCompare(a.updatedAt ?? a.dateAdded));
  }

  return grouped;
}

export function moveJobStatus(
  items: JobApplication[],
  jobId: string,
  toStatus: JobStatus
): {
  items: JobApplication[];
  changed: boolean;
  autoDateApplied?: string;
} {
  let changed = false;
  let autoDateApplied: string | undefined;

  const next = items.map((item) => {
    if (item.id !== jobId) return item;
    if (item.status === toStatus) return item;

    changed = true;
    const now = new Date().toISOString();
    const update: JobApplication = {
      ...item,
      status: toStatus,
      updatedAt: now,
    };

    if (toStatus === 'applied' && !item.dateApplied) {
      update.dateApplied = now;
      autoDateApplied = now;
    }
    return update;
  });

  return { items: next, changed, autoDateApplied };
}

export function countByStatus(items: JobApplication[]): Record<JobStatus, number> {
  const grouped = groupJobsByStatus(items);
  return {
    saved: grouped.saved.length,
    applied: grouped.applied.length,
    interview: grouped.interview.length,
    offer: grouped.offer.length,
    rejected: grouped.rejected.length,
  };
}
