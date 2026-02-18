
'use server';

/**
 * @fileOverview Predicts likely interview questions based on a job description.
 *
 * - predictInterviewQuestions - A function that returns predicted questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictQuestionsInputSchema = z.object({
  jobDescription: z.string().describe('The full job description to analyze.'),
});
export type PredictQuestionsInput = z.infer<typeof PredictQuestionsInputSchema>;

const PredictedQuestionSchema = z.object({
  question: z.string().describe('The predicted interview question.'),
  type: z.enum(['behavioral', 'technical', 'situational']).describe('The category of the question.'),
  reasoning: z.string().describe('Short explanation of why this is a high-priority question for this role.'),
});

const PredictQuestionsOutputSchema = z.object({
  questions: z.array(PredictedQuestionSchema).describe('A list of 3-5 highly relevant interview questions.'),
});
export type PredictQuestionsOutput = z.infer<typeof PredictQuestionsOutputSchema>;

export async function predictInterviewQuestions(input: PredictQuestionsInput): Promise<PredictQuestionsOutput> {
  return predictInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictInterviewQuestionsPrompt',
  input: { schema: PredictQuestionsInputSchema },
  output: { schema: PredictQuestionsOutputSchema },
  prompt: `You are an elite executive recruiter and interview coach at FitCV.

  Analyze the following job description and predict 3-5 specific interview questions that this candidate is likely to encounter. 
  
  Focus on:
  1.  **Behavioral**: Questions about past experiences related to key requirements.
  2.  **Technical/Situational**: Questions about specific skills or "what would you do if..." scenarios.

  For each question, provide a strategic "reasoning" that explains why it is likely to be asked based on the job's priorities.

  Job Description:
  ---
  {{{jobDescription}}}
  ---
  `,
});

const predictInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'predictInterviewQuestionsFlow',
    inputSchema: PredictQuestionsInputSchema,
    outputSchema: PredictQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to predict questions.');
    return output;
  }
);
