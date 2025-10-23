
'use server';

import { mockInterview as mockInterviewFlow } from '@/ai/flows/ai-mock-interviewer';
import type { MockInterviewInput } from './schemas/ai-mock-interviewer';

export async function mockInterview(input: MockInterviewInput) {
  try {
    const result = await mockInterviewFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI mock interview failed:', error);
    return { success: false, error: error.message || 'Failed to get interview feedback. Please try again later.' };
  }
}
