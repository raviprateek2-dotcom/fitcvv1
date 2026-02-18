
'use server';

import { researchCompany as researchFlow, type CompanyResearchInput } from '@/ai/flows/ai-company-researcher';

export async function getCompanyInsights(input: CompanyResearchInput) {
  try {
    const result = await researchFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('AI Company Research failed:', error);
    return { success: false, error: error.message || 'Failed to research company.' };
  }
}
