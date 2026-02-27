'use server';

import { analyzeResume as analyzeResumeFlow } from '@/ai/flows/ai-resume-analyzer';
import type { AnalyzeResumeInput, AnalyzeResumeOutput } from '@/ai/flows/ai-resume-analyzer';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

export type { AnalyzeResumeOutput };

// Both fields are required in the flow schema
const schema = z.object({
  resumeContent: z.string().min(1, 'Resume content is required').max(50_000, 'Resume content too large'),
  jobDescription: z.string().min(1, 'Job description is required').max(10_000, 'Job description too large'),
});

export const analyzeResume = async (input: AnalyzeResumeInput, userId?: string) =>
  guardedAction(schema, (validated) => analyzeResumeFlow(validated))(input, userId);
