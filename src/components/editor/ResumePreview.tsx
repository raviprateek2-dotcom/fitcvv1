
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { ResumeData, CoverLetterPreviewProps } from './types';

export type { ResumeData, CoverLetterPreviewProps };

export interface ResumePreviewProps {
  resumeData: ResumeData;
}

import { templateRegistry } from './templates/template-registry';

const TemplateLoader = () => (
  <div className="w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden p-8">
    <Skeleton className="w-full h-full" />
  </div>
);

const DefaultCoverLetter = dynamic(() => import('./templates/DefaultCoverLetter').then(mod => mod.DefaultCoverLetter), { loading: () => <TemplateLoader /> });


export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const templateId = resumeData.templateId || 'modern';
  const TemplateComponent = templateRegistry[templateId] || templateRegistry['modern'];
  return <TemplateComponent resumeData={resumeData} />;
}

export function CoverLetterPreview({ resumeData }: CoverLetterPreviewProps) {
  // All cover letter templates are now handled by DefaultCoverLetter
  return <DefaultCoverLetter resumeData={resumeData} />;
}
