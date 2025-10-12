'use server';

/**
 * @fileOverview Provides AI-powered content suggestions for resume improvements.
 *
 * - suggestResumeImprovements - A function that suggests content improvements for a given resume section.
 * - SuggestResumeImprovementsInput - The input type for the suggestResumeImprovements function.
 * - SuggestResumeImprovementsOutput - The return type for the suggestResumeImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResumeImprovementsInputSchema = z.object({
  resumeSection: z.string().describe('The content of the resume section to be improved.'),
  jobDescription: z.string().optional().describe('Optional: The job description for which the resume is being tailored.'),
});
export type SuggestResumeImprovementsInput = z.infer<typeof SuggestResumeImprovementsInputSchema>;

const SuggestResumeImprovementsOutputSchema = z.object({
  improvedContent: z.string().describe('The AI-suggested improvements to the resume section content.'),
  reasoning: z.string().describe('Explanation of why the AI made these suggestions.'),
});
export type SuggestResumeImprovementsOutput = z.infer<typeof SuggestResumeImprovementsOutputSchema>;

export async function suggestResumeImprovements(input: SuggestResumeImprovementsInput): Promise<SuggestResumeImprovementsOutput> {
  return suggestResumeImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeImprovementsPrompt',
  input: {schema: SuggestResumeImprovementsInputSchema},
  output: {schema: SuggestResumeImprovementsOutputSchema},
  prompt: `You are an AI resume expert, skilled at improving resume content to be more effective.

  You will be provided with a section of a resume and, optionally, a job description.

  Your task is to suggest improvements to the resume section content, tailoring it to the job description if provided.

  Provide both the improved content and a clear explanation of why you made the suggested changes.

  Resume Section:
  {{resumeSection}}

  Job Description (if available):
  {{#if jobDescription}}
  {{jobDescription}}
  {{else}}
  Not provided.
  {{/if}}
  `,
});

const suggestResumeImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestResumeImprovementsFlow',
    inputSchema: SuggestResumeImprovementsInputSchema,
    outputSchema: SuggestResumeImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
