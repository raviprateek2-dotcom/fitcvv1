'use server';

import { writeCoverLetter as writeCoverLetterFlow } from '@/ai/flows/ai-cover-letter-writer';
import type { WriteCoverLetterInput } from '@/ai/flows/ai-cover-letter-writer';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

// Must match the flow: jobTitle + companyName + resumeContent + tone (bold/professional/friendly)
const schema = z.object({
  jobTitle: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  resumeContent: z.string().min(1).max(50_000, 'Resume content too large'),
  tone: z.enum(['professional', 'bold', 'friendly']),
});

export const writeCoverLetter = async (input: WriteCoverLetterInput, userId?: string) =>
  guardedAction(schema, (validated) => writeCoverLetterFlow(validated))(input, userId);
