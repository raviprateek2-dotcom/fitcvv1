
'use client';

import React from 'react';
import { AtSign, Globe, MapPin, Phone, Star, Briefcase, Code } from 'lucide-react';
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
        '--heading-font-size': `${styling?.headingFontSize || 18}px`,
        '--body-font-size': `${styling?.bodyFontSize || 14}px`,
        '--accent-color': accentColor,
    } as React.CSSProperties;

    return (
        <div style={dynamicStyles} className="bg-slate-800 text-slate-300 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex text-[var(--body-font-size)]">
            {/* Left Sidebar */}
            <aside className="w-1/3 bg-slate-900/50 text-slate-200 p-8 space-y-8 flex flex-col">
                <header className="text-center">
                    <h1 style={{ fontSize: 'var(--title-font-size)'}} className="font-bold text-white font-headline leading-tight">{personalInfo.name}</h1>
                    <h2 style={{ fontSize: 'var(--heading-font-size)', color: 'var(--accent-color)'}} className="font-semibold">{personalInfo.title}</h2>
                </header>

                <div className="space-y-4 text-sm">
                    <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-white uppercase tracking-wider font-headline border-b border-slate-600 pb-1">Contact</h3>
                     <div className="flex items-center gap-2"><AtSign size={14} style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.email}</span></div>
                    <div className="flex items-center gap-2"><Phone size={14} style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.phone}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={14} style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.location}</span></div>
                    {personalInfo.website && <div className="flex items-center gap-2"><Globe size={14} style={{ color: 'var(--accent-color)' }}/><span>{personalInfo.website}</span></div>}
                </div>

                {skills && skills.length > 0 && (
                    <div className="space-y-4">
                         <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-white uppercase tracking-wider font-headline border-b border-slate-600 pb-1">Skills</h3>
                         <div className="space-y-3">
                            {(skills || []).map(skill => (
                                <div key={skill.id} className="text-sm">
                                    <p className="font-semibold mb-1">{skill.name}</p>
                                    <Progress value={skillLevelToValue[skill.level]} className="h-2 bg-slate-700" indicatorClassName="bg-[var(--accent-color)]" />
                                </div>
                            ))}
                         </div>
                    </div>
                )}

                <div className="space-y-4">
                     <h3 style={{ fontSize: 'var(--heading-font-size)'}} className="font-bold text-white uppercase tracking-wider font-headline border-b border-slate-600 pb-1">Education</h3>
                     <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <h4 className="font-bold text-slate-100 font-headline">{edu.degree}</h4>
                                <p className="italic text-slate-400">{edu.institution}</p>
                                <p className="text-xs text-slate-500">{edu.date}</p>
                            </div>
                        ))}
                     </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8 overflow-y-auto">
                <section>
                    <h3 className="text-md font-bold text-slate-100 border-b-2 border-slate-500 pb-1 mb-3 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)'}}><Star className="inline-block mr-2 text-[var(--accent-color)]" size={18}/>Summary</h3>
                    <p className="leading-relaxed">{summary}</p>
                </section>
                <Separator className="my-6 bg-slate-700" />
                <section>
                    <h3 className="text-md font-bold text-slate-100 border-b-2 border-slate-500 pb-1 mb-3 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)'}}><Briefcase className="inline-block mr-2 text-[var(--accent-color)]" size={18}/>Experience</h3>
                    <div className="space-y-5">
                    {experience.map((exp) => (
                        <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-md text-slate-100 font-headline">{exp.role}</h4>
                            <p className="text-xs text-slate-400">{exp.date}</p>
                        </div>
                        <p className="italic text-slate-300 mb-2">{exp.company}</p>
                        <ul className="list-disc pl-5 space-y-1 leading-relaxed" style={{ '--accent-color': accentColor } as React.CSSProperties}>
                            {exp.description.split('\n').map((line, index) => {
                                const trimmedLine = line.trim();
                                if (!trimmedLine) return null;
                                const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                                return <li key={index} className="marker:text-[var(--accent-color)]">{cleanedLine}</li>;
                            })}
                        </ul>
                        </div>
                    ))}
                    </div>
                </section>
                {projects && projects.length > 0 && <Separator className="my-6 bg-slate-700" />}
                {projects && projects.length > 0 && (
                    <section>
                        <h3 className="text-md font-bold text-slate-100 border-b-2 border-slate-500 pb-1 mb-3 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)'}}><Code className="inline-block mr-2 text-[var(--accent-color)]" size={18}/>Projects</h3>
                        <div className="space-y-5">
                        {(projects || []).map((proj) => (
                            <div key={proj.id}>
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-md text-slate-100 font-headline">{proj.name}</h4>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent-color)] hover:underline">View Project</a>}
                            </div>
                            <ul className="list-disc pl-5 space-y-1 leading-relaxed mt-1" style={{ '--accent-color': accentColor } as React.CSSProperties}>
                                {proj.description.split('\n').map((line, index) => {
                                    const trimmedLine = line.trim();
                                    if (!trimmedLine) return null;
                                    const cleanedLine = trimmedLine.replace(/^[-*]\s*/, '');
                                    return <li key={index} className="marker:text-[var(--accent-color)]">{cleanedLine}</li>;
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

    