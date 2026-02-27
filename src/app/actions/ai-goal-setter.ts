'use server';

import { generateCareerGoals as generateCareerGoalsFlow } from '@/ai/flows/ai-goal-setter';
import type { GenerateCareerGoalsInput, GenerateCareerGoalsOutput } from '@/ai/flows/ai-goal-setter';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

export type { GenerateCareerGoalsOutput };

// Flow expects: { jobTitle: string, jobDescription?: string }
const schema = z.object({
  jobTitle: z.string().min(1).max(200),
  jobDescription: z.string().max(10_000, 'Job description too large').optional(),
});

export const generateCareerGoals = async (input: GenerateCareerGoalsInput, userId?: string) =>
  guardedAction(schema, (validated) => generateCareerGoalsFlow(validated))(input, userId);
