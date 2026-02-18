
'use server';

import { predictInterviewQuestions as predictFlow, type PredictQuestionsInput } from '@/ai/flows/ai-question-predictor';

export async function predictInterviewQuestions(input: PredictQuestionsInput) {
  try {
    const result = await predictFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI question predictor failed:', error);
    return { success: false, error: error.message || 'Failed to predict questions. Please try again.' };
  }
}
