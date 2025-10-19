
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { CoverLetterPreviewProps } from '../ResumePreview';

const templates: Record<string, { header: string }> = {
    modern: {
        header: 'text-center mb-6',
    },
    classic: {
        header: 'mb-6 border-b-2 pb-4',
    },
    creative: {
        header: 'text-center mb-8 p-6 rounded-lg text-white',
    },
    minimalist: {
        header: 'text-left mb-8',
    },
    professional: {
        header: 'text-center mb-8'
    },
    executive: {
        header: 'text-left mb-8'
    }
};

export function DefaultCoverLetter({ resumeData }: CoverLetterPreviewProps) {
  const { personalInfo, coverLetter, companyInfo, templateId = 'modern', styling } = resumeData;
  const templateStyles = templates[templateId] || templates.modern;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
  const fontClass = styling?.fontFamily ? `font-${styling.fontFamily.split('-')[1]}` : 'font-body';

  const dynamicStyles = {
    '--title-font-size': `${styling?.titleFontSize || 36}px`,
    '--heading-font-size': `${styling?.headingFontSize || 18}px`,
    '--body-font-size': `${styling?.bodyFontSize || 14}px`,
    '--accent-color': accentColor,
    '--primary-color': 'hsl(var(--primary))'
  } as React.CSSProperties;

  if (templateId === 'executive') {
    return (
        <div style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex text-[var(--body-font-size)]", fontClass)}>
            <aside className="w-1/3 text-primary-foreground p-8 bg-primary">
                {/* Sidebar can be decorative or hold contact details */}
            </aside>
            <main className="w-2/3 p-10 leading-relaxed space-y-4 whitespace-pre-wrap">
                <header className="text-left mb-8">
                    <h1 style={{ fontSize: 'var(--title-font-size)'}} className="font-bold text-gray-900 font-headline leading-tight">{personalInfo.name}</h1>
                    <h2 style={{ fontSize: 'var(--heading-font-size)', color: 'var(--accent-color)'}} className="font-semibold">{personalInfo.title}</h2>
                </header>
                <p className="text-sm text-gray-600">{date}</p>
                {companyInfo?.name && (
                    <div>
                        <p className="font-semibold">Hiring Manager</p>
                        <p>{companyInfo.name}</p>
                    </div>
                )}
                <br/>
                <p>Dear Hiring Manager,</p>
                <div className="space-y-4 text-gray-700">
                    {coverLetter?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
                <br/>
                <p>Sincerely,</p>
                <p className="font-semibold">{personalInfo.name}</p>
            </main>
        </div>
    );
  }
  
  if (templateId === 'professional') {
    return (
        <div style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex flex-col p-10 text-[var(--body-font-size)]", fontClass)}>
            <header className="text-center mb-8">
                <h1 style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-color)'}} className="font-bold font-headline leading-tight">{personalInfo.name}</h1>
                <h2 style={{ fontSize: 'var(--heading-font-size)'}} className="font-semibold text-gray-600">{personalInfo.title}</h2>
                 <div className="flex justify-center items-center gap-4 text-sm mt-2 text-gray-500">
                    <div className="flex items-center gap-1.5"><AtSign size={14} />{personalInfo.email}</div>
                    <div className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</div>
                 </div>
            </header>
            <main className="leading-relaxed space-y-4 whitespace-pre-wrap flex-grow">
            <p className="text-sm text-gray-600">{date}</p>
            {companyInfo?.name && (
              <div>
                  <p className="font-semibold">Hiring Manager</p>
                  <p>{companyInfo.name}</p>
              </div>
            )}
            <br/>
            <p>Dear Hiring Manager,</p>
            <div className="space-y-4 text-gray-700">
              {coverLetter?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
              ))}
            </div>
            <br/>
            <p>Sincerely,</p>
            <p className="font-semibold">{personalInfo.name}</p>
            </main>
        </div>
    );
  }

  return (
     <div style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full text-[var(--body-font-size)]", fontClass)}>
      <header className={templateStyles.header} style={templateId === 'creative' ? { backgroundColor: accentColor } : {}}>
        <h1 style={{ fontSize: 'var(--title-font-size)'}} className={cn("font-bold font-headline leading-tight", templateId === 'creative' ? 'text-white' : 'text-gray-900')}>{personalInfo.name}</h1>
        <h2 style={{ fontSize: 'var(--heading-font-size)'}} className={cn("font-semibold font-headline", templateId === 'creative' ? 'text-white/90' : 'text-[var(--accent-color)]')}>{personalInfo.title}</h2>
        <div className={cn("flex justify-center items-center gap-4 text-sm mt-2 flex-wrap", templateId === 'creative' ? 'text-white/80' : 'text-gray-600')}>
          <div className="flex items-center gap-1.5"><AtSign size={14} />{personalInfo.email}</div>
          <div className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</div>
          <div className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</div>
          {personalInfo.website && <div className="flex items-center gap-1.5"><Globe size={14} />{personalInfo.website}</div>}
        </div>
      </header>
      <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />
      <main className="leading-relaxed space-y-4 whitespace-pre-wrap">
          <p>{date}</p>
          {companyInfo?.name && (
            <p>
              Hiring Manager
              <br/>
              {companyInfo.name}
            </p>
          )}
          <br/>
          <p>Dear Hiring Manager,</p>
          <div className="space-y-4">
            {coverLetter?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </div>
          <br/>
          <p>Sincerely,</p>
          <p>{personalInfo.name}</p>
        </main>
    </div>
  )
}
