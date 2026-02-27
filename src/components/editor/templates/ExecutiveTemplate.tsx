
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ResumePreviewProps } from '../ResumePreview';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionHeader = motion.header;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function ExecutiveTemplate({ resumeData }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, projects, styling } = resumeData;
  const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
  
  const dynamicStyles = {
    '--title-font-size': `${styling?.titleFontSize || 36}px`,
    '--heading-font-size': `${styling?.headingFontSize || 18}px`,
    '--body-font-size': `${styling?.bodyFontSize || 14}px`,
    '--accent-color': accentColor,
    '--primary-color': 'hsl(var(--primary))'
  } as React.CSSProperties;

  const fontClass = styling?.fontFamily ? styling.fontFamily.replace('font-', 'font-') : 'font-body';

  const containerProps = {
    initial: "hidden",
    animate: "visible",
    variants: {
      visible: { transition: { staggerChildren: 0.1 } }
    }
  };

  const headerClass = "text-left mb-8";
  const sectionTitleClass = "font-bold text-gray-800 mb-2 uppercase tracking-wider font-headline transition-colors duration-500";
  const isCreative = false;

  return (
    <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
      <MotionHeader layout className={cn(headerClass, "transition-all duration-500")} style={isCreative ? { backgroundColor: accentColor } : {}}>
        <MotionH1 layout style={{ fontSize: 'var(--title-font-size)'}} className={cn("font-bold font-headline leading-tight transition-colors duration-500", isCreative ? 'text-white' : 'text-gray-900')}>{personalInfo.name}</MotionH1>
        <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)'}} className={cn("font-semibold font-headline transition-colors duration-500", isCreative ? 'text-white/90' : 'text-[var(--accent-color)]')}>{personalInfo.title}</MotionH2>
        <div className={cn("flex justify-center items-center gap-4 text-sm mt-2 flex-wrap transition-colors duration-500", isCreative ? 'text-white/80' : 'text-gray-600')}>
          <div className="flex items-center gap-1.5"><AtSign size={14} />{personalInfo.email}</div>
          <div className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</div>
          <div className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</div>
          {personalInfo.website && <div className="flex items-center gap-1.5"><Globe size={14} />{personalInfo.website}</div>}
        </div>
      </MotionHeader>
      
      {summary && (
        <>
          <Separator className="my-6" />
          <MotionSection variants={sectionVariants}>
            <h3 className={sectionTitleClass}>Summary</h3>
            <p className="leading-relaxed whitespace-pre-wrap">{summary}</p>
          </MotionSection>
        </>
      )}

      {experience && experience.length > 0 && (
        <>
          <Separator className="my-6" />
          <MotionSection variants={sectionVariants}>
            <h3 className={sectionTitleClass}>Experience</h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-md font-headline">{exp.role}</h4>
                    <p className="text-sm text-gray-600">{exp.date}</p>
                  </div>
                  <p className="text-sm italic text-gray-700 mb-1">{exp.company}</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm marker:text-[var(--accent-color)] transition-colors duration-500">
                    {exp.description.split('\n').filter(l => l.trim()).map((line, index) => <li key={index}>{line.replace(/^[-*]\s*/, '')}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </MotionSection>
        </>
      )}

      {education && education.length > 0 && (
        <>
          <Separator className="my-6" />
          <MotionSection variants={sectionVariants}>
            <h3 className={sectionTitleClass}>Education</h3>
            <div className="space-y-2">
                {education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                        <div><h4 className="font-bold text-md font-headline">{edu.degree}</h4><p className="text-sm italic text-gray-700">{edu.institution}</p></div>
                        <p className="text-sm text-gray-600">{edu.date}</p>
                    </div>
                ))}
            </div>
          </MotionSection>
        </>
      )}

      {skills && skills.length > 0 && (
        <>
          <Separator className="my-6" />
          <MotionSection variants={sectionVariants}>
            <h3 className={sectionTitleClass}>Skills</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <span key={skill.id} className="text-xs uppercase tracking-widest text-stone-700 border border-stone-300 px-2 py-1 rounded">
                        {skill.name} {skill.level !== 'Beginner' ? `(${skill.level})` : ''}
                    </span>
                ))}
            </div>
          </MotionSection>
        </>
      )}

      {projects && projects.length > 0 && (
        <>
          <Separator className="my-6" />
          <MotionSection variants={sectionVariants}>
            <h3 className={sectionTitleClass}>Projects</h3>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-md font-headline">{proj.name}</h4>
                    {proj.link && <p className="text-sm text-[var(--accent-color)]"><a href={proj.link} target="_blank" rel="noopener noreferrer">View Project</a></p>}
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm marker:text-[var(--accent-color)] transition-colors duration-500 mt-1">
                    {proj.description.split('\n').filter(l => l.trim()).map((line, index) => <li key={index}>{line.replace(/^[-*]\s*/, '')}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </MotionSection>
        </>
      )}

    </MotionDiv>
  );
}
