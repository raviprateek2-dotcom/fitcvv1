export type ResumeTemplateVariantId = 'ats-classic' | 'fresher-student' | 'professional-2-5-years';

export interface ResumeTemplateVariantConfig {
  id: ResumeTemplateVariantId;
  label: string;
  sectionOrder: Array<
    | 'summary'
    | 'career_objective'
    | 'skills'
    | 'experience'
    | 'internships'
    | 'projects'
    | 'education'
    | 'certifications'
  >;
  maxProjects?: number;
}

export const ATS_CLASSIC_TEMPLATE: ResumeTemplateVariantConfig = {
  id: 'ats-classic',
  label: 'ATS Classic',
  sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
};

export const FRESHER_STUDENT_TEMPLATE: ResumeTemplateVariantConfig = {
  id: 'fresher-student',
  label: 'Fresher / Student',
  sectionOrder: ['career_objective', 'education', 'skills', 'projects', 'internships', 'certifications'],
};

export const PROFESSIONAL_TEMPLATE: ResumeTemplateVariantConfig = {
  id: 'professional-2-5-years',
  label: 'Professional (2–5 Years)',
  sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education'],
  maxProjects: 2,
};

export const RESUME_TEMPLATE_VARIANTS: ResumeTemplateVariantConfig[] = [
  ATS_CLASSIC_TEMPLATE,
  FRESHER_STUDENT_TEMPLATE,
  PROFESSIONAL_TEMPLATE,
];

