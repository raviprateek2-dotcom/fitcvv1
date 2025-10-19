
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { ResumeData as ResumeDataType, CoverLetterPreviewProps as CoverLetterPreviewPropsType } from './types';


// Reusing types from ResumeEditor.tsx
export type PersonalInfo = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  date: string;
  description: string;
};

export type Education = {
  id: number;
  institution: string;
  degree: string;
  date: string;
};

export type Skill = {
    id: number;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
};

export type Project = {
  id: number;
  name: string;
  description: string;
  link: string;
};

export type Styling = {
  bodyFontSize: number;
  headingFontSize: number;
  titleFontSize: number;
  accentColor: string;
};

export type ResumeData = ResumeDataType;

export interface ResumePreviewProps {
  resumeData: ResumeData;
}

export type CoverLetterPreviewProps = CoverLetterPreviewPropsType;

const TemplateLoader = () => (
    <div className="w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden p-8">
        <Skeleton className="w-full h-full" />
    </div>
);

// Dynamic imports for templates
const DefaultTemplate = dynamic(() => import('./templates/DefaultTemplate').then(mod => mod.DefaultTemplate), { loading: () => <TemplateLoader /> });
const DefaultCoverLetter = dynamic(() => import('./templates/DefaultCoverLetter').then(mod => mod.DefaultCoverLetter), { loading: () => <TemplateLoader /> });


export function ResumePreview({ resumeData }: ResumePreviewProps) {
  // All templates are now handled by DefaultTemplate
  return <DefaultTemplate resumeData={resumeData} />;
}

export function CoverLetterPreview({ resumeData }: CoverLetterPreviewProps) {
  // All cover letter templates are now handled by DefaultCoverLetter
  return <DefaultCoverLetter resumeData={resumeData} />;
}
