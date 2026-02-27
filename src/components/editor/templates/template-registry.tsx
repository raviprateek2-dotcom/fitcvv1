import dynamic from 'next/dynamic';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResumePreviewProps } from '../ResumePreview';

export interface TemplateComponent {
  (props: ResumePreviewProps): React.ReactElement | null;
}

const TemplateLoader = () => (
  <div className="w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden p-8">
    <Skeleton className="w-full h-full" />
  </div>
);

export const templateRegistry: Record<string, React.ComponentType<ResumePreviewProps>> = {
  modern: dynamic(() => import('./ModernTemplate').then(mod => mod.ModernTemplate), { loading: () => <TemplateLoader /> }),
  classic: dynamic(() => import('./ClassicTemplate').then(mod => mod.ClassicTemplate), { loading: () => <TemplateLoader /> }),
  creative: dynamic(() => import('./CreativeTemplate').then(mod => mod.CreativeTemplate), { loading: () => <TemplateLoader /> }),
  minimalist: dynamic(() => import('./MinimalistTemplate').then(mod => mod.MinimalistTemplate), { loading: () => <TemplateLoader /> }),
  professional: dynamic(() => import('./ProfessionalTemplate').then(mod => mod.ProfessionalTemplate), { loading: () => <TemplateLoader /> }),
  executive: dynamic(() => import('./ExecutiveTemplate').then(mod => mod.ExecutiveTemplate), { loading: () => <TemplateLoader /> }),
  elegant: dynamic(() => import('./ElegantTemplate').then(mod => mod.ElegantTemplate), { loading: () => <TemplateLoader /> }),
  technical: dynamic(() => import('./TechnicalTemplate').then(mod => mod.TechnicalTemplate), { loading: () => <TemplateLoader /> }),
};
