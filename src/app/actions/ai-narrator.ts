
'use server';

import { aiNarrate as aiNarrateFlow } from '@/ai/flows/ai-narrator';

export async function aiNarrate(text: string) {
  try {
    const result = await aiNarrateFlow(text);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI narrator failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate audio. Please try again later.',
    };
  }
}
