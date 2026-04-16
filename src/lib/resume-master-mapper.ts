import type { ResumeData } from '@/components/editor/types';
import type { MasterResumeSchema } from '@/lib/resume-master-schema';

function parseDateRange(dateValue: string): { startDate: string; endDate: string } {
  const raw = dateValue?.trim() ?? '';
  if (!raw) return { startDate: 'N/A', endDate: 'Present' };
  const parts = raw.split('-').map((item) => item.trim()).filter(Boolean);
  if (parts.length >= 2) return { startDate: parts[0], endDate: parts.slice(1).join(' - ') };
  return { startDate: parts[0], endDate: 'Present' };
}

function splitBullets(description: string): string[] {
  const lines = (description || '')
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
  return lines;
}

export function mapResumeDataToMasterSchema(resumeData: ResumeData): MasterResumeSchema {
  return {
    personalInfo: {
      name: resumeData.personalInfo.name?.trim() || '',
      contact: {
        phone: resumeData.personalInfo.phone?.trim() || '',
        email: resumeData.personalInfo.email?.trim() || '',
        linkedin: resumeData.personalInfo.website?.trim() || '',
        location: resumeData.personalInfo.location?.trim() || '',
      },
    },
    summary: resumeData.summary?.trim() || '',
    skills: [
      {
        category: 'Technical',
        items: (resumeData.skills ?? []).map((item) => item.name).filter(Boolean),
      },
    ].filter((group) => group.items.length > 0),
    experience: (resumeData.experience ?? []).map((item) => {
      const { startDate, endDate } = parseDateRange(item.date);
      return {
        company: item.company?.trim() || '',
        role: item.role?.trim() || '',
        location: resumeData.personalInfo.location?.trim() || '',
        startDate,
        endDate,
        bullets: splitBullets(item.description),
      };
    }),
    education: (resumeData.education ?? []).map((item) => ({
      degree: item.degree?.trim() || '',
      institution: item.institution?.trim() || '',
      year: item.date?.trim() || '',
    })),
    projects: (resumeData.projects ?? []).map((item) => ({
      title: item.name?.trim() || '',
      description: item.description?.trim() || '',
      techStack: [],
      link: item.link?.trim() || undefined,
    })),
    certifications: [],
  };
}

