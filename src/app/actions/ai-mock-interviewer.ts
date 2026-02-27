'use server';

import { mockInterview as mockInterviewFlow } from '@/ai/flows/ai-mock-interviewer';
import { MockInterviewInputSchema } from '@/app/actions/schemas/ai-mock-interviewer';
import { guardedAction } from '@/lib/action-guard';
import type { z } from 'zod';

export const mockInterview = async (input: z.infer<typeof MockInterviewInputSchema>, userId?: string) =>
  guardedAction(MockInterviewInputSchema, (validated) => mockInterviewFlow(validated))(input, userId);
