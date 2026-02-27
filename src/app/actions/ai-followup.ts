'use server';

import { writeFollowUpEmail } from '@/ai/flows/ai-followup-writer';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

const schema = z.object({
  jobTitle: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  interviewType: z.string().max(100),
  resumeContent: z.string().max(50_000, 'Resume content too large'),
});

// Keep the original exported name that callers use
export const generateFollowUpEmail = async (input: z.infer<typeof schema>, userId?: string) =>
  guardedAction(schema, (validated) => writeFollowUpEmail(validated))(input, userId);
