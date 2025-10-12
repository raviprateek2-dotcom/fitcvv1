'use server';

import { writeCoverLetter as writeCoverLetterFlow } from '@/ai/flows/ai-cover-letter-writer';
import type { WriteCoverLetterInput } from '@/ai/flows/ai-cover-letter-writer';

export async function writeCoverLetter(input: WriteCoverLetterInput) {
  try {
    const result = await writeCoverLetterFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI cover letter writer failed:', error);
    return { success: false, error: error.message || 'Failed to generate AI content. Please try again later.' };
  }
}
