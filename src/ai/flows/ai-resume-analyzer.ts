'use server';

/**
 * @fileOverview Provides AI-powered analysis of a resume against a job description.
 *
 * - analyzeResume - A function that scores a resume and provides feedback.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeContent: z.string().describe('The JSON string representation of the user\'s resume data.'),
  jobDescription: z.string().describe('The job description the user is targeting.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  matchScore: z.number().min(0).max(100).describe('A score from 0-100 representing how well the resume matches the job description.'),
  summary: z.string().describe('A brief, high-level summary of the resume\'s strengths and weaknesses for this role.'),
  positivePoints: z.array(z.string()).describe('A list of 2-3 specific things the resume does well.'),
  areasForImprovement: z.array(z.string()).describe('A list of 2-3 specific, actionable suggestions for improvement.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert AI resume reviewer and ATS (Applicant Tracking System) analyst. Your task is to analyze the provided resume against the target job description and provide a comprehensive review.

  1.  **Calculate a Match Score:** Based on keyword alignment, experience relevance, and overall fit, provide a score from 0 to 100. A score of 85+ is excellent.
  2.  **Write a Summary:** Give a brief, insightful overview of how well the candidate's profile fits the role.
  3.  **Identify Positive Points:** List 2-3 specific strengths of the resume. What makes this candidate a good fit?
  4.  **Suggest Areas for Improvement:** Provide 2-3 concrete, actionable pieces of advice. How can the user make their resume stronger for *this specific job*?

  Analyze the following:

  **Job Description:**
  ---
  {{jobDescription}}
  ---

  **Resume Content (JSON format):**
  ---
  {{resumeContent}}
  ---
  `,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async (input) => {
    if (!input.jobDescription) {
      throw new Error('A job description is required to analyze the resume.');
    }
    const { output } = await prompt(input);
    return output!;
  }
);
