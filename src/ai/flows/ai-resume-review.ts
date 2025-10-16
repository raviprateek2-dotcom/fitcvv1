
'use server';

/**
 * @fileOverview Provides a holistic AI-powered review of a resume.
 *
 * - reviewResume - A function that provides overall feedback on a resume.
 * - ReviewResumeInput - The input type for the reviewResume function.
 * - ReviewResumeOutput - The return type for the reviewResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewResumeInputSchema = z.object({
  resumeContent: z.string().describe('The JSON string representation of the user\'s full resume data.'),
});
export type ReviewResumeInput = z.infer<typeof ReviewResumeInputSchema>;

const ReviewResumeOutputSchema = z.object({
  overallFeedback: z.string().describe('A high-level summary of the resume\'s overall quality, tone, and structure.'),
  positivePoints: z.array(z.string()).describe('A list of 2-3 specific things the resume does well in terms of structure, clarity, or impact.'),
  areasForImprovement: z.array(z.string()).describe('A list of 2-3 specific, actionable suggestions to improve the resume\'s general effectiveness.'),
});
export type ReviewResumeOutput = z.infer<typeof ReviewResumeOutputSchema>;

export async function reviewResume(input: ReviewResumeInput): Promise<ReviewResumeOutput> {
  return reviewResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reviewResumePrompt',
  input: {schema: ReviewResumeInputSchema},
  output: {schema: ReviewResumeOutputSchema},
  prompt: `You are an expert career coach and professional resume writer. Your task is to conduct a holistic review of the provided resume content.

  Do NOT focus on tailoring it to a specific job. Instead, evaluate its general quality, clarity, and impact.

  1.  **Provide Overall Feedback:** Give a brief, insightful overview of the resume's general strengths and weaknesses. Comment on its tone, structure, and readability.
  2.  **Identify Positive Points:** List 2-3 specific things that are done well.
  3.  **Suggest Areas for Improvement:** Provide 2-3 concrete, actionable pieces of advice for making the resume stronger and more professional overall.

  Analyze the following resume content:
  ---
  {{resumeContent}}
  ---
  `,
});

const reviewResumeFlow = ai.defineFlow(
  {
    name: 'reviewResumeFlow',
    inputSchema: ReviewResumeInputSchema,
    outputSchema: ReviewResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
