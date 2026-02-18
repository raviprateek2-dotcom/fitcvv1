
import { z } from 'zod';

export const MockInterviewInputSchema = z.object({
  question: z.string().describe('The interview question being asked.'),
  userAnswer: z.string().describe("The user's verbal answer to the question."),
  persona: z.enum(['friendly', 'strict', 'technical']).default('friendly').describe('The personality of the interviewer.'),
  track: z.enum(['general', 'frontend', 'backend', 'fullstack', 'pm', 'data-science']).default('general').describe('The professional track for the interview.'),
});
export type MockInterviewInput = z.infer<typeof MockInterviewInputSchema>;

export const MockInterviewOutputSchema = z.object({
  feedback: z.string().describe("Overall constructive feedback on the user's answer, focusing on content, clarity, and impact."),
  suggestedImprovement: z.string().describe('A concrete example of how the user could have phrased part of their answer better.'),
});
export type MockInterviewOutput = z.infer<typeof MockInterviewOutputSchema>;
