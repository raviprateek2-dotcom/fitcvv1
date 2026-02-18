
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { CoverLetterPreviewProps } from '../ResumePreview';
import { motion } from 'framer-motion';

// Explicitly define motion components to avoid SWC parser issues with member expressions in JSX
const MotionDiv = motion.div;
const MotionHeader = motion.header;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionP = motion.p;

const templates: Record<string, { header: string }> = {
    modern: {
        header: 'text-center mb-6',
    },
    classic: {
        header: 'mb-6 border-b-2 pb-4',
    },
    creative: {
        header: 'text-center mb-8 p-6 rounded-lg text-white transition-all duration-500',
    },
    minimalist: {
        header: 'text-left mb-8',
    },
    professional: {
        header: 'text-center mb-8'
    },
    executive: {
        header: 'text-left mb-8'
    },
    elegant: {
        header: 'text-center mb-10 pb-6 border-b'
    },
    technical: {
        header: 'mb-6 border-b-2 pb-4 border-slate-900'
    }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function DefaultCoverLetter({ resumeData }: CoverLetterPreviewProps) {
  const { personalInfo, coverLetter, companyInfo, templateId = 'modern', styling } = resumeData;
  const templateStyles = templates[templateId] || templates.modern;
  const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
  const fontClass = styling?.fontFamily ? styling.fontFamily.replace('font-', 'font-') : 'font-body';

  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Handling date formatting client-side to prevent hydration errors
    setFormattedDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const dynamicStyles = {
    '--title-font-size': `${styling?.titleFontSize || 36}px`,
    '--heading-font-size': `${styling?.headingFontSize || 18}px`,
    '--body-font-size': `${styling?.bodyFontSize || 14}px`,
    '--accent-color': accentColor,
    '--primary-color': 'hsl(var(--primary))'
  } as React.CSSProperties;

  const containerProps = {
    initial: "hidden",
    animate: "visible",
    variants: {
      visible: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }
  };

  if (templateId === 'executive') {
    return (
        <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
            <aside className="w-1/3 text-primary-foreground p-8 bg-primary transition-colors duration-500">
                <div className="space-y-4">
                    <p className="font-bold uppercase tracking-widest text-xs opacity-80">Contact</p>
                    <div className="text-sm space-y-2">
                        <p>{personalInfo.email}</p>
                        <p>{personalInfo.phone}</p>
                        <p>{personalInfo.location}</p>
                    </div>
                </div>
            </aside>
            <main className="w-2/3 p-10 leading-relaxed space-y-4 whitespace-pre-wrap">
                <header className="text-left mb-8">
                    <MotionH1 layout style={{ fontSize: 'var(--title-font-size)'}} className="font-bold text-gray-900 font-headline leading-tight">{personalInfo.name}</MotionH1>
                    <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)', color: 'var(--accent-color)'}} className="font-semibold transition-colors duration-500">{personalInfo.title}</MotionH2>
                </header>
                <MotionP variants={sectionVariants} className="text-sm text-gray-600">{formattedDate}</MotionP>
                {companyInfo?.name && (
                    <MotionDiv variants={sectionVariants}>
                        <p className="font-semibold">Hiring Manager</p>
                        <p>{companyInfo.name}</p>
                    </MotionDiv>
                )}
                <br/>
                <MotionP variants={sectionVariants}>Dear Hiring Manager,</MotionP>
                <MotionDiv variants={sectionVariants} className="space-y-4 text-gray-700">
                    {coverLetter?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </MotionDiv>
                <br/>
                <MotionDiv variants={sectionVariants}>
                    <p>Sincerely,</p>
                    <p className="font-semibold">{personalInfo.name}</p>
                </MotionDiv>
            </main>
        </MotionDiv>
    );
  }
  
  if (templateId === 'professional') {
    return (
        <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex flex-col p-10 text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
            <header className="text-center mb-8">
                <MotionH1 layout style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-color)'}} className="font-bold font-headline leading-tight transition-colors duration-500">{personalInfo.name}</MotionH1>
                <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)'}} className="font-semibold text-gray-600">{personalInfo.title}</MotionH2>
                 <MotionDiv variants={sectionVariants} className="flex justify-center items-center gap-4 text-sm mt-2 text-gray-500">
                    <div className="flex items-center gap-1.5"><AtSign size={14} />{personalInfo.email}</div>
                    <div className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</div>
                 </MotionDiv>
            </header>
            <main className="leading-relaxed space-y-4 whitespace-pre-wrap flex-grow">
            <MotionP variants={sectionVariants} className="text-sm text-gray-600">{formattedDate}</MotionP>
            {companyInfo?.name && (
              <MotionDiv variants={sectionVariants}>
                  <p className="font-semibold">Hiring Manager</p>
                  <p>{companyInfo.name}</p>
              </MotionDiv>
            )}
            <br/>
            <MotionP variants={sectionVariants}>Dear Hiring Manager,</MotionP>
            <MotionDiv variants={sectionVariants} className="space-y-4 text-gray-700">
              {coverLetter?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
              ))}
            </MotionDiv>
            <br/>
            <MotionDiv variants={sectionVariants}>
                <p>Sincerely,</p>
                <p className="font-semibold">{personalInfo.name}</p>
            </MotionDiv>
            </main>
        </MotionDiv>
    );
  }

  return (
     <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
      <MotionHeader layout className={cn(templateStyles.header, "transition-all duration-500")} style={templateId === 'creative' ? { backgroundColor: accentColor } : {}}>
        <MotionH1 layout style={{ fontSize: 'var(--title-font-size)'}} className={cn("font-bold font-headline leading-tight transition-colors duration-500", templateId === 'creative' ? 'text-white' : 'text-gray-900')}>{personalInfo.name}</MotionH1>
        <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)'}} className={cn("font-semibold font-headline transition-colors duration-500", templateId === 'creative' ? 'text-white/90' : 'text-[var(--accent-color)]')}>{personalInfo.title}</MotionH2>
        <div className={cn("flex justify-center items-center gap-4 text-sm mt-2 flex-wrap transition-colors duration-500", templateId === 'creative' ? 'text-white/80' : 'text-gray-600')}>
          <div className="flex items-center gap-1.5"><AtSign size={14} />{personalInfo.email}</div>
          <div className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</div>
          <div className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</div>
          {personalInfo.website && <div className="flex items-center gap-1.5"><Globe size={14} />{personalInfo.website}</div>}
        </div>
      </MotionHeader>
      <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />
      <main className="leading-relaxed space-y-4 whitespace-pre-wrap">
          <MotionP variants={sectionVariants}>{formattedDate}</MotionP>
          {companyInfo?.name && (
            <MotionP variants={sectionVariants}>
              Hiring Manager
              <br/>
              {companyInfo.name}
            </MotionP>
          )}
          <br/>
          <MotionP variants={sectionVariants}>Dear Hiring Manager,</MotionP>
          <MotionDiv variants={sectionVariants} className="space-y-4">
            {coverLetter?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </MotionDiv>
          <br/>
          <MotionDiv variants={sectionVariants}>
            <p>Sincerely,</p>
            <p>{personalInfo.name}</p>
          </MotionDiv>
        </main>
    </MotionDiv>
  );
}
