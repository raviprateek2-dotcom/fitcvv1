'use server';

/**
 * @fileOverview Provides AI-powered mock interview feedback.
 * 
 * - mockInterview - A function that provides feedback on a user's interview answer.
 */

import { ai } from '@/ai/genkit';
import { MockInterviewInputSchema, MockInterviewOutputSchema, type MockInterviewInput, type MockInterviewOutput } from '@/app/actions/schemas/ai-mock-interviewer';

export async function mockInterview(input: MockInterviewInput): Promise<MockInterviewOutput> {
    return mockInterviewFlow(input);
}

const prompt = ai.definePrompt({
    name: 'mockInterviewPrompt',
    input: { schema: MockInterviewInputSchema },
    output: { schema: MockInterviewOutputSchema },
    prompt: `You are an expert interview coach for a company called ResumeAI.

    Your task is to provide feedback on a user's answer to a common interview question.
    
    1.  **Analyze the Answer**: Evaluate the user's answer for clarity, confidence, and relevance to the question.
    2.  **Provide Constructive Feedback**: Give concise, actionable feedback. Focus on what they did well and one key area for improvement.
    3.  **Suggest an Improvement**: Provide a specific, rephrased example of how they could have made one part of their answer more impactful. Keep it brief.
    
    Interview Question:
    ---
    {{question}}
    ---
    
    User's Answer:
    ---
    {{userAnswer}}
    ---
    `,
});

const mockInterviewFlow = ai.defineFlow(
    {
        name: 'mockInterviewFlow',
        inputSchema: MockInterviewInputSchema,
        outputSchema: MockInterviewOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
