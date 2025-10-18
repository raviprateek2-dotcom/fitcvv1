
'use client';

import React from 'react';
import { AtSign, Globe, MapPin, Phone, Star, Briefcase, Code, BookOpen, Wrench } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import type { ResumePreviewProps } from '../ResumePreview';

const skillLevelToValue = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100,
};

export function ProfessionalTemplate({ resumeData }: ResumePreviewProps) {
    const { personalInfo, summary, experience, education, skills, projects, styling } = resumeData;
    const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
    
    const dynamicStyles = {
        '--title-font-size': `${styling?.titleFontSize || 36}px`,
        '--heading-font-size': `${styling?.headingFontSize || 16}px`,
        '--body-font-size': `${styling?.bodyFontSize || 13}px`,
        '--accent-color': accentColor,
    } as React.CSSProperties;

    return (
        <div style={dynamicStyles} className="bg-white text-slate-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex text-[var(--body-font-size)]">
            {/* Left Sidebar */}
            <aside className="w-1/3 bg-slate-50 text-slate-700 p-8 space-y-8 flex flex-col border-r-4" style={{borderColor: 'var(--accent-color)'}}>
                <header className="text-center">
                    {/* You could add an avatar here if you wanted */}
                </header>

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

            {/* Main Content */}
            <main className="w-2/3 p-10 overflow-y-auto bg-white">
                <header className="mb-8">
                     <h1 style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-color)'}} className="font-bold font-headline leading-tight">{personalInfo.name}</h1>
                    <h2 style={{ fontSize: 'var(--heading-font-size)'}} className="font-semibold text-slate-600">{personalInfo.title}</h2>
                </header>

                <section>
                    <h3 className="text-md font-bold text-slate-800 border-b-2 pb-1 mb-3 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Star className="inline-block mr-2" size={16} style={{color: 'var(--accent-color)'}}/>Summary</h3>
                    <p className="leading-relaxed text-slate-700">{summary}</p>
                </section>
                <Separator className="my-6 bg-slate-200" />
                <section>
                    <h3 className="text-md font-bold text-slate-800 border-b-2 pb-1 mb-4 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Briefcase className="inline-block mr-2" size={16} style={{color: 'var(--accent-color)'}}/>Experience</h3>
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
                        <h3 className="text-md font-bold text-slate-800 border-b-2 pb-1 mb-4 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)', borderColor: 'var(--accent-color)'}}><Code className="inline-block mr-2" size={16} style={{color: 'var(--accent-color)'}}/>Projects</h3>
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

    