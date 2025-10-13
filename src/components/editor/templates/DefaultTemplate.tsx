
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResumePreviewProps } from '../ResumePreview';

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
};

export function DefaultTemplate({ resumeData }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, projects, templateId = 'modern', styling } = resumeData;
  const templateStyles = templates[templateId] || templates.modern;
  const accentColor = styling?.accentColor || 'hsl(262.1 83.3% 57.8%)';
  
  const dynamicStyles = {
    '--title-font-size': `${styling?.titleFontSize || 36}px`,
    '--heading-font-size': `${styling?.headingFontSize || 18}px`,
    '--body-font-size': `${styling?.bodyFontSize || 14}px`,
    '--accent-color': accentColor
  } as React.CSSProperties;

  return (
    <div style={dynamicStyles} className="bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full font-body text-[var(--body-font-size)]">
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
