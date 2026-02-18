'use server';

import { optimizeLinkedInProfile as optimizeLinkedInFlow, type OptimizeLinkedInInput } from '@/ai/flows/ai-linkedin-optimizer';

export async function optimizeLinkedInProfile(input: OptimizeLinkedInInput) {
  try {
    const result = await optimizeLinkedInFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI LinkedIn Optimizer failed:', error);
    return { success: false, error: error.message || 'Failed to optimize LinkedIn profile. Please try again.' };
  }
}
