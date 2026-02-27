'use server';

import { suggestResumeImprovements as suggestImprovementsFlow } from '@/ai/flows/ai-content-suggestions';
import type { SuggestResumeImprovementsInput, SuggestResumeImprovementsOutput } from '@/ai/flows/ai-content-suggestions';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

export type { SuggestResumeImprovementsOutput };

// Match the AI flow's field names: resumeSection + optional jobDescription
const schema = z.object({
  resumeSection: z.string().min(1).max(10_000, 'Section content too large'),
  jobDescription: z.string().max(10_000, 'Job description too large').optional(),
});

export const suggestResumeImprovements = async (input: SuggestResumeImprovementsInput, userId?: string) =>
  guardedAction(schema, (validated) => suggestImprovementsFlow(validated))(input, userId);

// Alias used in AISectionWriterDialog — maps to the same flow
export { suggestResumeImprovements as writeResumeSection };
