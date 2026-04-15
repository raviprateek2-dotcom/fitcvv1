import type { ResumeData } from '@/components/editor/types';
import { defaultResumeData } from '@/lib/default-resume-data';
import { buildResumeFromTemplateId } from '@/lib/resume-template-mapper';

const GUEST_PREFIX = 'guest-';
const KEY_PREFIX = 'fitcv:guest-resume:';

export function createGuestResumeId(): string {
  return `${GUEST_PREFIX}${Math.random().toString(36).slice(2, 10)}`;
}

export function isGuestResumeId(resumeId: string): boolean {
  return resumeId.startsWith(GUEST_PREFIX);
}

function keyFor(resumeId: string): string {
  return `${KEY_PREFIX}${resumeId}`;
}

export function loadGuestResume(resumeId: string): ResumeData | null {
  if (typeof window === 'undefined' || !isGuestResumeId(resumeId)) return null;
  try {
    const raw = window.localStorage.getItem(keyFor(resumeId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeData;
    return parsed;
  } catch {
    return null;
  }
}

export function saveGuestResume(resumeId: string, data: ResumeData): void {
  if (typeof window === 'undefined' || !isGuestResumeId(resumeId)) return;
  try {
    window.localStorage.setItem(keyFor(resumeId), JSON.stringify(data));
  } catch {
    // Ignore quota/storage errors and keep editor usable.
  }
}

export function buildGuestResumeSeed(templateId: string): ResumeData {
  const templateSeed = buildResumeFromTemplateId(templateId);
  return {
    ...defaultResumeData,
    ...templateSeed,
    title: 'Guest Resume',
    coverLetter: '',
    companyInfo: { name: '', jobTitle: '' },
    skills: [],
    projects: [],
    jobDescription: '',
  };
}
