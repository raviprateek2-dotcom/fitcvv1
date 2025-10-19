
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AtSign, Globe, MapPin, Phone, Star, Briefcase, Code, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResumePreviewProps } from '../ResumePreview';
import { Progress } from '@/components/ui/progress';

const skillLevelToValue = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100,
};

const templates: Record<string, { header: string, sectionTitle: string }> = {
    modern: {
        header: 'text-center mb-6',
        sectionTitle: 'text-lg font-bold text-[var(--accent-color)] mb-2 uppercase tracking-wider font-headline'
    },
    classic: {
        header: 'mb-6 border-b-2 pb-4',
        sectionTitle: 'text-sm font-extrabold text-gray-700 mb-2 uppercase tracking-widest font-serif'
    },
    creative: {
        header: 'text-center mb-8 p-6 rounded-lg text-white',
        sectionTitle: 'text-xl font-bold text-[var(--accent-color)] mb-3 font-headline'
    },
    minimalist: {
        header: 'text-left mb-8',
        sectionTitle: 'text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest'
    },
    professional: {
        header: '', // Handled by two-column layout
        sectionTitle: 'text-md font-bold text-slate-800 border-b-2 pb-1 mb-3 uppercase tracking-wider font-headline'
    },
    executive: {
        header: 'text-left mb-8', // Handled by two-column layout
        sectionTitle: 'font-bold text-gray-800 mb-2 uppercase tracking-wider font-headline'
    }
};

export function DefaultTemplate({ resumeData }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, projects, templateId = 'modern', styling } = resumeData;
  const templateStyles = templates[templateId] || templates.modern;
  const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
  
  const dynamicStyles = {
    '--title-font-size': `${styling?.titleFontSize || 36}px`,
    '--heading-font-size': `${styling?.headingFontSize || 18}px`,
    '--body-font-size': `${styling?.bodyFontSize || 14}px`,
    '--accent-color': accentColor
  } as React.CSSProperties;

  const fontClass = styling?.fontFamily ? `font-${styling.fontFamily.split('-')[1]}` : 'font-body';

  if (templateId === 'professional') {
    return (
        <div style={dynamicStyles} className={cn("bg-white text-slate-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex text-[var(--body-font-size)]", fontClass)}>
            <aside className="w-1/3 bg-slate-50 text-slate-700 p-8 space-y-8 flex flex-col border-r-4" style={{borderColor: 'var(--accent-color)'}}>
                <div className="space-y-4 text-sm">
                    <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-slate-900 uppercase tracking-wider font-headline border-b-2 border-slate-300 pb-2">Contact</h3>
                     <div className="flex items-start gap-3"><AtSign size={14} className="mt-1 flex-shrink-0" style={{ color: 'var(--accent-color)' }}/><span className="break-all">{personalInfo.email}</span></div>
                    <div className="flex items-start gap-3"><Phone size={14} className="mt-1 flex-shrink-0" style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.phone}</span></div>
                    <div className="flex items-start gap-3"><MapPin size={14} className="mt-1 flex-shrink-0" style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.location}</span></div>
                    {personalInfo.website && <div className="flex items-start gap-3"><Globe size={14} className="mt-1 flex-shrink-0" style={{ color: 'var(--accent-color)' }}/><span className="break-all">{personalInfo.website}</span></div>}
                </div>
                {skills && skills.length > 0 && (
                    <div className="space-y-4">
                         <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-slate-900 uppercase tracking-wider font-headline border-b-2 border-slate-300 pb-2">Skills</h3>
                         <div className="space-y-4">
                            {(skills || []).map(skill => (
                                <div key={skill.id} className="text-sm">
                                    <p className="font-semibold mb-1">{skill.name}</p>
                                    <Progress value={skillLevelToValue[skill.level]} className="h-1.5 bg-slate-200" indicatorClassName="bg-[var(--accent-color)]" />
                                </div>
                            ))}
                         </div>
                    </div>
                )}
                <div className="space-y-4">
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
                </div>
            </aside>
            <main className="w-2/3 p-10 overflow-y-auto bg-white">
                <header className="mb-8">
                     <h1 style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-color)'}} className="font-bold font-headline leading-tight">{personalInfo.name}</h1>
                    <h2 style={{ fontSize: 'var(--heading-font-size)'}} className="font-semibold text-slate-600">{personalInfo.title}</h2>
                </header>
                <section>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Star className="inline-block mr-2" size={16} style={{color: 'var(--accent-color)'}}/>Summary</h3>
                    <p className="leading-relaxed text-slate-700">{summary}</p>
                </section>
                <Separator className="my-6 bg-slate-200" />
                <section>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Briefcase className="inline-block mr-2" size={16} style={{color: 'var(--accent-color)'}}/>Experience</h3>
                    <div className="space-y-5">
                    {experience.map((exp) => (
                        <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-md text-slate-900 font-headline">{exp.role}</h4>
                            <p className="text-xs text-slate-500 font-medium">{exp.date}</p>
                        </div>
                        <p className="italic text-slate-600 mb-2">{exp.company}</p>
                        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed marker:text-[var(--accent-color)] text-slate-600">
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
                </section>
                {projects && projects.length > 0 && <Separator className="my-6 bg-slate-200" />}
                {projects && projects.length > 0 && (
                    <section>
                        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Code className="inline-block mr-2" size={16} style={{color: 'var(--accent-color)'}}/>Projects</h3>
                        <div className="space-y-5">
                        {(projects || []).map((proj) => (
                            <div key={proj.id}>
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-md text-slate-900 font-headline">{proj.name}</h4>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent-color)] hover:underline font-medium">View Project</a>}
                            </div>
                             <ul className="list-disc pl-5 space-y-1.5 leading-relaxed marker:text-[var(--accent-color)] text-slate-600 mt-1">
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
                    </section>
                )}
            </main>
        </div>
    )
  }

  if (templateId === 'executive') {
    return (
        <div style={dynamicStyles} className={cn("bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full flex text-[var(--body-font-size)]", fontClass)}>
            <aside className="w-1/3 text-white p-8 space-y-8 flex flex-col" style={{ backgroundColor: accentColor }}>
                <div className="space-y-4">
                    <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold uppercase tracking-wider font-headline border-b-2 border-white/50 pb-2">Contact</h3>
                     <div className="flex items-start gap-3"><AtSign size={14} className="mt-1 flex-shrink-0" /><span>{personalInfo.email}</span></div>
                    <div className="flex items-start gap-3"><Phone size={14} className="mt-1 flex-shrink-0" /><span>{personalInfo.phone}</span></div>
                    <div className="flex items-start gap-3"><MapPin size={14} className="mt-1 flex-shrink-0" /><span>{personalInfo.location}</span></div>
                    {personalInfo.website && <div className="flex items-start gap-3"><Globe size={14} className="mt-1 flex-shrink-0" /><span>{personalInfo.website}</span></div>}
                </div>
                {skills && skills.length > 0 && (
                    <div className="space-y-4">
                         <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold uppercase tracking-wider font-headline border-b-2 border-white/50 pb-2">Skills</h3>
                         <ul className="space-y-1">
                            {(skills || []).map(skill => (
                                <li key={skill.id} className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-white/80"></span>
                                  <span>{skill.name}</span>
                                </li>
                            ))}
                         </ul>
                    </div>
                )}
                <div className="space-y-4">
                     <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold uppercase tracking-wider font-headline border-b-2 border-white/50 pb-2">Education</h3>
                     <div className="space-y-4">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <h4 className="font-bold font-headline">{edu.degree}</h4>
                                <p className="text-white/90">{edu.institution}</p>
                                <p className="text-xs text-white/80">{edu.date}</p>
                            </div>
                        ))}
                     </div>
                </div>
            </aside>
            <main className="w-2/3 p-10 overflow-y-auto">
                <header className="text-left mb-8">
                    <h1 style={{ fontSize: 'var(--title-font-size)'}} className="font-bold text-gray-900 font-headline leading-tight">{personalInfo.name}</h1>
                    <h2 style={{ fontSize: 'var(--heading-font-size)', color: 'var(--accent-color)'}} className="font-semibold">{personalInfo.title}</h2>
                </header>
                <section>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Summary</h3>
                    <p className="leading-relaxed text-gray-700">{summary}</p>
                </section>
                <Separator className="my-6" />
                <section>
                    <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Experience</h3>
                    <div className="space-y-5">
                    {experience.map((exp) => (
                        <div key={exp.id}>
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
                </section>
                {projects && projects.length > 0 && <Separator className="my-6" />}
                {projects && projects.length > 0 && (
                    <section>
                        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Projects</h3>
                        <div className="space-y-5">
                        {(projects || []).map((proj) => (
                            <div key={proj.id}>
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-md font-headline text-gray-900">{proj.name}</h4>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent-color)] hover:underline font-medium">View Project</a>}
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
                    </section>
                )}
            </main>
        </div>
    )
  }

  // Fallback to default single-column templates
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

      <section>
        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Summary</h3>
        <p className="leading-relaxed">{summary}</p>
      </section>

      <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />

      <section>
        <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Experience</h3>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-md font-headline">{exp.role}</h4>
                <p className="text-sm text-gray-600">{exp.date}</p>
              </div>
              <p className="text-sm italic text-gray-700 mb-1">{exp.company}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm marker:text-[var(--accent-color)]">
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
      </section>

      {projects && projects.length > 0 && <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />}
      
      {projects && projects.length > 0 && (
        <section>
          <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Projects</h3>
          <div className="space-y-4">
            {(projects || []).map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-md font-headline">{proj.name}</h4>
                   {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-color)] hover:underline">View Project</a>}
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-1 marker:text-[var(--accent-color)]">
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
        </section>
      )}

      {skills && skills.length > 0 && <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />}

      {skills && skills.length > 0 && (
        <section>
          <h3 className={templateStyles.sectionTitle} style={{ fontSize: 'var(--heading-font-size)'}}>Skills</h3>
          <div className="flex flex-wrap gap-2">
              {(skills || []).map((skill) => (
                  <Badge key={skill.id} variant="secondary" style={{ backgroundColor: `${accentColor}1A`, color: accentColor, borderColor: `${accentColor}40` }}>{skill.name}</Badge>
              ))}
          </div>
        </section>
      )}
      
      <Separator className={cn("my-6", templateId === 'minimalist' ? 'bg-gray-200' : '')} />

      <section>
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
      </section>
    </div>
  );
}
