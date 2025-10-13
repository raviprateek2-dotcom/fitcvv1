'use server';

import { parseResumeFromPdf as parseResumeFromPdfFlow } from '@/ai/flows/ai-resume-parser';

export async function parseResumeFromPdf(fileBuffer: Buffer) {
  try {
    const result = await parseResumeFromPdfFlow(fileBuffer);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI resume parser failed:', error);
    return { success: false, error: error.message || 'Failed to parse PDF. Please try again later.' };
  }
}
