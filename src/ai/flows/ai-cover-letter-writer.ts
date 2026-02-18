
'use server';

/**
 * @fileOverview Provides AI-powered cover letter generation with tone control.
 *
 * - writeCoverLetter - A function that generates a cover letter.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WriteCoverLetterInputSchema = z.object({
  jobTitle: z.string().describe('The job title the user is applying for.'),
  companyName: z.string().describe('The name of the company the user is applying to.'),
  resumeContent: z.string().describe("The user's full resume content."),
  tone: z.enum(['professional', 'bold', 'friendly']).default('professional').describe('The desired tone of the letter.'),
});
export type WriteCoverLetterInput = z.infer<typeof WriteCoverLetterInputSchema>;

const WriteCoverLetterOutputSchema = z.object({
  coverLetterText: z.string().describe('The AI-generated cover letter text.'),
});
export type WriteCoverLetterOutput = z.infer<typeof WriteCoverLetterOutputSchema>;

export async function writeCoverLetter(input: WriteCoverLetterInput): Promise<WriteCoverLetterOutput> {
  return writeCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writeCoverLetterPrompt',
  input: {schema: WriteCoverLetterInputSchema},
  output: {schema: WriteCoverLetterOutputSchema},
  prompt: `You are an expert career coach at FitCV. 
  
  Generate a three-paragraph cover letter for a user applying for "{{jobTitle}}" at "{{companyName}}".
  
  Use a **{{tone}}** tone:
  - **professional**: Standard, polished, and balanced.
  - **bold**: Energetic, confident, and focuses on high-impact achievements.
  - **friendly**: Warm, approachable, and emphasizes culture fit and personality.

  Use the resume context provided:
  ---
  {{resumeContent}}
  ---

  Keep it concise and do not include headers or footers.
  `,
});

const writeCoverLetterFlow = ai.defineFlow(
  {
    name: 'writeCoverLetterFlow',
    inputSchema: WriteCoverLetterInputSchema,
    outputSchema: WriteCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
