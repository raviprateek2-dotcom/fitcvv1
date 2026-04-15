import type { JobApplicationInput } from './types';

export function validateJobInput(input: JobApplicationInput): string[] {
  const errors: string[] = [];
  if (!input.company.trim()) errors.push('Company is required.');
  if (!input.title.trim()) errors.push('Role title is required.');
  if (input.jobUrl && !/^https?:\/\//i.test(input.jobUrl.trim())) {
    errors.push('Job URL must start with http:// or https://');
  }
  return errors;
}
