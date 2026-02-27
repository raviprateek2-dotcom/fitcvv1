'use server';

import { suggestTitle as suggestTitleFlow } from '@/ai/flows/ai-title-suggester';
import type { SuggestTitleInput, SuggestTitleOutput } from '@/ai/flows/ai-title-suggester';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

export type { SuggestTitleOutput };

// Flow expects: { currentTitle: string }
const schema = z.object({
  currentTitle: z.string().min(1).max(200, 'Title too long'),
});

export const suggestResumeTitle = async (input: SuggestTitleInput, userId?: string) =>
  guardedAction(schema, (validated) => suggestTitleFlow(validated))(input, userId);

// Alias for callers that use suggestTitle directly
export { suggestResumeTitle as suggestTitle };
