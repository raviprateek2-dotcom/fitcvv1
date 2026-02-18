
'use server';

/**
 * @fileOverview Provides AI-powered company research for job applications.
 *
 * - researchCompany - A function that returns a strategic summary of a company.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompanyResearchInputSchema = z.object({
  companyName: z.string().describe('The name of the company to research.'),
});
export type CompanyResearchInput = z.infer<typeof CompanyResearchInputSchema>;

const CompanyResearchOutputSchema = z.object({
  summary: z.string().describe('A 2-3 sentence summary of what the company does.'),
  industry: z.string().describe('The primary industry the company operates in.'),
  cultureInsights: z.string().describe('Potential insights into the company culture based on public perception.'),
  likelyInterviewFocus: z.string().describe('What this company likely values most in candidates (e.g., technical excellence, innovation, customer-centricity).'),
});
export type CompanyResearchOutput = z.infer<typeof CompanyResearchOutputSchema>;

export async function researchCompany(input: CompanyResearchInput): Promise<CompanyResearchOutput> {
  return researchCompanyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'companyResearcherPrompt',
  input: { schema: CompanyResearchInputSchema },
  output: { schema: CompanyResearchOutputSchema },
  prompt: `You are an expert corporate strategist and recruiter at FitCV.

  Research the following company: "{{companyName}}"

  Provide high-stakes, strategic insights that would help a job applicant prepare for an interview. 
  
  Focus on:
  1. **Core Business**: What is their primary product or service?
  2. **Culture**: What is the vibe? (e.g., "fast-paced startup," "established enterprise," "design-led")
  3. **Interview Edge**: What should the candidate emphasize to stand out at this specific company?

  Be professional, concise, and insightful.
  `,
});

const researchCompanyFlow = ai.defineFlow(
  {
    name: 'researchCompanyFlow',
    inputSchema: CompanyResearchInputSchema,
    outputSchema: CompanyResearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to research company.');
    return output;
  }
);
