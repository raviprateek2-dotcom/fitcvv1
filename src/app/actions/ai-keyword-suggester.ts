'use server';

import { suggestKeywords as suggestKeywordsFlow } from '@/ai/flows/ai-keyword-suggester';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

const schema = z.object({
  resumeContent: z.string().min(1).max(50_000, 'Resume content too large'),
  jobDescription: z.string().min(1).max(10_000, 'Job description too large'),
});

export const suggestKeywords = async (input: z.infer<typeof schema>, userId?: string) =>
  guardedAction(schema, (validated) => suggestKeywordsFlow(validated))(input, userId);
