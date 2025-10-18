'use server';

import { analyzeBehavioralAnswer as analyzeBehavioralAnswerFlow } from '@/ai/flows/ai-behavioral-question-analyzer';
import { z } from 'zod';


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


export async function analyzeBehavioralAnswer(input: AnalyzeBehavioralAnswerInput) {
  try {
    const result = await analyzeBehaviorhalAnswerFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI behavioral answer analyzer failed:', error);
    return { success: false, error: error.message || 'Failed to analyze your answer. Please try again later.' };
  }
}
