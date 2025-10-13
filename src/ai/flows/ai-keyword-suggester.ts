'use server';

/**
 * @fileOverview Provides AI-powered keyword suggestions for resume optimization.
 *
 * - suggestKeywords - A function that suggests keywords missing from a resume based on a job description.
 * - SuggestKeywordsInput - The input type for the suggestKeywords function.
 *-  SuggestKeywordsOutput - The return type for the suggestKeywords function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestKeywordsInputSchema = z.object({
  resumeContent: z.string().describe('The entire content of the user\'s resume.'),
  jobDescription: z.string().describe('The job description the user is targeting.'),
});
export type SuggestKeywordsInput = z.infer<typeof SuggestKeywordsInputSchema>;

const SuggestKeywordsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of up to 5 of the most important keywords or skills found in the job description that are missing from the resume.'),
});
export type SuggestKeywordsOutput = z.infer<typeof SuggestKeywordsOutputSchema>;


export async function suggestKeywords(input: SuggestKeywordsInput): Promise<SuggestKeywordsOutput> {
  return suggestKeywordsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'suggestKeywordsPrompt',
  input: { schema: SuggestKeywordsInputSchema },
  output: { schema: SuggestKeywordsOutputSchema },
  prompt: `You are an expert ATS (Applicant Tracking System) analyst. Your task is to compare the provided resume content against the provided job description.

  Identify the most critical skills, technologies, and qualifications mentioned in the job description that are missing from the resume.

  Return a list of up to 5 of the most important missing keywords. These keywords should be concise and directly transferable to a "Skills" section of a resume.

  Job Description:
  ---
  {{jobDescription}}
  ---

  Resume Content:
  ---
  {{resumeContent}}
  ---
  `,
});


const suggestKeywordsFlow = ai.defineFlow(
  {
    name: 'suggestKeywordsFlow',
    inputSchema: SuggestKeywordsInputSchema,
    outputSchema: SuggestKeywordsOutputSchema,
  },
  async (input) => {
    if (!input.jobDescription) {
      throw new Error('A job description is required to suggest keywords.');
    }
    const { output } = await prompt(input);
    return output!;
  }
);
