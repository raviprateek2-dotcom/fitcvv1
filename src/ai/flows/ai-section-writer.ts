
'use server';

/**
 * @fileOverview Provides AI-powered resume section generation.
 *
 * - writeResumeSection - A function that generates content for a specific resume section from scratch.
 * - WriteResumeSectionInput - The input type for the writeResumeSection function.
 * - WriteResumeSectionOutput - The return type for the writeResumeSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WriteResumeSectionInputSchema = z.object({
  sectionToGenerate: z.string().describe('The name of the resume section to generate (e.g., "Professional Summary", "Work Experience for a Software Engineer role").'),
  jobDescription: z.string().describe('The full job description for which the resume is being tailored.'),
  existingContent: z.string().optional().describe('Any existing content in the section, which can be used as context.'),
});
export type WriteResumeSectionInput = z.infer<typeof WriteResumeSectionInputSchema>;

const WriteResumeSectionOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content for the specified resume section.'),
});
export type WriteResumeSectionOutput = z.infer<typeof WriteResumeSectionOutputSchema>;

export async function writeResumeSection(input: WriteResumeSectionInput): Promise<WriteResumeSectionOutput> {
  return writeResumeSectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writeResumeSectionPrompt',
  input: {schema: WriteResumeSectionInputSchema},
  output: {schema: WriteResumeSectionOutputSchema},
  prompt: `You are an expert AI resume writer. Your task is to generate compelling content for a specific section of a user's resume.

  You must tailor the content to the provided job description to maximize its impact and relevance.

  If existing content is provided, use it as a starting point or for context, but your primary goal is to produce a high-quality, professional section.

  - Section to Generate: {{sectionToGenerate}}
  - Target Job Description: {{jobDescription}}
  - Existing Content (if any): {{#if existingContent}}{{existingContent}}{{else}}None{{/if}}

  Generate the content for the specified section. For "Work Experience" sections, format the output as a list of bullet points, each starting with a powerful action verb.
  `,
});

const writeResumeSectionFlow = ai.defineFlow(
  {
    name: 'writeResumeSectionFlow',
    inputSchema: WriteResumeSectionInputSchema,
    outputSchema: WriteResumeSectionOutputSchema,
  },
  async input => {
    // Ensure job description is not empty
    if (!input.jobDescription || input.jobDescription.trim() === '') {
        throw new Error('A job description is required to generate tailored content.');
    }
    const {output} = await prompt(input);
    return output!;
  }
);
