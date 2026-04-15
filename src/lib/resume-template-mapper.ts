import type { ResumeData } from '@/components/editor/types';
import { defaultResumeData } from '@/lib/default-resume-data';
import { resumeTemplates, type ResumeTemplate } from '@/data/resumeTemplates';

function mapStyleToTemplateId(style: string): string {
  const normalized = style.toLowerCase();
  if (normalized.includes('modern')) return 'modern';
  if (normalized.includes('classic')) return 'classic';
  if (normalized.includes('creative')) return 'creative';
  if (normalized.includes('minimal')) return 'minimalist';
  if (normalized.includes('executive')) return 'executive';
  if (normalized.includes('elegant')) return 'elegant';
  if (normalized.includes('technical')) return 'technical';
  return 'professional';
}

export function buildResumeFromTemplateId(templateId: string): ResumeData {
  const template = resumeTemplates.find((item) => item.id === templateId);
  if (!template) {
    return {
      ...defaultResumeData,
      templateId: mapStyleToTemplateId('modern'),
    };
  }

  return {
    ...defaultResumeData,
    title: `${template.sampleData.name} - ${template.sampleData.title}`,
    templateId: mapStyleToTemplateId(template.style),
    templateCatalogId: template.id,
    personalInfo: {
      name: template.sampleData.name,
      title: template.sampleData.title,
      email: template.sampleData.email,
      phone: template.sampleData.phone,
      location: template.sampleData.location,
      website: '',
    },
    summary: template.sampleData.summary,
    experience: template.sampleData.experience.map((item, index) => ({
      id: index + 1,
      company: item.company,
      role: item.role,
      date: item.duration,
      description: item.highlights.map((line) => `- ${line}`).join('\n'),
    })),
    education: template.sampleData.education.map((item, index) => ({
      id: index + 1,
      institution: item.institution,
      degree: item.degree,
      date: item.duration,
    })),
    skills: template.sampleData.skills.map((skill, index) => ({
      id: index + 1,
      name: skill,
      level: 'Advanced',
    })),
    projects: [],
    styling: {
      ...defaultResumeData.styling,
      accentColor: template.accentColor,
      fontFamily: 'font-inter',
    },
    jobDescription: '',
    coverLetter: '',
    companyInfo: {
      name: '',
      jobTitle: '',
    },
  };
}

function splitHighlights(input: string): string[] {
  const lines = input
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
  return lines.length ? lines : ['Contributed to strategic goals and measurable outcomes.'];
}

export function buildUnifiedTemplateFromResumeData(resumeData: ResumeData): ResumeTemplate {
  const byCatalogId = resumeData.templateCatalogId
    ? resumeTemplates.find((item) => item.id === resumeData.templateCatalogId)
    : null;
  const byTitle = resumeTemplates.find((item) =>
    item.name.toLowerCase().includes((resumeData.personalInfo.title || '').toLowerCase())
  );
  const base = byCatalogId ?? byTitle ?? resumeTemplates[0];

  return {
    ...base,
    sampleData: {
      name: resumeData.personalInfo.name || base.sampleData.name,
      title: resumeData.personalInfo.title || base.sampleData.title,
      email: resumeData.personalInfo.email || base.sampleData.email,
      phone: resumeData.personalInfo.phone || base.sampleData.phone,
      location: resumeData.personalInfo.location || base.sampleData.location,
      summary: resumeData.summary || base.sampleData.summary,
      experience:
        resumeData.experience?.length
          ? resumeData.experience.map((item) => ({
              role: item.role || 'Professional Role',
              company: item.company || 'Company Name',
              duration: item.date || 'Duration',
              highlights: splitHighlights(item.description || ''),
            }))
          : base.sampleData.experience,
      education:
        resumeData.education?.length
          ? resumeData.education.map((item) => ({
              degree: item.degree || 'Degree',
              institution: item.institution || 'Institution',
              duration: item.date || 'Duration',
            }))
          : base.sampleData.education,
      skills:
        resumeData.skills?.length
          ? resumeData.skills.map((item) => item.name).filter(Boolean)
          : base.sampleData.skills,
      achievements: base.sampleData.achievements,
    },
    accentColor: resumeData.styling?.accentColor || base.accentColor,
  };
}

