
'use client';

import React from 'react';
import type { CoverLetterPreviewProps } from '../ResumePreview';

export function ExecutiveCoverLetter({ resumeData }: CoverLetterPreviewProps) {
    const { personalInfo, coverLetter, companyInfo, styling } = resumeData;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
    
    const dynamicStyles = {
        '--title-font-size': `${styling?.titleFontSize || 32}px`,
        '--heading-font-size': `${styling?.headingFontSize || 16}px`,
        '--body-font-size': `${styling?.bodyFontSize || 12}px`,
        '--accent-color': accentColor,
    } as React.CSSProperties;

    return (
     <div style={dynamicStyles} className="bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex text-[var(--body-font-size)]">
        <aside className="w-1/3 text-white p-8" style={{ backgroundColor: accentColor }}>
            {/* The sidebar can contain contact details or be purely decorative for the cover letter */}
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
