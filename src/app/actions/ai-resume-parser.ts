'use server';

import { parseResumeFromPdf as parseResumeFromPdfFlow } from '@/ai/flows/ai-resume-parser';
import { z } from 'zod';
import { aiRateLimiter } from '@/lib/rate-limit';

// Base64 PDF strings are large (a 1MB PDF ≈ 1.33MB base64). Cap at ~5MB base64.
const MAX_BASE64_SIZE = 5 * 1024 * 1024; // 5MB

const schema = z.string()
  .min(1, 'No file data provided')
  .max(MAX_BASE64_SIZE, 'File too large. Maximum size is ~3.8MB PDF.');

export async function parseResumeFromPdf(base64String: string, userId = 'anonymous') {
  // Validate size first (fast, no computation needed)
  const parsed = schema.safeParse(base64String);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.errors[0]?.message ?? 'Invalid input' };
  }

  // Rate limit
  if (!aiRateLimiter.check(userId)) {
    return { success: false as const, error: 'Rate limit exceeded. Please wait before parsing another PDF.' };
  }

  try {
    const result = await parseResumeFromPdfFlow(base64String);

    if (!result || !result.resumeData) {
      throw new Error('AI flow did not return valid resume data.');
    }

    // Add unique IDs on the server so they're consistent per request
    const now = Date.now();
    result.resumeData.experience.forEach((item, index) => { item.id = now + Math.random() + index; });
    result.resumeData.education.forEach((item, index) => { item.id = now + Math.random() + 100 + index; });
    result.resumeData.skills?.forEach((item, index) => { item.id = now + Math.random() + 200 + index; });
    result.resumeData.projects?.forEach((item, index) => { item.id = now + Math.random() + 300 + index; });

    return { success: true as const, data: result };
  } catch (error: unknown) {
    console.error('AI resume parser failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse PDF. Please try again later.';
    return { success: false as const, error: message };
  }
}
