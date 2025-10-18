'use server';

/**
 * @fileOverview Provides AI-powered analysis of behavioral interview answers.
 *
 * - analyzeBehavioralAnswer - A function that analyzes a user's story for STAR method components.
 * - AnalyzeBehavioralAnswerInput - The input type for the function.
 * - AnalyzeBehavioralAnswerOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const AnalyzeBehavioralAnswerInputSchema = z.object({
  userAnswer: z.string().describe("The user's story or answer to a behavioral interview question."),
});
export type AnalyzeBehavioralAnswerInput = z.infer<typeof AnalyzeBehavioralAnswerInputSchema>;

export const AnalyzeBehavioralAnswerOutputSchema = z.object({
  isSTAR: z
    .boolean()
    .describe('Whether the answer successfully follows the STAR (Situation, Task, Action, Result) method.'),
  feedback: z
    .string()
    .describe('Overall constructive feedback on the answer, including suggestions for improvement.'),
  situation: z.string().describe("The extracted 'Situation' part of the user's answer."),
  task: z.string().describe("The extracted 'Task' part of the user's answer."),
  action: z.string().describe("The extracted 'Action' part of the user's answer."),
  result: z.string().describe("The extracted 'Result' part of the user's answer. This should highlight a quantifiable outcome."),
});
export type AnalyzeBehavioralAnswerOutput = z.infer<typeof AnalyzeBehavioralAnswerOutputSchema>;


export async function analyzeBehavioralAnswer(input: AnalyzeBehavioralAnswerInput): Promise<AnalyzeBehavioralAnswerOutput> {
    return analyzeBehavioralAnswerFlow(input);
}


const prompt = ai.definePrompt({
    name: 'behavioralAnswerAnalyzerPrompt',
    input: { schema: AnalyzeBehavioralAnswerInputSchema },
    output: { schema: AnalyzeBehavioralAnswerOutputSchema },
    prompt: `You are an expert interview coach, specializing in the STAR method (Situation, Task, Action, Result).

    Your task is to analyze the user's answer to a behavioral question.
    
    1.  **Extract Components**: Identify and extract the four components of the STAR method from the user's answer. If a component is missing, state that it is missing.
    2.  **Evaluate**: Determine if the user successfully structured their answer using the STAR method. The 'Result' must be strong and ideally quantifiable for it to be a success.
    3.  **Provide Feedback**: Give concise, actionable feedback. If the answer is good, explain why. If it's weak or missing a component, explain how to improve it. Focus on making the 'Result' more impactful.
    
    User's Answer:
    ---
    {{userAnswer}}
    ---
    `,
});

const analyzeBehavioralAnswerFlow = ai.defineFlow(
    {
        name: 'analyzeBehavioralAnswerFlow',
        inputSchema: AnalyzeBehavioralAnswerInputSchema,
        outputSchema: AnalyzeBehavioralAnswerOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
