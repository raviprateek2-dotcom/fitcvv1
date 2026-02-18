
'use server';

/**
 * @fileOverview Provides deep AI-powered analysis of a resume against a job description, identifying skill gaps and growth paths.
 *
 * - analyzeResume - A function that scores a resume, identifies skill gaps, and suggests a learning path.
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
  skillGaps: z.array(z.string()).describe('Specific skills, technologies, or certifications mentioned in the job description but clearly missing from the resume.'),
  learningPath: z.string().describe('A concise, actionable 3-step learning path or action plan to bridge the identified skill gaps.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an elite AI career strategist and ATS analyst. Your task is to perform a high-stakes analysis of the provided resume against the target job description.

  1.  **Calculate a Match Score:** Based on keyword alignment, experience relevance, and overall fit, provide a score from 0 to 100.
  2.  **Summarize Fit:** Give an insightful overview of the candidate's profile fit.
  3.  **Identify Strengths:** List 2-3 specific reasons why this candidate is a strong contender.
  4.  **Identify Improvements:** Suggest 2-3 ways to improve the *existing* content.
  5.  **Identify Skill Gaps:** List critical skills or technologies from the job description that are COMPLETELY MISSING from the resume. Be precise.
  6.  **Create a Learning Path:** Provide a brief, 3-step action plan (e.g., "Complete certification X", "Build project Y focusing on Z") to bridge those gaps.

  Analyze the following:

  **Job Description:**
  ---
  {{{jobDescription}}}
  ---

  **Resume Content (JSON format):**
  ---
  {{{resumeContent}}}
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
    if (!output) throw new Error('AI failed to analyze the resume.');
    return output;
  }
);
