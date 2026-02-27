'use server';

import { predictInterviewQuestions as predictFlow } from '@/ai/flows/ai-question-predictor';
import type { PredictQuestionsInput } from '@/ai/flows/ai-question-predictor';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

// Flow only takes: { jobDescription: string } — resumeContent is not in the flow schema
const schema = z.object({
  jobDescription: z.string().min(1, 'Job description is required').max(10_000, 'Job description too large'),
});

export const predictInterviewQuestions = async (input: PredictQuestionsInput, userId?: string) =>
  guardedAction(schema, (validated) => predictFlow(validated))(input, userId);
