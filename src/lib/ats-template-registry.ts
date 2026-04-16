import {
  ATS_CLASSIC_TEMPLATE,
  FRESHER_STUDENT_TEMPLATE,
  PROFESSIONAL_TEMPLATE,
  type ResumeTemplateVariantConfig,
  type ResumeTemplateVariantId,
} from '@/lib/resume-template-variants';

export interface AtsTemplateDefinition {
  id: ResumeTemplateVariantId;
  label: string;
  config: ResumeTemplateVariantConfig;
  summaryTitle: 'Professional Summary' | 'Career Objective';
}

export const ATS_TEMPLATE_REGISTRY: Record<ResumeTemplateVariantId, AtsTemplateDefinition> = {
  'ats-classic': {
    id: 'ats-classic',
    label: 'ATS Classic',
    config: ATS_CLASSIC_TEMPLATE,
    summaryTitle: 'Professional Summary',
  },
  'fresher-student': {
    id: 'fresher-student',
    label: 'Fresher / Student',
    config: FRESHER_STUDENT_TEMPLATE,
    summaryTitle: 'Career Objective',
  },
  'professional-2-5-years': {
    id: 'professional-2-5-years',
    label: 'Professional (2–5 Years)',
    config: PROFESSIONAL_TEMPLATE,
    summaryTitle: 'Professional Summary',
  },
};

