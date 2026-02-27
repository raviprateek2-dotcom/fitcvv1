'use server';

import { optimizeLinkedInProfile } from '@/ai/flows/ai-linkedin-optimizer';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

const schema = z.object({
  resumeContent: z.string().min(1).max(50_000, 'Resume content too large'),
  currentHeadline: z.string().max(220, 'Headline too long').optional(),
  currentAbout: z.string().max(2_600, 'About section too large').optional(),
});

export const optimizeLinkedIn = async (input: z.infer<typeof schema>, userId?: string) =>
  guardedAction(schema, (validated) => optimizeLinkedInProfile(validated))(input, userId);

// Keep legacy name that callers use
export { optimizeLinkedIn as optimizeLinkedInProfile };
