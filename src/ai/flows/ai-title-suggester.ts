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
    
    const { output } = await ai.generate({
        prompt: `Based on the user's current job title of "${input.currentTitle}", find the best matching professional title using the available tool.`,
        tools: [getStandardizedJobTitle],
        output: {
            format: 'tool-request',
            schema: z.object({
                toolRequest: z.object({
                    name: z.literal('getStandardizedJobTitle'),
                    input: z.object({ userTitle: z.string() })
                })
            })
        }
    });

    if (!output || !output.toolRequest) {
        // Fallback if the model doesn't request the tool
        return { suggestedTitle: input.currentTitle };
    }
    
    // Call the tool that the LLM requested
    const toolResult = await getStandardizedJobTitle(output.toolRequest.input);

    return { suggestedTitle: toolResult };
  }
);
