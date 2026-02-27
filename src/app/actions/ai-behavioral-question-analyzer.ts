'use server';

import { analyzeBehavioralAnswer as analyzeFlow } from '@/ai/flows/ai-behavioral-question-analyzer';
import { AnalyzeBehavioralAnswerInputSchema } from '@/app/actions/schemas/ai-behavioral-question-analyzer';
import type { AnalyzeBehavioralAnswerInput, AnalyzeBehavioralAnswerOutput } from '@/app/actions/schemas/ai-behavioral-question-analyzer';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

export type { AnalyzeBehavioralAnswerOutput };

// Extend schema with size limits (schema itself comes from the schemas/ folder)
const schema = AnalyzeBehavioralAnswerInputSchema.extend({
  userAnswer: z.string().min(1).max(10_000, 'Answer is too long'),
});

// Export both the canonical name and the legacy name used by existing callers
export const analyzeBehavioralAnswer = async (input: AnalyzeBehavioralAnswerInput, userId?: string) =>
  guardedAction(schema, (validated) => analyzeFlow(validated))(input, userId);

export { analyzeBehavioralAnswer as analyzeBehavioralQuestion };
