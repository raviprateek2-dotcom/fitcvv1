'use server';

import { aiNarrate as aiNarrateFlow } from '@/ai/flows/ai-narrator';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

// The narrator flow takes a plain string, not an object
const schema = z.string().min(1).max(5_000, 'Text too long for narration');

export const aiNarrate = async (text: string, userId?: string) =>
  guardedAction(schema, (validated) => aiNarrateFlow(validated))(text, userId);
