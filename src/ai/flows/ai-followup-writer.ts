
'use server';

/**
 * @fileOverview Provides AI-powered generation of follow-up emails after job interviews.
 *
 * - writeFollowUpEmail - A function that generates a customized follow-up email.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FollowUpInputSchema = z.object({
  jobTitle: z.string().describe('The job title applied for.'),
  companyName: z.string().describe('The company name.'),
  interviewType: z.string().describe('The type of interview (e.g., phone screen, technical, final).'),
  resumeContent: z.string().describe("The user's resume content for context."),
});
export type FollowUpInput = z.infer<typeof FollowUpInputSchema>;

const FollowUpOutputSchema = z.object({
  emailContent: z.string().describe('The generated follow-up email text.'),
});
export type FollowUpOutput = z.infer<typeof FollowUpOutputSchema>;

export async function writeFollowUpEmail(input: FollowUpInput): Promise<FollowUpOutput> {
  return writeFollowUpEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'followUpWriterPrompt',
  input: { schema: FollowUpInputSchema },
  output: { schema: FollowUpOutputSchema },
  prompt: `You are an expert career strategist at FitCV. 
  
  Write a highly professional and concise follow-up/thank-you email for a candidate who just finished a **{{interviewType}}** for the role of **{{jobTitle}}** at **{{companyName}}**.

  **Guidelines:**
  1.  **Gratitude:** Thank them for their time and the opportunity.
  2.  **Reinforce Value:** Briefly mention 1-2 key strengths from their resume that align with the role.
  3.  **Specific Interest:** Mention that the conversation reinforced their interest in the role.
  4.  **Professional Closing:** Keep it polished and ready to send.

  Resume Context:
  ---
  {{{resumeContent}}}
  ---

  Ensure the output is the email body only, no placeholders like [Your Name] unless absolutely necessary.
  `,
});

const writeFollowUpEmailFlow = ai.defineFlow(
  {
    name: 'writeFollowUpEmailFlow',
    inputSchema: FollowUpInputSchema,
    outputSchema: FollowUpOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to generate follow-up email.');
    return output;
  }
);
