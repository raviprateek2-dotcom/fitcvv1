'use server';

import { writeResumeSection as writeResumeSectionFlow } from '@/ai/flows/ai-section-writer';
import type { WriteResumeSectionInput } from '@/ai/flows/ai-section-writer';

export async function writeResumeSection(input: WriteResumeSectionInput) {
  try {
    const result = await writeResumeSectionFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI section writer failed:', error);
    return { success: false, error: error.message || 'Failed to generate AI content. Please try again later.' };
  }
}
