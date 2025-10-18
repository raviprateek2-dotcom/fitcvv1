
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-content-suggestions.ts';
import '@/ai/flows/ai-section-writer.ts';
import '@/ai/flows/ai-cover-letter-writer.ts';
import '@/ai/flows/ai-resume-parser.ts';
import '@/ai/flows/ai-keyword-suggester.ts';
import '@/ai/flows/ai-title-suggester.ts';
import '@/ai/flows/ai-resume-analyzer.ts';
import '@/ai/flows/ai-resume-review.ts';
import '@/ai/flows/ai-avatar-generator.ts';
import '@/ai/flows/ai-behavioral-question-analyzer.ts';
import '@/ai/flows/ai-mock-interviewer.ts';
import '@/ai/flows/ai-resume-parser.ts';
import '@/ai/flows/ai-narrator.ts';

