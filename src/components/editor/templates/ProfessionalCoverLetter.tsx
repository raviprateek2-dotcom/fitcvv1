
'use client';

import React from 'react';
import type { CoverLetterPreviewProps } from '../ResumePreview';

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
        <div style={dynamicStyles} className="bg-slate-800 text-slate-300 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex flex-col p-8 text-[var(--body-font-size)]">
            <header className="text-center mb-8">
                <h1 style={{ fontSize: 'var(--title-font-size)'}} className="font-bold text-white font-headline leading-tight">{personalInfo.name}</h1>
                <h2 style={{ fontSize: 'var(--heading-font-size)', color: 'var(--accent-color)'}} className="font-semibold">{personalInfo.title}</h2>
            </header>
            <main className="leading-relaxed space-y-4 whitespace-pre-wrap">
            <p>{date}</p>
            <p>Hiring Manager<br/>{companyInfo?.name}</p>
            <br/>
            <p>Dear Hiring Manager,</p>
            <p>{coverLetter}</p>
            <br/>
            <p>Sincerely,</p>
            <p>{personalInfo.name}</p>
            </main>
        </div>
    );
}

    