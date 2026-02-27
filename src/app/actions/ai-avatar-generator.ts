'use server';

import { generateAvatar as generateAvatarFlow } from '@/ai/flows/ai-avatar-generator';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

const schema = z.object({
  prompt: z.string().min(1).max(500, 'Prompt too long'),
});

export const generateAvatar = async (input: z.infer<typeof schema>, userId?: string) =>
  guardedAction(schema, (validated) => generateAvatarFlow(validated))(input, userId);
