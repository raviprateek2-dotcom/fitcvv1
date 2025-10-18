
'use server';

import { suggestTitle as suggestTitleFlow } from '@/ai/flows/ai-title-suggester';
import type { SuggestTitleInput } from '@/ai/flows/ai-title-suggester';

export async function suggestTitle(input: SuggestTitleInput) {
  try {
    const result = await suggestTitleFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI title suggester failed:', error);
    return { success: false, error: error.message || 'Failed to get AI title suggestion.' };
  }
}
