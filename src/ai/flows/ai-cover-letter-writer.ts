'use server';

/**
 * @fileOverview Provides AI-powered cover letter generation.
 *
 * - writeCoverLetter - A function that generates a cover letter based on resume content and a job description.
 * - WriteCoverLetterInput - The input type for the writeCoverLetter function.
 * - WriteCoverLetterOutput - The return type for the writeCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WriteCoverLetterInputSchema = z.object({
  jobTitle: z.string().describe('The job title the user is applying for.'),
  companyName: z.string().describe('The name of the company the user is applying to.'),
  resumeContent: z.string().describe("The user's full resume content, which will be used to tailor the cover letter."),
});
export type WriteCoverLetterInput = z.infer<typeof WriteCoverLetterInputSchema>;

const WriteCoverLetterOutputSchema = z.object({
  coverLetterText: z.string().describe('The AI-generated cover letter, formatted as three concise paragraphs.'),
});
export type WriteCoverLetterOutput = z.infer<typeof WriteCoverLetterOutputSchema>;

export async function writeCoverLetter(input: WriteCoverLetterInput): Promise<WriteCoverLetterOutput> {
  return writeCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writeCoverLetterPrompt',
  input: {schema: WriteCoverLetterInputSchema},
  output: {schema: WriteCoverLetterOutputSchema},
  prompt: `You are an expert career coach and professional writer, skilled at crafting compelling cover letters.

  Your task is to generate a concise, professional, and impactful three-paragraph cover letter.

  The user is applying for the role of "{{jobTitle}}" at "{{companyName}}".

  Use the provided resume content to highlight the most relevant skills and experiences for this specific role.

  - The first paragraph must be a highly specific and strong opening that immediately grabs the reader's attention. It should introduce the user and express genuine, specific enthusiasm for the role and the company.
  - The second paragraph should connect the user's key experiences and achievements from their resume directly to the requirements of the job.
  - The third paragraph must be a confident closing that reiterates interest and includes a clear, customized call to action (e.g., "I am eager to discuss how my background in... can bring value to your team.").

  Do not include contact information, dates, or salutations like "Dear Hiring Manager," or "Sincerely,". Only generate the three body paragraphs of the letter.

  Resume Content for Context:
  ---
  {{resumeContent}}
  ---
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
