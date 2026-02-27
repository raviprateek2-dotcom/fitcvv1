
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ResumePreviewProps } from '../ResumePreview';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;

const skillLevelToValue: Record<string, number> = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function TechnicalTemplate({ resumeData }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, projects, styling } = resumeData;
  const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
  
  const dynamicStyles = {
    '--title-font-size': `${styling?.titleFontSize || 36}px`,
    '--heading-font-size': `${styling?.headingFontSize || 18}px`,
    '--body-font-size': `${styling?.bodyFontSize || 14}px`,
    '--accent-color': accentColor,
    '--primary-color': 'hsl(var(--primary))'
  } as React.CSSProperties;

  const fontClass = styling?.fontFamily ? styling.fontFamily.replace('font-', 'font-') : 'font-mono';

  const containerProps = {
    initial: "hidden",
    animate: "visible",
    variants: {
      visible: { transition: { staggerChildren: 0.1 } }
    }
  };

  const headerClass = 'mb-6 flex justify-between items-start border-b-2 pb-4 border-slate-900';
  const sectionTitleClass = 'text-sm font-black bg-slate-900 text-white px-2 py-0.5 mb-3 inline-block transition-colors duration-500';

  return (
    <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-slate-900 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
        <header className={headerClass}>
            <div>
                <MotionH1 layout style={{ fontSize: 'var(--title-font-size)'}} className="font-black uppercase tracking-tighter leading-none mb-1 text-[var(--accent-color)]">{personalInfo.name}</MotionH1>
                <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)'}} className="font-mono text-slate-500">{personalInfo.title}</MotionH2>
            </div>
            <div className="text-right font-mono text-[10px] space-y-0.5 uppercase tracking-tighter">
                <p>{personalInfo.email}</p><p>{personalInfo.phone}</p><p>{personalInfo.location}</p>
                {personalInfo.website && <p>{personalInfo.website}</p>}
            </div>
        </header>

        <div className="grid grid-cols-4 gap-8 mt-6">
            <div className="col-span-3 space-y-6">
                {summary && (
                  <MotionSection variants={sectionVariants}>
                      <h3 className={sectionTitleClass} style={{ backgroundColor: 'var(--accent-color)' }}>Professional Profile</h3>
                      <p className="leading-tight text-slate-700 whitespace-pre-wrap">{summary}</p>
                  </MotionSection>
                )}
                
                {experience && experience.length > 0 && (
                  <MotionSection variants={sectionVariants}>
                      <h3 className={sectionTitleClass} style={{ backgroundColor: 'var(--accent-color)' }}>Experience</h3>
                      <div className="space-y-4">
                          {experience.map(exp => (
                              <div key={exp.id} className="border-l-2 border-slate-200 pl-4 py-1">
                                  <div className="flex justify-between items-baseline mb-1">
                                      <h4 className="font-bold text-slate-900">{exp.role}</h4>
                                      <span className="font-mono text-[10px] text-slate-400">{exp.date}</span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase">{exp.company}</p>
                                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                                      {exp.description.split('\n').filter(l => l.trim()).map((l, i) => <li key={i}>{l.replace(/^[-*]\s*/, '')}</li>)}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </MotionSection>
                )}

                {projects && projects.length > 0 && (
                  <MotionSection variants={sectionVariants}>
                      <h3 className={sectionTitleClass} style={{ backgroundColor: 'var(--accent-color)' }}>Projects</h3>
                      <div className="space-y-4">
                          {projects.map(proj => (
                              <div key={proj.id} className="border-l-2 border-slate-200 pl-4 py-1">
                                  <div className="flex justify-between items-baseline mb-1">
                                      <h4 className="font-bold text-slate-900">{proj.name}</h4>
                                      {proj.link && <a href={proj.link} className="font-mono text-[10px] font-bold text-[var(--accent-color)] uppercase">Link</a>}
                                  </div>
                                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 mt-1">
                                      {proj.description.split('\n').filter(l => l.trim()).map((l, i) => <li key={i}>{l.replace(/^[-*]\s*/, '')}</li>)}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </MotionSection>
                )}

            </div>
            
            <aside className="space-y-6">
                {skills && skills.length > 0 && (
                  <MotionSection variants={sectionVariants}>
                      <h3 className={sectionTitleClass} style={{ backgroundColor: 'var(--accent-color)' }}>Stack</h3>
                      <div className="space-y-3">
                          {skills.map(skill => (
                              <div key={skill.id}>
                                  <p className="text-[10px] font-bold uppercase mb-1">{skill.name}</p>
                                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${skillLevelToValue[skill.level]}%`, backgroundColor: 'var(--accent-color)' }} />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </MotionSection>
                )}
                
                {education && education.length > 0 && (
                  <MotionSection variants={sectionVariants}>
                      <h3 className={sectionTitleClass} style={{ backgroundColor: 'var(--accent-color)' }}>Education</h3>
                      <div className="space-y-4">
                          {education.map(edu => (
                              <div key={edu.id}>
                                  <p className="text-[10px] font-bold uppercase">{edu.degree}</p>
                                  <p className="text-[10px] text-slate-500">{edu.institution}</p>
                                  <p className="text-[9px] font-mono text-slate-400">{edu.date}</p>
                              </div>
                          ))}
                      </div>
                  </MotionSection>
                )}
            </aside>
        </div>
    </MotionDiv>
  );
}
