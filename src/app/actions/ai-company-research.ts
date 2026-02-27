'use server';

import { researchCompany } from '@/ai/flows/ai-company-researcher';
import type { CompanyResearchOutput } from '@/ai/flows/ai-company-researcher';
import { z } from 'zod';
import { guardedAction } from '@/lib/action-guard';

export type { CompanyResearchOutput };

const schema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200, 'Company name too long'),
});

export const getCompanyInsights = async (input: z.infer<typeof schema>, userId?: string) =>
  guardedAction(schema, (validated) => researchCompany(validated))(input, userId);
