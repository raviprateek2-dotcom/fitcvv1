'use server';

import { analyzeResume as analyzeResumeFlow } from '@/ai/flows/ai-resume-analyzer';
import type { AnalyzeResumeInput } from '@/ai/flows/ai-resume-analyzer';

export async function analyzeResume(input: AnalyzeResumeInput) {
  try {
    const result = await analyzeResumeFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI resume analyzer failed:', error);
    return { success: false, error: error.message || 'Failed to analyze resume. Please try again later.' };
  }
}
