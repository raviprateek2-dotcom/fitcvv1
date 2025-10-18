
'use client';

import React from 'react';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ResumePreviewProps } from '../ResumePreview';

export function ExecutiveTemplate({ resumeData }: ResumePreviewProps) {
    const { personalInfo, summary, experience, education, skills, projects, styling } = resumeData;
    const accentColor = styling?.accentColor || 'hsl(221.2 83.2% 53.3%)';
    
    const dynamicStyles = {
        '--title-font-size': `${styling?.titleFontSize || 32}px`,
        '--heading-font-size': `${styling?.headingFontSize || 16}px`,
        '--body-font-size': `${styling?.bodyFontSize || 12}px`,
        '--accent-color': accentColor,
    } as React.CSSProperties;

    return (
        <div style={dynamicStyles} className="bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex text-[var(--body-font-size)]">
            {/* Left Sidebar */}
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

            {/* Main Content */}
            <main className="w-2/3 p-10 overflow-y-auto">
                <header className="text-left mb-8">
                    <h1 style={{ fontSize: 'var(--title-font-size)'}} className="font-bold text-gray-900 font-headline leading-tight">{personalInfo.name}</h1>
                    <h2 style={{ fontSize: 'var(--heading-font-size)', color: 'var(--accent-color)'}} className="font-semibold">{personalInfo.title}</h2>
                </header>

                <section>
                    <h3 className="font-bold text-gray-800 mb-2 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)'}}>Summary</h3>
                    <p className="leading-relaxed text-gray-700">{summary}</p>
                </section>
                <Separator className="my-6" />
                <section>
                    <h3 className="font-bold text-gray-800 mb-4 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)'}}>Experience</h3>
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
                        <h3 className="font-bold text-gray-800 mb-4 uppercase tracking-wider font-headline" style={{ fontSize: 'var(--heading-font-size)'}}>Projects</h3>
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

    