'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const professionalTitles = [
  "Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Product Manager", "Project Manager", "UX/UI Designer", "Graphic Designer", "Data Scientist", "Data Analyst",
  "Marketing Manager", "Content Strategist", "Sales Representative", "Business Analyst", "Accountant",
  "Human Resources Manager", "Recruiter", "Customer Service Representative", "Operations Manager"
];

export const getStandardizedJobTitle = ai.defineTool(
  {
    name: 'getStandardizedJobTitle',
    description: 'Provides a list of standardized, professional job titles to normalize an informal one.',
    inputSchema: z.object({
        userTitle: z.string().describe("The user's informal job title, e.g., 'Code Wizard'"),
    }),
    outputSchema: z.string().describe('The most appropriate standardized job title from the provided list.'),
  },
  async ({ userTitle }) => {
    // In a real scenario, this could involve a more complex search or fuzzy matching.
    // For this example, we'll ask the LLM to pick the best fit from a predefined list.
    const { text } = await ai.generate({
      prompt: `From the following list of professional titles, which one is the best fit for the title "${userTitle}"?

      Available Titles: ${professionalTitles.join(', ')}
      
      Return only the single best-matching title and nothing else.`,
    });
    return text;
  }
);
