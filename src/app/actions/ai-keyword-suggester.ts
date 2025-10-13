'use server';

import { suggestKeywords as suggestKeywordsFlow } from '@/ai/flows/ai-keyword-suggester';
import type { SuggestKeywordsInput } from '@/ai/flows/ai-keyword-suggester';

export async function suggestKeywords(input: SuggestKeywordsInput) {
  try {
    const result = await suggestKeywordsFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI keyword suggester failed:', error);
    return { success: false, error: error.message || 'Failed to get AI keyword suggestions.' };
  }
}
