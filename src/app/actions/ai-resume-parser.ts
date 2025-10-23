
'use server';

import { parseResumeFromPdf as parseResumeFromPdfFlow } from '@/ai/flows/ai-resume-parser';

export async function parseResumeFromPdf(base64String: string) {
  try {
    const result = await parseResumeFromPdfFlow(base64String);
    
    // The flow returns the data directly. If it fails, it throws an error.
    if (!result || !result.resumeData) {
        throw new Error('AI flow did not return valid resume data.');
    }

    // Add unique IDs on the server action side to ensure they are unique per request.
    const now = Date.now();
    result.resumeData.experience.forEach((item, index) => item.id = now + Math.random() + index);
    result.resumeData.education.forEach((item, index) => item.id = now + Math.random() + 100 + index);
    result.resumeData.skills?.forEach((item, index) => item.id = now + Math.random() + 200 + index);
    result.resumeData.projects?.forEach((item, index) => item.id = now + Math.random() + 300 + index);

    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI resume parser failed:', error);
    return { success: false, error: error.message || 'Failed to parse PDF. Please try again later.' };
  }
}
