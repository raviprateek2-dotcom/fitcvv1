
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
const ProfessionalTemplate = dynamic(() => import('./templates/ProfessionalTemplate').then(mod => mod.ProfessionalTemplate), { loading: () => <TemplateLoader /> });
const ExecutiveTemplate = dynamic(() => import('./templates/ExecutiveTemplate').then(mod => mod.ExecutiveTemplate), { loading: () => <TemplateLoader /> });
const DefaultCoverLetter = dynamic(() => import('./templates/DefaultCoverLetter').then(mod => mod.DefaultCoverLetter), { loading: () => <TemplateLoader /> });
const ProfessionalCoverLetter = dynamic(() => import('./templates/ProfessionalCoverLetter').then(mod => mod.ProfessionalCoverLetter), { loading: () => <TemplateLoader /> });
const ExecutiveCoverLetter = dynamic(() => import('./templates/ExecutiveCoverLetter').then(mod => mod.ExecutiveCoverLetter), { loading: () => <TemplateLoader /> });


export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { templateId = 'modern' } = resumeData;

  switch (templateId) {
    case 'professional':
      return <ProfessionalTemplate resumeData={resumeData} />;
    case 'executive':
      return <ExecutiveTemplate resumeData={resumeData} />;
    default:
      return <DefaultTemplate resumeData={resumeData} />;
  }
}

export function CoverLetterPreview({ resumeData }: CoverLetterPreviewProps) {
  const { templateId = 'modern' } = resumeData;
  
  switch (templateId) {
    case 'professional':
        return <ProfessionalCoverLetter resumeData={resumeData} />;
    case 'executive':
        return <ExecutiveCoverLetter resumeData={resumeData} />;
    default:
      return <DefaultCoverLetter resumeData={resumeData} />;
  }
}
