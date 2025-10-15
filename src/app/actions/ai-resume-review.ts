
'use server';

import { reviewResume as reviewResumeFlow, type ReviewResumeOutput as ReviewResumeOutputFlow } from '@/ai/flows/ai-resume-review';
import type { ReviewResumeInput } from '@/ai/flows/ai-resume-review';

export type ReviewResumeOutput = ReviewResumeOutputFlow;

export async function reviewResume(input: ReviewResumeInput) {
  try {
    const result = await reviewResumeFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI resume review failed:', error);
    return { success: false, error: error.message || 'Failed to review resume. Please try again later.' };
  }
}
