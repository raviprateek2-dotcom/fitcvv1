'use server';

/**
 * @fileOverview Provides AI-powered analysis of behavioral interview answers.
 *
 * - analyzeBehavioralAnswer - A function that analyzes a user's story for STAR method components.
 */

import { ai } from '@/ai/genkit';
import type { AnalyzeBehavioralAnswerInput, AnalyzeBehavioralAnswerOutput } from '@/app/actions/schemas/ai-behavioral-question-analyzer';
import { AnalyzeBehavioralAnswerInputSchema, AnalyzeBehavioralAnswerOutputSchema } from '@/app/actions/schemas/ai-behavioral-question-analyzer';


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
