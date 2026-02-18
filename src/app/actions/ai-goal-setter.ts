
'use server';

import { generateCareerGoals as generateCareerGoalsFlow, type GenerateCareerGoalsInput } from '@/ai/flows/ai-goal-setter';

export async function generateCareerGoals(input: GenerateCareerGoalsInput) {
  try {
    const result = await generateCareerGoalsFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI goal setter failed:', error);
    return { success: false, error: error.message || 'Failed to generate career goals. Please try again.' };
  }
}
