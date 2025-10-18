
'use server';

/**
 * @fileOverview Provides AI-powered job title suggestions.
 *
 * - suggestTitle - A function that suggests a professional job title.
 * - SuggestTitleInput - The input type for the suggestTitle function.
 * - SuggestTitleOutput - The return type for the suggestTitle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getStandardizedJobTitle } from '../tools/title-normalizer';

const SuggestTitleInputSchema = z.object({
  currentTitle: z.string().describe('The current, potentially informal, job title.'),
});
export type SuggestTitleInput = z.infer<typeof SuggestTitleInputSchema>;

const SuggestTitleOutputSchema = z.object({
  suggestedTitle: z.string().describe('The AI-suggested professional and standardized job title.'),
});
export type SuggestTitleOutput = z.infer<typeof SuggestTitleOutputSchema>;

export async function suggestTitle(input: SuggestTitleInput): Promise<SuggestTitleOutput> {
  return suggestTitleFlow(input);
}

const suggestTitleFlow = ai.defineFlow(
  {
    name: 'suggestTitleFlow',
    inputSchema: SuggestTitleInputSchema,
    outputSchema: SuggestTitleOutputSchema,
  },
  async (input) => {
    // Directly call the tool to get the standardized title.
    const standardizedTitle = await getStandardizedJobTitle({ userTitle: input.currentTitle });
    return { suggestedTitle: standardizedTitle };
  }
);
