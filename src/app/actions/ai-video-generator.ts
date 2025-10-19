
'use server';

import { generateVideo as generateVideoFlow, type GenerateVideoInput } from '@/ai/flows/ai-video-generator';

export async function generateVideo(input: GenerateVideoInput) {
  try {
    const result = await generateVideoFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI video generator failed:', error);
    return { success: false, error: error.message || 'Failed to generate video. Please try again later.' };
  }
}
