
'use server';

import { writeFollowUpEmail as writeFlow, type FollowUpInput } from '@/ai/flows/ai-followup-writer';

export async function generateFollowUpEmail(input: FollowUpInput) {
  try {
    const result = await writeFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI follow-up writer failed:', error);
    return { success: false, error: error.message || 'Failed to generate follow-up email.' };
  }
}
