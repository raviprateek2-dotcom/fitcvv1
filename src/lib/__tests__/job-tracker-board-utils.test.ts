import { groupJobsByStatus, moveJobStatus } from '@/lib/job-tracker/board-utils';
import { validateJobInput } from '@/lib/job-tracker/validation';
import type { JobApplication } from '@/lib/job-tracker/types';

function makeJob(partial: Partial<JobApplication> & Pick<JobApplication, 'id' | 'status'>): JobApplication {
  const now = '2026-04-15T00:00:00.000Z';
  return {
    id: partial.id,
    title: partial.title ?? 'Ops Manager',
    company: partial.company ?? 'Swiggy',
    location: partial.location ?? 'Bangalore',
    salary: partial.salary ?? '₹18-24 LPA',
    jobUrl: partial.jobUrl ?? 'https://example.com/job',
    status: partial.status,
    dateAdded: partial.dateAdded ?? now,
    notes: partial.notes ?? 'Initial note',
    rating: partial.rating ?? 2,
    tags: partial.tags ?? [],
    atsKeywords: partial.atsKeywords ?? [],
    updatedAt: partial.updatedAt ?? now,
    dateApplied: partial.dateApplied,
    deadline: partial.deadline,
    resumeUsed: partial.resumeUsed,
    coverLetterUsed: partial.coverLetterUsed,
    nextAction: partial.nextAction,
    interviewDate: partial.interviewDate,
    interviewRound: partial.interviewRound,
    matchScore: partial.matchScore,
  };
}

describe('job tracker utilities', () => {
  test('groupJobsByStatus returns all fixed columns', () => {
    const grouped = groupJobsByStatus([
      makeJob({ id: '1', status: 'saved' }),
      makeJob({ id: '2', status: 'applied' }),
      makeJob({ id: '3', status: 'interview' }),
    ]);

    expect(grouped.saved).toHaveLength(1);
    expect(grouped.applied).toHaveLength(1);
    expect(grouped.interview).toHaveLength(1);
    expect(grouped.offer).toHaveLength(0);
    expect(grouped.rejected).toHaveLength(0);
  });

  test('moveJobStatus auto-sets dateApplied when moving into applied', () => {
    const initial = [makeJob({ id: '1', status: 'saved' })];
    const moved = moveJobStatus(initial, '1', 'applied');
    expect(moved.changed).toBe(true);
    expect(moved.items[0].status).toBe('applied');
    expect(moved.items[0].dateApplied).toBeTruthy();
    expect(moved.autoDateApplied).toBeTruthy();
  });

  test('validateJobInput enforces required fields and URL shape', () => {
    const errors = validateJobInput({
      title: '',
      company: '',
      location: '',
      salary: '',
      jobUrl: 'example.com/job',
      status: 'saved',
      notes: '',
      rating: 2,
      tags: [],
      atsKeywords: [],
    });

    expect(errors).toContain('Company is required.');
    expect(errors).toContain('Role title is required.');
    expect(errors).toContain('Job URL must start with http:// or https://');
  });
});
