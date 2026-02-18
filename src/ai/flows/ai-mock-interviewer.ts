
'use server';

/**
 * @fileOverview Provides AI-powered mock interview feedback with persona support.
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
    prompt: `You are an expert interview coach at FitCV, acting as a {{persona}} interviewer.

    Your task is to provide feedback on a user's answer to an interview question. 
    
    Adopt the following persona for your feedback style:
    - **friendly**: Encouraging, supportive, and focuses on building confidence.
    - **strict**: Direct, no-nonsense, and focuses on high standards and precision.
    - **technical**: Analytical, focuses on depth of knowledge, evidence of skill, and logical structure.

    1. **Analyze the Answer**: Evaluate clarity, confidence, and relevance.
    2. **Provide Constructive Feedback**: Give concise, actionable feedback based on your persona.
    3. **Suggest an Improvement**: Provide a specific, rephrased example of an impactful answer.
    
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
