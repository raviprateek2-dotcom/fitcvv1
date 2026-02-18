
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AtSign, Globe, MapPin, Phone, Star, Briefcase, Code, Award, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResumePreviewProps } from '../ResumePreview';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

// Explicitly define motion components to avoid SWC parser issues with member expressions in JSX
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
      visible: {
        transition: {
          staggerChildren: 0.1
        }
      }
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
                    <p>{personalInfo.email}</p>
                    <p>{personalInfo.phone}</p>
                    <p>{personalInfo.location}</p>
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

                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle}>Key Projects</h3>
                        <div className="space-y-4">
                            {projects?.map(proj => (
                                <div key={proj.id} className="border-l-2 border-slate-200 pl-4 py-1">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-slate-900">{proj.name}</h4>
                                        {proj.link && <span className="font-mono text-[10px] text-blue-600 underline">{proj.link}</span>}
                                    </div>
                                    <p className="text-xs text-slate-600">{proj.description}</p>
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

  if (templateId === 'professional') {
    return (
        <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-slate-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
            <aside className="w-1/3 bg-slate-50 text-slate-700 p-8 space-y-8 flex flex-col border-r-4 transition-all duration-500" style={{borderColor: 'var(--accent-color)'}}>
                <MotionDiv variants={sectionVariants} className="space-y-4 text-sm">
                    <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-slate-900 uppercase tracking-wider font-headline border-b-2 border-slate-300 pb-2">Contact</h3>
                     <div className="flex items-start gap-3"><AtSign size={14} className="mt-1 flex-shrink-0 transition-colors duration-500" style={{ color: 'var(--accent-color)' }}/><span className="break-all">{personalInfo.email}</span></div>
                    <div className="flex items-start gap-3"><Phone size={14} className="mt-1 flex-shrink-0 transition-colors duration-500" style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.phone}</span></div>
                    <div className="flex items-start gap-3"><MapPin size={14} className="mt-1 flex-shrink-0 transition-colors duration-500" style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.location}</span></div>
                    {personalInfo.website && <div className="flex items-start gap-3"><Globe size={14} className="mt-1 flex-shrink-0 transition-colors duration-500" style={{ color: 'var(--accent-color)' }}/><span className="break-all">{personalInfo.website}</span></div>}
                </MotionDiv>
                {skills && skills.length > 0 && (
                    <MotionDiv variants={sectionVariants} className="space-y-4">
                         <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-slate-900 uppercase tracking-wider font-headline border-b-2 border-slate-300 pb-2">Skills</h3>
                         <div className="space-y-4">
                            {(skills || []).map(skill => (
                                <div key={skill.id} className="text-sm">
                                    <p className="font-semibold mb-1">{skill.name}</p>
                                    <Progress value={skillLevelToValue[skill.level] || 0} className="h-1.5 bg-slate-200" indicatorClassName="bg-[var(--accent-color)] transition-all duration-500" />
                                </div>
                            ))}
                         </div>
                    </MotionDiv>
                )}
                <MotionDiv variants={sectionVariants} className="space-y-4">
                     <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-slate-900 uppercase tracking-wider font-headline border-b-2 border-slate-300 pb-2">Education</h3>
                     <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <h4 className="font-bold text-slate-800 font-headline text-sm">{edu.degree}</h4>
                                <p className="italic text-slate-600 text-sm">{edu.institution}</p>
                                <p className="text-xs text-slate-500">{edu.date}</p>
                            </div>
                        ))}
                     </div>
                </MotionDiv>
            </aside>
            <main className="w-2/3 p-10 overflow-y-auto bg-white">
                <header className="mb-8">
                     <MotionH1 layout style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-color)'}} className="font-bold font-headline leading-tight transition-colors duration-500">{personalInfo.name}</MotionH1>
                    <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)'}} className="font-semibold text-slate-600">{personalInfo.title}</MotionH2>
                </header>
                <MotionSection variants={sectionVariants}>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Star className="inline-block mr-2 transition-colors duration-500" size={16} style={{color: 'var(--accent-color)'}}/>Summary</h3>
                    <p className="leading-relaxed text-slate-700">{summary}</p>
                </MotionSection>
                <Separator className="my-6 bg-slate-200" />
                <MotionSection variants={sectionVariants}>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Briefcase className="inline-block mr-2 transition-colors duration-500" size={16} style={{color: 'var(--accent-color)'}}/>Experience</h3>
                    <div className="space-y-5">
                    {experience.map((exp) => (
                        <div key={exp.id} className="group/item transition-all duration-300 hover:translate-x-1">
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-md text-slate-900 font-headline">{exp.role}</h4>
                            <p className="text-xs text-slate-500 font-medium">{exp.date}</p>
                        </div>
                        <p className="italic text-slate-600 mb-2">{exp.company}</p>
                        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed marker:text-[var(--accent-color)] text-slate-600 transition-colors duration-500">
                            {exp.description.split('\n').map((line, index) => {
                                const trimmedLine = line.trim();
                                if (!trimmedLine) return null;
                                const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                                return <li key={index}>{cleanedLine}</li>;
                            })}
                        </ul>
                        </div>
                    ))}
                    </div>
                </MotionSection>
                {projects && projects.length > 0 && <Separator className="my-6 bg-slate-200" />}
                {projects && projects.length > 0 && (
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Code className="inline-block mr-2 transition-colors duration-500" size={16} style={{color: 'var(--accent-color)'}}/>Projects</h3>
                        <div className="space-y-5">
                        {(projects || []).map((proj) => (
                            <div key={proj.id} className="group/item transition-all duration-300 hover:translate-x-1">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-md text-slate-900 font-headline">{proj.name}</h4>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent-color)] hover:underline font-medium transition-colors duration-500">View Project</a>}
                            </div>
                             <ul className="list-disc pl-5 space-y-1.5 leading-relaxed marker:text-[var(--accent-color)] text-slate-600 mt-1 transition-colors duration-500">
                                {proj.description.split('\n').map((line, index) => {
                                    const trimmedLine = line.trim();
                                    if (!trimmedLine) return null;
                                    const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                                    return <li key={index}>{cleanedLine}</li>;
                                })}
                            </ul>
                            </div>
                        ))}
                        </div>
                    </MotionSection>
                )}
            </main>
        </MotionDiv>
    )
  }

  if (templateId === 'executive') {
    return (
        <MotionDiv {...containerProps} style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex text-[var(--body-font-size)] transition-colors duration-500", fontClass)}>
            <aside className="w-1/3 bg-primary text-primary-foreground p-8 space-y-8 flex flex-col transition-colors duration-500">
                <MotionDiv variants={sectionVariants} className="space-y-4 text-sm">
                    <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold uppercase tracking-wider font-headline border-b-2 border-primary-foreground/50 pb-2">Contact</h3>
                     <div className="flex items-start gap-3"><AtSign size={14} className="mt-1 flex-shrink-0" /><span className="break-all">{personalInfo.email}</span></div>
                    <div className="flex items-start gap-3"><Phone size={14} className="mt-1 flex-shrink-0" /><span>{personalInfo.phone}</span></div>
                    <div className="flex items-start gap-3"><MapPin size={14} className="mt-1 flex-shrink-0" /><span>{personalInfo.location}</span></div>
                    {personalInfo.website && <div className="flex items-start gap-3"><Globe size={14} className="mt-1 flex-shrink-0" /><span className="break-all">{personalInfo.website}</span></div>}
                </MotionDiv>
                {skills && skills.length > 0 && (
                    <MotionDiv variants={sectionVariants} className="space-y-4">
                         <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold uppercase tracking-wider font-headline border-b-2 border-primary-foreground/50 pb-2">Skills</h3>
                         <ul className="space-y-1 text-sm">
                            {(skills || []).map(skill => (
                                <li key={skill.id} className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80"></span>
                                  <span>{skill.name}</span>
                                </li>
                            ))}
                         </ul>
                    </MotionDiv>
                )}
                <MotionDiv variants={sectionVariants} className="space-y-4">
                     <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold uppercase tracking-wider font-headline border-b-2 border-primary-foreground/50 pb-2">Education</h3>
                     <div className="space-y-4 text-sm">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <h4 className="font-bold font-headline">{edu.degree}</h4>
                                <p className="text-primary-foreground/90">{edu.institution}</p>
                                <p className="text-xs text-primary-foreground/80">{edu.date}</p>
                            </div>
                        ))}
                     </div>
                </MotionDiv>
            </aside>
            <main className="w-2/3 p-10 overflow-y-auto">
                <header className="text-left mb-8">
                    <MotionH1 layout style={{ fontSize: 'var(--title-font-size)'}} className="font-bold text-gray-900 font-headline leading-tight">{personalInfo.name}</MotionH1>
                    <MotionH2 layout style={{ fontSize: 'var(--heading-font-size)', color: 'var(--accent-color)'}} className="font-semibold transition-colors duration-500">{personalInfo.title}</MotionH2>
                </header>
                <MotionSection variants={sectionVariants}>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Summary</h3>
                    <p className="leading-relaxed text-gray-700">{summary}</p>
                </MotionSection>
                <Separator className="my-6" />
                <MotionSection variants={sectionVariants}>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Experience</h3>
                    <div className="space-y-5">
                    {experience.map((exp) => (
                        <div key={exp.id} className="group/item transition-all duration-300 hover:translate-x-1">
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-md font-headline text-gray-900">{exp.role}</h4>
                            <p className="text-xs text-gray-600 font-medium">{exp.date}</p>
                        </div>
                        <p className="italic text-gray-700 mb-2">{exp.company}</p>
                        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-sm text-gray-600">
                            {exp.description.split('\n').map((line, index) => {
                                const trimmedLine = line.trim();
                                if (!trimmedLine) return null;
                                const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                                return <li key={index}>{cleanedLine}</li>;
                            })}
                        </ul>
                        </div>
                    ))}
                    </div>
                </MotionSection>
                {projects && projects.length > 0 && <Separator className="my-6" />}
                {projects && projects.length > 0 && (
                    <MotionSection variants={sectionVariants}>
                        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Projects</h3>
                        <div className="space-y-5">
                        {(projects || []).map((proj) => (
                            <div key={proj.id} className="group/item transition-all duration-300 hover:translate-x-1">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-md text-gray-900 font-headline">{proj.name}</h4>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent-color)] hover:underline font-medium transition-colors duration-500">View Project</a>}
                            </div>
                            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-sm text-gray-600 mt-1">
                                {proj.description.split('\n').map((line, index) => {
                                    const trimmedLine = line.trim();
                                    if (!trimmedLine) return null;
                                    const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                                    return <li key={index}>{cleanedLine}</li>;
                                })}
                            </ul>
                            </div>
                        ))}
                        </div>
                    </MotionSection>
                )}
            </main>
        </MotionDiv>
    )
  }

  // Fallback to default single-column templates
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

      <MotionSection variants={sectionVariants}>
        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Summary</h3>
        <p className="leading-relaxed">{summary}</p>
      </MotionSection>

      <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />

      <MotionSection variants={sectionVariants}>
        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Experience</h3>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="group/item transition-all duration-300 hover:translate-x-1">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-md font-headline">{exp.role}</h4>
                <p className="text-sm text-gray-600">{exp.date}</p>
              </div>
              <p className="text-sm italic text-gray-700 mb-1">{exp.company}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm marker:text-[var(--accent-color)] transition-colors duration-500">
                 {exp.description.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;
                    const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                    return <li key={index}>{cleanedLine}</li>;
                  })}
              </ul>
            </div>
          ))}
        </div>
      </MotionSection>

      {projects && projects.length > 0 && <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />}
      
      {projects && projects.length > 0 && (
        <MotionSection variants={sectionVariants}>
          <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Projects</h3>
          <div className="space-y-4">
            {(projects || []).map((proj) => (
              <div key={proj.id} className="group/item transition-all duration-300 hover:translate-x-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-md font-headline">{proj.name}</h4>
                   {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-color)] hover:underline transition-colors duration-500">View Project</a>}
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1 marker:text-[var(--accent-color)] transition-colors duration-500">
                   {proj.description.split('\n').map((line, index) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;
                      const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                      return <li key={index}>{cleanedLine}</li>;
                    })}
                </ul>
              </div>
            ))}
          </div>
        </MotionSection>
      )}

      {skills && skills.length > 0 && <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />}

      {skills && skills.length > 0 && (
        <MotionSection variants={sectionVariants}>
          <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Skills</h3>
          <div className="flex flex-wrap gap-2">
              {(skills || []).map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="transition-all duration-500" style={{ backgroundColor: `${accentColor}1A`, color: accentColor, borderColor: `${accentColor}40` }}>{skill.name}</Badge>
              ))}
          </div>
        </MotionSection>
      )}
      
      <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />

      <MotionSection variants={sectionVariants}>
        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Education</h3>
        <div className="space-y-2">
            {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                        <h4 className="font-bold text-md font-headline">{edu.degree}</h4>
                        <p className="text-sm italic text-gray-700">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-gray-600">{edu.date}</p>
                </div>
            ))}
        </div>
      </MotionSection>
    </MotionDiv>
  );
}
