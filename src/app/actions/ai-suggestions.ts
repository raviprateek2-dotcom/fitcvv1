'use server';

import { suggestResumeImprovements as suggestResumeImprovementsFlow } from '@/ai/flows/ai-content-suggestions';
import type { SuggestResumeImprovementsInput } from '@/ai/flows/ai-content-suggestions';
import { writeResumeSection as writeResumeSectionFlow } from '@/ai/flows/ai-resume-section-writer';
import type { WriteResumeSectionInput } from '@/ai/flows/ai-resume-section-writer';

export async function suggestResumeImprovements(input: SuggestResumeImprovementsInput) {
  try {
    const result = await suggestResumeImprovementsFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI suggestion failed:', error);
    return { success: false, error: error.message || 'Failed to get AI suggestions. Please try again later.' };
  }
}

export async function writeResumeSection(input: WriteResumeSectionInput) {
  try {
    const result = await writeResumeSectionFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI section writer failed:', error);
    return { success: false, error: error.message || 'Failed to generate AI content. Please try again later.' };
  }
}
