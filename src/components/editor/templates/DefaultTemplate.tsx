
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AtSign, Globe, MapPin, Phone, Star, Briefcase, Code, Award, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResumePreviewProps } from '../ResumePreview';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionHeader = motion.header;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;

const skillLevelToValue: Record<string, number> = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100,
};

const templates: Record<string, { header: string, sectionTitle: string }> = {
    modern: {
        header: 'text-center mb-6',
        sectionTitle: 'text-lg font-bold text-[var(--accent-color)] mb-2 uppercase tracking-wider font-headline transition-colors duration-500'
    },
    classic: {
        header: 'mb-6 border-b-2 pb-4',
        sectionTitle: 'text-sm font-extrabold text-gray-700 mb-2 uppercase tracking-widest font-serif transition-colors duration-500'
    },
    creative: {
        header: 'text-center mb-8 p-6 rounded-lg text-white transition-all duration-500',
        sectionTitle: 'text-xl font-bold text-[var(--accent-color)] mb-3 font-headline transition-colors duration-500'
    },
    minimalist: {
        header: 'text-left mb-8',
        sectionTitle: 'text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest transition-colors duration-500'
    },
    professional: {
        header: '', 
        sectionTitle: 'text-md font-bold text-slate-800 border-b-2 pb-1 mb-3 uppercase tracking-wider font-headline transition-colors duration-500'
    },
    executive: {
        header: 'text-left mb-8',
        sectionTitle: 'font-bold text-gray-800 mb-2 uppercase tracking-wider font-headline transition-colors duration-500'
    },
    elegant: {
        header: 'text-center mb-10 pb-6 border-b',
        sectionTitle: 'text-center text-lg font-serif italic text-gray-700 mb-4 transition-colors duration-500'
    },
    technical: {
        header: 'mb-6 flex justify-between items-start border-b-2 pb-4 border-slate-900',
        sectionTitle: 'text-sm font-black bg-slate-900 text-white px-2 py-0.5 mb-3 inline-block transition-colors duration-500'
    }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function DefaultTemplate({ resumeData }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, projects, templateId = 'modern', styling } = resumeData;
  const templateStyles = templates[templateId] || templates.modern;
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

  if (templateId === 'elegant') {
    return (
        <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-stone-800 shadow-2xl rounded-lg w-full h-full p-12 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
            <header className={templateStyles.header}>
                <MotionH1 layout style={{ fontSize: 'var(--title-font-size)'}} className="font-serif italic font-bold mb-2">{personalInfo.name}</MotionH1>
                <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)'}} className="uppercase tracking-[0.2em] text-stone-500 mb-4">{personalInfo.title}</MotionH2>
                <div className="flex justify-center gap-6 text-xs text-stone-400">
                    <span className="flex items-center gap-1"><AtSign size={12}/>{personalInfo.email}</span>
                    <span className="flex items-center gap-1"><Phone size={12}/>{personalInfo.phone}</span>
                    <span className="flex items-center gap-1"><MapPin size={12}/>{personalInfo.location}</span>
                </div>
            </header>
            <div className="space-y-10">
                <MotionSection variants={sectionVariants}>
                    <h3 className={templateStyles.sectionTitle}>Professional Summary</h3>
                    <p className="text-center leading-relaxed italic text-stone-600 max-w-2xl mx-auto">{summary}</p>
                </MotionSection>
                <MotionSection variants={sectionVariants}>
                    <h3 className={templateStyles.sectionTitle}>Experience</h3>
                    <div className="space-y-8">
                        {experience.map(exp => (
                            <div key={exp.id} className="text-center">
                                <h4 className="font-bold text-stone-900">{exp.role}</h4>
                                <p className="text-stone-500 text-sm mb-2">{exp.company} | {exp.date}</p>
                                <p className="text-sm leading-relaxed text-stone-600 px-10">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </MotionSection>
                <div className="grid grid-cols-2 gap-12">
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle}>Education</h3>
                        <div className="space-y-4 text-center">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <p className="font-bold text-stone-800">{edu.degree}</p>
                                    <p className="text-xs text-stone-500 uppercase">{edu.institution}</p>
                                </div>
                            ))}
                        </div>
                    </MotionSection>
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle}>Expertise</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {skills?.map(skill => (
                                <span key={skill.id} className="text-xs uppercase tracking-widest text-stone-500 border border-stone-200 px-2 py-1">{skill.name}</span>
                            ))}
                        </div>
                    </MotionSection>
                </div>
            </div>
        </MotionDiv>
    );
  }

  if (templateId === 'technical') {
    return (
        <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-slate-900 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
            <header className={templateStyles.header}>
                <div>
                    <MotionH1 layout style={{ fontSize: 'var(--title-font-size)'}} className="font-black uppercase tracking-tighter leading-none mb-1">{personalInfo.name}</MotionH1>
                    <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)'}} className="font-mono text-slate-500">{personalInfo.title}</MotionH2>
                </div>
                <div className="text-right font-mono text-[10px] space-y-0.5 uppercase tracking-tighter">
                    <p>{personalInfo.email}</p><p>{personalInfo.phone}</p><p>{personalInfo.location}</p>
                    {personalInfo.website && <p>{personalInfo.website}</p>}
                </div>
            </header>
            <div className="grid grid-cols-4 gap-8 mt-6">
                <div className="col-span-3 space-y-6">
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle}>Professional Profile</h3>
                        <p className="leading-tight text-slate-700">{summary}</p>
                    </MotionSection>
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle}>Experience</h3>
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
                </div>
                <aside className="space-y-6">
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle}>Stack</h3>
                        <div className="space-y-3">
                            {skills?.map(skill => (
                                <div key={skill.id}>
                                    <p className="text-[10px] font-bold uppercase mb-1">{skill.name}</p>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-900" style={{ width: `${skillLevelToValue[skill.level]}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MotionSection>
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle}>Education</h3>
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
                </aside>
            </div>
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
      <Separator className="my-6" />
      <MotionSection variants={sectionVariants}>
        <h3 className={templateStyles.sectionTitle}>Summary</h3>
        <p className="leading-relaxed">{summary}</p>
      </MotionSection>
      <Separator className="my-6" />
      <MotionSection variants={sectionVariants}>
        <h3 className={templateStyles.sectionTitle}>Experience</h3>
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
      <Separator className="my-6" />
      <MotionSection variants={sectionVariants}>
        <h3 className={templateStyles.sectionTitle}>Education</h3>
        <div className="space-y-2">
            {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                    <div><h4 className="font-bold text-md font-headline">{edu.degree}</h4><p className="text-sm italic text-gray-700">{edu.institution}</p></div>
                    <p className="text-sm text-gray-600">{edu.date}</p>
                </div>
            ))}
        </div>
      </MotionSection>
    </MotionDiv>
  );
}
