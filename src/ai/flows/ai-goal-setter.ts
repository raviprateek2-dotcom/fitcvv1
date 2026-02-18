
'use server';

/**
 * @fileOverview Provides AI-powered career goal setting.
 *
 * - generateCareerGoals - A function that generates specific job application goals.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCareerGoalsInputSchema = z.object({
  jobTitle: z.string().describe('The job title the user is targeting.'),
  jobDescription: z.string().optional().describe('Optional target job description.'),
});
export type GenerateCareerGoalsInput = z.infer<typeof GenerateCareerGoalsInputSchema>;

const GoalSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum(['networking', 'optimization', 'skill-building', 'other']),
});

const GenerateCareerGoalsOutputSchema = z.object({
  goals: z.array(GoalSchema).describe('A list of 3-5 specific, actionable career goals.'),
});
export type GenerateCareerGoalsOutput = z.infer<typeof GenerateCareerGoalsOutputSchema>;

export async function generateCareerGoals(input: GenerateCareerGoalsInput): Promise<GenerateCareerGoalsOutput> {
  return generateCareerGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerGoalSetterPrompt',
  input: { schema: GenerateCareerGoalsInputSchema },
  output: { schema: GenerateCareerGoalsOutputSchema },
  prompt: `You are an expert career strategist and job search coach at FitCV.

  Your task is to generate 3-5 high-impact, highly specific, and actionable "SMART" goals for a user targeting the role of "{{jobTitle}}".

  If a job description is provided, use it to make the goals even more specific. If not, use industry standards for this role.

  Focus on:
  1.  **Networking**: A goal about connecting with people in this field or company.
  2.  **Resume Optimization**: A specific way to tailor their FitCV resume for this role (e.g., "Add metrics to X", "Use keywords Y and Z").
  3.  **Skill Gap**: A quick skill to learn or a certification to highlight.

  Keep descriptions concise but encouraging.

  Target Job: {{jobTitle}}
  Job Description (if any): {{#if jobDescription}}{{jobDescription}}{{else}}N/A{{/if}}
  `,
});

const generateCareerGoalsFlow = ai.defineFlow(
  {
    name: 'generateCareerGoalsFlow',
    inputSchema: GenerateCareerGoalsInputSchema,
    outputSchema: GenerateCareerGoalsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
