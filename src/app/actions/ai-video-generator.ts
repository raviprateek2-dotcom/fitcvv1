'use server';

import { generateVideo as generateVideoFlow } from '@/ai/flows/ai-video-generator';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

const schema = z.object({
  prompt: z.string().min(1).max(1_000, 'Video prompt too long'),
});

export const generateVideo = async (input: z.infer<typeof schema>, userId?: string) =>
  guardedAction(schema, (validated) => generateVideoFlow(validated))(input, userId);
