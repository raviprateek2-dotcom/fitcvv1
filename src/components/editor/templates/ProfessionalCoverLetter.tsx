
'use client';

import React from 'react';
import type { CoverLetterPreviewProps } from '../ResumePreview';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';

export function ProfessionalCoverLetter({ resumeData }: CoverLetterPreviewProps) {
    const { personalInfo, coverLetter, companyInfo, styling } = resumeData;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
    
    const dynamicStyles = {
        '--title-font-size': `${styling?.titleFontSize || 36}px`,
        '--heading-font-size': `${styling?.headingFontSize || 18}px`,
        '--body-font-size': `${styling?.bodyFontSize || 14}px`,
        '--accent-color': accentColor,
    } as React.CSSProperties;

    return (
        <div style={dynamicStyles} className="bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex flex-col p-10 text-[var(--body-font-size)]">
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
