'use server';

/**
 * @fileOverview Provides AI-powered LinkedIn profile optimization.
 *
 * - optimizeLinkedInProfile - A function that generates a headline and about section for LinkedIn.
 * - OptimizeLinkedInInput - The input type for the optimizeLinkedInProfile function.
 * - OptimizeLinkedInOutput - The return type for the optimizeLinkedInProfile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OptimizeLinkedInInputSchema = z.object({
  resumeContent: z.string().describe("The user's full resume content in JSON format."),
  targetRole: z.string().optional().describe("Optional: The specific role the user is targeting."),
});
export type OptimizeLinkedInInput = z.infer<typeof OptimizeLinkedInInputSchema>;

const OptimizeLinkedInOutputSchema = z.object({
  headline: z.string().describe("An attention-grabbing, keyword-rich LinkedIn headline."),
  about: z.string().describe("A compelling 'About' section written in the first person, highlighting achievements and personality."),
  topSkills: z.array(z.string()).describe("A list of 5-10 top skills to feature on the profile."),
});
export type OptimizeLinkedInOutput = z.infer<typeof OptimizeLinkedInOutputSchema>;

export async function optimizeLinkedInProfile(input: OptimizeLinkedInInput): Promise<OptimizeLinkedInOutput> {
  return optimizeLinkedInFlow(input);
}

const prompt = ai.definePrompt({
  name: 'linkedinOptimizerPrompt',
  input: { schema: OptimizeLinkedInInputSchema },
  output: { schema: OptimizeLinkedInOutputSchema },
  prompt: `You are an expert personal branding coach specializing in LinkedIn profile optimization.

  Your task is to take the provided resume data and create a high-impact LinkedIn Headline and 'About' section.

  **Guidelines:**
  1.  **Headline:** Should be more than just a job title. Include 2-3 key technical skills or a unique value proposition. (Max 220 characters).
  2.  **About Section:** Write in the first person (I/me). Start with a 'hook' that summarizes their professional identity. Focus on quantifiable achievements from the resume. End with a call to action or a list of specialties. Keep the tone professional yet approachable.
  3.  **Target Role:** If provided, ensure the keywords are optimized for this specific role: {{targetRole}}.

  Resume Data:
  ---
  {{{resumeContent}}}
  ---
  `,
});

const optimizeLinkedInFlow = ai.defineFlow(
  {
    name: 'optimizeLinkedInFlow',
    inputSchema: OptimizeLinkedInInputSchema,
    outputSchema: OptimizeLinkedInOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error('AI failed to generate LinkedIn suggestions.');
    }
    return output;
  }
);
