
'use server';

import { parseResumeFromPdf as parseResumeFromPdfFlow } from '@/ai/flows/ai-resume-parser';

export async function parseResumeFromPdf(base64String: string) {
  try {
    const result = await parseResumeFromPdfFlow(base64String);
    
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to parse resume.');
    }

    // Add unique IDs on the server action side to ensure they are unique per request.
    const now = Date.now();
    result.data.resumeData.experience.forEach((item, index) => item.id = now + Math.random() + index);
    result.data.resumeData.education.forEach((item, index) => item.id = now + Math.random() + 100 + index);
    result.data.resumeData.skills.forEach((item, index) => item.id = now + Math.random() + 200 + index);
    result.data.resumeData.projects.forEach((item, index) => item.id = now + Math.random() + 300 + index);

    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI resume parser failed:', error);
    return { success: false, error: error.message || 'Failed to parse PDF. Please try again later.' };
  }
}

