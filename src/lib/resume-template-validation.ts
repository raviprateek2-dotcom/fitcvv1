import type { MasterResumeSchema } from '@/lib/resume-master-schema';
import { validateBullets } from '@/lib/resume-bullet-engine';
import {
  ATS_CLASSIC_TEMPLATE,
  FRESHER_STUDENT_TEMPLATE,
  PROFESSIONAL_TEMPLATE,
  type ResumeTemplateVariantConfig,
  type ResumeTemplateVariantId,
} from '@/lib/resume-template-variants';

export type ResumeValidationSeverity = 'error' | 'warning';
export type ResumeValidationCategory = 'missing_section' | 'empty_field' | 'weak_bullet' | 'formatting';

export interface ResumeValidationWarning {
  severity: ResumeValidationSeverity;
  category: ResumeValidationCategory;
  code: string;
  message: string;
  field?: string;
}

export interface ResumeValidationResult {
  canDownload: boolean;
  errors: ResumeValidationWarning[];
  warnings: ResumeValidationWarning[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    weakBullets: number;
    missingSections: number;
    emptyFields: number;
    formattingIssues: number;
  };
}

const TEMPLATE_LOOKUP: Record<ResumeTemplateVariantId, ResumeTemplateVariantConfig> = {
  'ats-classic': ATS_CLASSIC_TEMPLATE,
  'fresher-student': FRESHER_STUDENT_TEMPLATE,
  'professional-2-5-years': PROFESSIONAL_TEMPLATE,
};

function isBlank(value?: string): boolean {
  return !value || value.trim().length === 0;
}

function pushWarning(
  bucket: ResumeValidationWarning[],
  warning: Omit<ResumeValidationWarning, 'severity'>,
  severity: ResumeValidationSeverity
): void {
  bucket.push({ severity, ...warning });
}

export function validateResumeTemplateBeforeDownload(
  resume: MasterResumeSchema,
  variantId: ResumeTemplateVariantId
): ResumeValidationResult {
  const variant = TEMPLATE_LOOKUP[variantId];
  const warnings: ResumeValidationWarning[] = [];
  const errors: ResumeValidationWarning[] = [];

  // Required personal information
  if (isBlank(resume.personalInfo.name)) {
    pushWarning(errors, { category: 'empty_field', code: 'name_missing', message: 'Name is required.', field: 'personalInfo.name' }, 'error');
  }
  if (isBlank(resume.personalInfo.contact.phone)) {
    pushWarning(errors, { category: 'empty_field', code: 'phone_missing', message: 'Phone number is required.', field: 'personalInfo.contact.phone' }, 'error');
  }
  if (isBlank(resume.personalInfo.contact.email)) {
    pushWarning(errors, { category: 'empty_field', code: 'email_missing', message: 'Email is required.', field: 'personalInfo.contact.email' }, 'error');
  }
  if (isBlank(resume.personalInfo.contact.linkedin)) {
    pushWarning(warnings, { category: 'empty_field', code: 'linkedin_missing', message: 'LinkedIn is recommended for recruiter trust.', field: 'personalInfo.contact.linkedin' }, 'warning');
  }

  const internships = resume.experience.filter((entry) => /(intern|internship|trainee)/i.test(entry.role));
  const experienceOnly = resume.experience.filter((entry) => !/(intern|internship|trainee)/i.test(entry.role));

  // Missing sections by template variant
  for (const section of variant.sectionOrder) {
    if (section === 'summary' || section === 'career_objective') {
      if (isBlank(resume.summary)) {
        pushWarning(errors, {
          category: 'missing_section',
          code: `${section}_missing`,
          message: `Required section missing: ${section === 'summary' ? 'Professional Summary' : 'Career Objective'}.`,
          field: 'summary',
        }, 'error');
      }
    }
    if (section === 'skills' && resume.skills.length === 0) {
      pushWarning(errors, {
        category: 'missing_section',
        code: 'skills_missing',
        message: 'Required section missing: Skills.',
        field: 'skills',
      }, 'error');
    }
    if (section === 'experience' && experienceOnly.length === 0) {
      pushWarning(errors, {
        category: 'missing_section',
        code: 'experience_missing',
        message: 'Required section missing: Experience.',
        field: 'experience',
      }, 'error');
    }
    if (section === 'internships' && internships.length === 0) {
      pushWarning(warnings, {
        category: 'missing_section',
        code: 'internships_missing',
        message: 'No internships detected for fresher template. Consider adding internship experience if available.',
        field: 'experience',
      }, 'warning');
    }
    if (section === 'projects' && resume.projects.length === 0) {
      pushWarning(errors, {
        category: 'missing_section',
        code: 'projects_missing',
        message: 'Required section missing: Projects.',
        field: 'projects',
      }, 'error');
    }
    if (section === 'education' && resume.education.length === 0) {
      pushWarning(errors, {
        category: 'missing_section',
        code: 'education_missing',
        message: 'Required section missing: Education.',
        field: 'education',
      }, 'error');
    }
  }

  // Empty field checks inside arrays
  resume.experience.forEach((exp, idx) => {
    if (isBlank(exp.company) || isBlank(exp.role) || isBlank(exp.startDate) || isBlank(exp.endDate)) {
      pushWarning(errors, {
        category: 'empty_field',
        code: 'experience_item_incomplete',
        message: `Experience #${idx + 1} has missing company, role, or date.`,
        field: `experience[${idx}]`,
      }, 'error');
    }
    if (exp.bullets.length === 0) {
      pushWarning(errors, {
        category: 'empty_field',
        code: 'experience_bullets_missing',
        message: `Experience #${idx + 1} is missing achievement bullets.`,
        field: `experience[${idx}].bullets`,
      }, 'error');
    }
  });

  resume.projects.forEach((project, idx) => {
    if (isBlank(project.title) || isBlank(project.description) || project.techStack.length === 0) {
      pushWarning(errors, {
        category: 'empty_field',
        code: 'project_item_incomplete',
        message: `Project #${idx + 1} is missing title, description, or tech stack.`,
        field: `projects[${idx}]`,
      }, 'error');
    }
  });

  // Bullet strength checks
  const allBullets = resume.experience.flatMap((exp) => exp.bullets);
  const bulletChecks = validateBullets(allBullets);
  bulletChecks.forEach((check, idx) => {
    if (!check.isValid) {
      pushWarning(warnings, {
        category: 'weak_bullet',
        code: 'weak_bullet',
        message: `Bullet #${idx + 1} is weak (${check.issues.join(', ')}).`,
        field: 'experience.bullets',
      }, 'warning');
    }
  });

  // Formatting checks
  if (resume.summary.trim().length > 550) {
    pushWarning(warnings, {
      category: 'formatting',
      code: 'summary_too_long',
      message: 'Summary appears too long for recruiter scan (recommended <= 4 lines).',
      field: 'summary',
    }, 'warning');
  }
  if (resume.skills.some((group) => group.items.length > 12)) {
    pushWarning(warnings, {
      category: 'formatting',
      code: 'skills_group_too_long',
      message: 'One or more skill groups are too long and may reduce readability.',
      field: 'skills',
    }, 'warning');
  }
  if (resume.projects.some((project) => project.description.length > 350)) {
    pushWarning(warnings, {
      category: 'formatting',
      code: 'project_description_too_long',
      message: 'Project description is too long; keep it concise and outcome-focused.',
      field: 'projects',
    }, 'warning');
  }

  const summary = {
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    weakBullets: warnings.filter((w) => w.category === 'weak_bullet').length,
    missingSections: [...errors, ...warnings].filter((w) => w.category === 'missing_section').length,
    emptyFields: errors.filter((w) => w.category === 'empty_field').length,
    formattingIssues: warnings.filter((w) => w.category === 'formatting').length,
  };

  return {
    canDownload: errors.length === 0,
    errors,
    warnings,
    summary,
  };
}

