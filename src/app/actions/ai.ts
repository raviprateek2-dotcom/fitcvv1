'use server';

import { suggestResumeImprovements as suggestResumeImprovementsFlow } from '@/ai/flows/ai-content-suggestions';
import type { SuggestResumeImprovementsInput } from '@/ai/flows/ai-content-suggestions';

export async function suggestResumeImprovements(input: SuggestResumeImprovementsInput) {
  try {
    const result = await suggestResumeImprovementsFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI suggestion failed:', error);
    // In a real app, you might want to log this error to a monitoring service.
    return { success: false, error: 'Failed to get AI suggestions. Please try again later.' };
  }
}
