'use server';

import { analyzeBehavioralAnswer as analyzeBehavioralAnswerFlow } from '@/ai/flows/ai-behavioral-question-analyzer';
import type { AnalyzeBehavioralAnswerInput } from '@/ai/flows/ai-behavioral-question-analyzer';

export async function analyzeBehavioralAnswer(input: AnalyzeBehavioralAnswerInput) {
  try {
    const result = await analyzeBehavioralAnswerFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI behavioral answer analyzer failed:', error);
    return { success: false, error: error.message || 'Failed to analyze your answer. Please try again later.' };
  }
}
