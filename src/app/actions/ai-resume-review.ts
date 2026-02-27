'use server';

import { reviewResume as reviewResumeFlow } from '@/ai/flows/ai-resume-review';
import type { ReviewResumeOutput } from '@/ai/flows/ai-resume-review';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

export type { ReviewResumeOutput };

const schema = z.object({
  resumeContent: z.string().min(1, 'Resume content is required').max(50_000, 'Resume content too large'),
});

export const reviewResume = async (input: z.infer<typeof schema>, userId?: string) =>
  guardedAction(schema, (validated) => reviewResumeFlow(validated))(input, userId);
