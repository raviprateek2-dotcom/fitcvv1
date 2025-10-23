
'use server';

/**
 * @fileOverview Provides AI-powered parsing of resume PDF content.
 *
 * - parseResumeFromPdf - A function that parses raw text from a resume and structures it.
 * - ParseResumeOutput - The return type for the parseResumeFromPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  skills: z.array(SkillSchema).describe("A list of skills.").optional(),
  projects: z.array(ProjectSchema).describe("A list of personal or professional projects.").optional(),
});

const ParseResumeOutputSchema = z.object({
  resumeData: ResumeDataSchema
});

export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResumeFromPdf(base64String: string): Promise<ParseResumeOutput> {
  return parseResumeFlow(base64String);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: { schema: z.string().describe("A PDF file encoded as a Base64 string, prefixed with a data URI scheme (e.g., 'data:application/pdf;base64,...').") },
  output: { schema: ParseResumeOutputSchema },
  prompt: `You are an expert resume parser. Your task is to analyze the content of the provided PDF file and structure it into a JSON format.

  Pay close attention to section headings like "Experience", "Education", "Skills", and "Projects" to correctly categorize the information.
  
  - For 'experience', capture the company, role, dates, and a description with bullet points.
  - For 'skills', identify each skill and assign a reasonable proficiency level ('Beginner', 'Intermediate', 'Advanced', 'Expert') based on context. Default to 'Advanced' if unsure. If no skills section is found, the 'skills' array can be omitted.
  - For 'projects', extract the project name, a description, and a URL if available. If no projects section is found, the 'projects' array can be omitted.
  - Generate a unique numeric 'id' for each item in the arrays (experience, education, skills, projects). For the ID, just use a placeholder like 0 or 1, as it will be replaced later.
  - Make sure the output strictly adheres to the provided JSON schema.

  Resume PDF to Parse:
  ---
  {{media url=input}}
  ---
  `,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: z.string(),
    outputSchema: ParseResumeOutputSchema,
  },
  async (base64String: string) => {
    // 1. Ensure the base64 string has the data URI prefix
    const dataUri = base64String.startsWith('data:application/pdf;base64,') 
        ? base64String 
        : `data:application/pdf;base64,${base64String}`;

    // 2. Use AI to extract text and structure it
    const { output } = await prompt(dataUri);
    
    if (!output) {
      throw new Error('AI failed to parse the resume structure.');
    }
    
    return output;
  }
);
