export type ResumeSkillCategory = 'Technical' | 'Tools' | 'Soft Skills' | 'Domain' | 'Languages' | 'Other';

export interface ResumeContactInfo {
  phone: string;
  email: string;
  linkedin: string;
  portfolio?: string;
  location?: string;
}

export interface ResumePersonalInfo {
  name: string;
  contact: ResumeContactInfo;
}

export interface ResumeSkillGroup {
  category: ResumeSkillCategory | string;
  items: string[];
}

export interface ResumeExperienceItem {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ResumeEducationItem {
  degree: string;
  institution: string;
  year: string;
  score?: string;
}

export interface ResumeProjectItem {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface ResumeCertificationItem {
  name: string;
  issuer?: string;
  year?: string;
}

/**
 * Universal ATS-safe resume schema.
 * This schema is intentionally semantic and layout-agnostic.
 */
export interface MasterResumeSchema {
  personalInfo: ResumePersonalInfo;
  summary: string;
  skills: ResumeSkillGroup[];
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  projects: ResumeProjectItem[];
  certifications?: ResumeCertificationItem[];
}

