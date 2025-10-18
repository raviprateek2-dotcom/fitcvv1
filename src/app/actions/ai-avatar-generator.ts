
'use server';

import { generateAvatar as generateAvatarFlow, type GenerateAvatarInput } from '@/ai/flows/ai-avatar-generator';

export async function generateAvatar(input: GenerateAvatarInput) {
  try {
    const result = await generateAvatarFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI avatar generator failed:', error);
    return { success: false, error: error.message || 'Failed to generate avatar. Please try again later.' };
  }
}
