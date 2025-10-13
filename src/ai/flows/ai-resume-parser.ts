
'use server';

/**
 * @fileOverview Provides AI-powered parsing of resume PDF content.
 *
 * - parseResumeFromPdf - A function that parses raw text from a resume and structures it.
 * - ParseResumeOutput - The return type for the parseResumeFromPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import pdf from '@/lib/pdf-parse';

// Define types for resume structure
const PersonalInfoSchema = z.object({
  name: z.string().describe("The full name of the person."),
  title: z.string().describe("The professional job title, like 'Software Engineer'."),
  email: z.string().describe("The email address.").optional(),
  phone: z.string().describe("The phone number.").optional(),
  location: z.string().describe("The city and state, like 'San Francisco, CA'.").optional(),
  website: z.string().describe("A personal website or portfolio link.").optional(),
});

const ExperienceSchema = z.object({
  id: z.number(),
  company: z.string().describe("The name of the company."),
  role: z.string().describe("The job title at the company."),
  date: z.string().describe("The employment dates, like 'May 2020 - Present'."),
  description: z.string().describe("Bulleted list of responsibilities and achievements. Each bullet point should be on a new line."),
});

const EducationSchema = z.object({
  id: z.number(),
  institution: z.string().describe("The name of the university or school."),
  degree: z.string().describe("The degree obtained, like 'Bachelor of Science in Computer Science'."),
  date: z.string().describe("The graduation date or dates of attendance."),
});

const SkillSchema = z.object({
  id: z.number(),
  name: z.string().describe("The name of the skill, e.g., 'JavaScript'."),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).describe("The proficiency level of the skill."),
});

const ProjectSchema = z.object({
    id: z.number(),
    name: z.string().describe("The name of the project."),
    description: z.string().describe("A brief description of the project."),
    link: z.string().describe("A URL link to the project.").optional(),
});


const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().describe("A 2-4 sentence professional summary."),
  experience: z.array(ExperienceSchema).describe("A list of work experiences."),
  education: z.array(EducationSchema).describe("A list of educational qualifications."),
  skills: z.array(SkillSchema).describe("A list of skills."),
  projects: z.array(ProjectSchema).describe("A list of personal or professional projects."),
});

const ParseResumeOutputSchema = z.object({
  resumeData: ResumeDataSchema
});

export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResumeFromPdf(fileBuffer: Buffer): Promise<ParseResumeOutput> {
  return parseResumeFlow(fileBuffer);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: { schema: z.string() },
  output: { schema: ParseResumeOutputSchema },
  prompt: `You are an expert resume parser. Your task is to analyze the raw text content from a resume and structure it into a JSON format.

  Pay close attention to section headings like "Experience", "Education", "Skills", and "Projects" to correctly categorize the information.
  
  - For 'experience', capture the company, role, dates, and a description with bullet points.
  - For 'skills', identify each skill and assign a reasonable proficiency level ('Beginner', 'Intermediate', 'Advanced', 'Expert') based on context. Default to 'Advanced' if unsure.
  - Generate a unique numeric 'id' for each item in the arrays (experience, education, skills, projects) starting from Date.now() and incrementing.
  - Make sure the output strictly adheres to the provided JSON schema.

  Resume Text to Parse:
  ---
  {{{input}}}
  ---
  `,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: z.any(),
    outputSchema: ParseResumeOutputSchema,
  },
  async (fileBuffer: Buffer) => {
    // 1. Parse PDF to get raw text
    const data = await pdf(fileBuffer);
    const rawText = data.text;
    
    // 2. Use AI to structure the text
    const { output } = await prompt(rawText);
    
    if (!output) {
      throw new Error('AI failed to parse the resume structure.');
    }
    
    // 3. Add unique IDs to array items
    const now = Date.now();
    output.resumeData.experience.forEach((item, index) => item.id = now + index);
    output.resumeData.education.forEach((item, index) => item.id = now + 100 + index);
    output.resumeData.skills.forEach((item, index) => item.id = now + 200 + index);
    output.resumeData.projects.forEach((item, index) => item.id = now + 300 + index);

    return output;
  }
);
