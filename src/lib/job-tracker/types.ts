export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export type JobContact = {
  id: string;
  name: string;
  role?: string;
  email?: string;
  linkedinUrl?: string;
  notes?: string;
};

export type JobActivityAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'date_applied_auto_set'
  | 'note_updated'
  | 'followup_set'
  | 'followup_snoozed'
  | 'followup_completed';

export type JobApplication = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobUrl: string;
  status: JobStatus;
  dateAdded: string;
  dateApplied?: string;
  deadline?: string;
  resumeUsed?: string;
  coverLetterUsed?: string;
  notes: string;
  nextAction?: string;
  interviewDate?: string;
  interviewRound?: number;
  nextFollowUpAt?: string;
  lastFollowUpAt?: string;
  followUpCount?: number;
  rating: 1 | 2 | 3;
  tags: string[];
  atsKeywords: string[];
  matchScore?: number;
  updatedAt: string;
};

export type JobApplicationInput = Omit<JobApplication, 'id' | 'dateAdded' | 'updatedAt'>;

export type JobApplicationDoc = Omit<JobApplication, 'id'>;

export const JOB_STATUS_ORDER: JobStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected'];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};
