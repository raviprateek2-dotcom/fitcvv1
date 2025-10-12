'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AtSign, Globe, MapPin, Phone, Star, TrendingUp, Zap, Briefcase, GraduationCap, Code } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';


// Reusing types from ResumeEditor.tsx
type PersonalInfo = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

type Experience = {
  id: number;
  company: string;
  role: string;
  date: string;
  description: string;
};

type Education = {
  id: number;
  institution: string;
  degree: string;
  date: string;
};

type Skill = {
    id: number;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
};

type Project = {
  id: number;
  name: string;
  description: string;
  link: string;
};

type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  jobDescription?: string;
  templateId?: string;
  coverLetter?: string;
  companyInfo?: {
    name: string;
    jobTitle: string;
  };
};

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId?: string;
}

const templates: Record<string, { header: string, sectionTitle: string }> = {
    modern: {
        header: 'text-center mb-6',
        sectionTitle: 'text-lg font-bold text-primary mb-2 uppercase tracking-wider font-headline'
    },
    classic: {
        header: 'mb-6 border-b-2 pb-4 border-gray-800',
        sectionTitle: 'text-sm font-extrabold text-gray-700 mb-2 uppercase tracking-widest font-serif'
    },
    creative: {
        header: 'text-center mb-8 p-4 bg-primary/10 rounded-lg',
        sectionTitle: 'text-xl font-bold text-primary mb-3 font-headline'
    },
    minimalist: {
        header: 'text-left mb-8',
        sectionTitle: 'text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest'
    },
    professional: {
        header: '',
        sectionTitle: 'text-md font-bold text-slate-100 border-b-2 border-slate-500 pb-1 mb-3 uppercase tracking-wider font-headline'
    }
}

const skillLevelToValue = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100,
};

const ProfessionalTemplatePreview = ({ resumeData }: { resumeData: ResumeData }) => {
    const { personalInfo, summary, experience, education, skills, projects } = resumeData;
    const templateStyles = templates.professional;
    
    return (
        <div className="bg-slate-800 text-slate-300 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex">
            {/* Left Sidebar */}
            <aside className="w-1/3 bg-slate-900/50 text-slate-200 p-8 space-y-8 flex flex-col">
                <header className="text-center">
                    <h1 className="text-3xl font-bold text-white font-headline">{personalInfo.name}</h1>
                    <h2 className="text-md font-semibold text-primary">{personalInfo.title}</h2>
                </header>

                <div className="space-y-4 text-sm">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-headline border-b border-slate-600 pb-1">Contact</h3>
                     <div className="flex items-center gap-2"><AtSign size={14} className="text-primary"/><span>{personalInfo.email}</span></div>
                    <div className="flex items-center gap-2"><Phone size={14} className="text-primary"/><span>{personalInfo.phone}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-primary"/><span>{personalInfo.location}</span></div>
                    {personalInfo.website && <div className="flex items-center gap-2"><Globe size={14} className="text-primary"/><span>{personalInfo.website}</span></div>}
                </div>

                <div className="space-y-4">
                     <h3 className="text-lg font-bold text-white uppercase tracking-wider font-headline border-b border-slate-600 pb-1">Skills</h3>
                     <div className="space-y-3">
                        {(skills || []).map(skill => (
                            <div key={skill.id} className="text-sm">
                                <p className="font-semibold mb-1">{skill.name}</p>
                                <Progress value={skillLevelToValue[skill.level]} className="h-2 bg-slate-700" />
                            </div>
                        ))}
                     </div>
                </div>

                <div className="space-y-4">
                     <h3 className="text-lg font-bold text-white uppercase tracking-wider font-headline border-b border-slate-600 pb-1">Education</h3>
                     <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id} className="text-sm">
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
                    <h3 className={templateStyles.sectionTitle}><Star className="inline-block mr-2 text-primary" size={18}/>Summary</h3>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </section>
                <Separator className="my-6 bg-slate-700" />
                <section>
                    <h3 className={templateStyles.sectionTitle}><Briefcase className="inline-block mr-2 text-primary" size={18}/>Experience</h3>
                    <div className="space-y-5">
                    {experience.map((exp) => (
                        <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-md text-slate-100 font-headline">{exp.role}</h4>
                            <p className="text-xs text-slate-400">{exp.date}</p>
                        </div>
                        <p className="text-sm italic text-slate-300 mb-2">{exp.company}</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed">
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
                <Separator className="my-6 bg-slate-700" />
                <section>
                    <h3 className={templateStyles.sectionTitle}><Code className="inline-block mr-2 text-primary" size={18}/>Projects</h3>
                    <div className="space-y-5">
                    {(projects || []).map((proj) => (
                        <div key={proj.id}>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-md text-slate-100 font-headline">{proj.name}</h4>
                            {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View Project</a>}
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed mt-1">
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
            </main>
        </div>
    )
}

export function ResumePreview({ resumeData, templateId = 'modern' }: ResumePreviewProps) {
  if (templateId === 'professional') {
      return <ProfessionalTemplatePreview resumeData={resumeData} />;
  }

  const { personalInfo, summary, experience, education, skills, projects } = resumeData;
  const templateStyles = templates[templateId] || templates.modern;


  return (
    <div className="bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full font-body">
      <header className={templateStyles.header}>
        <h1 className="text-4xl font-bold text-gray-900 font-headline">{personalInfo.name}</h1>
        <h2 className="text-xl font-semibold text-primary font-headline">{personalInfo.title}</h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5"><AtSign size={14} />{personalInfo.email}</div>
          <div className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</div>
          <div className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</div>
          {personalInfo.website && <div className="flex items-center gap-1.5"><Globe size={14} />{personalInfo.website}</div>}
        </div>
      </header>

      <Separator className="my-6" />

      <section>
        <h3 className={templateStyles.sectionTitle}>Summary</h3>
        <p className="text-sm leading-relaxed">{summary}</p>
      </section>

      <Separator className="my-6" />

      <section>
        <h3 className={templateStyles.sectionTitle}>Experience</h3>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-md font-headline">{exp.role}</h4>
                <p className="text-sm text-gray-600">{exp.date}</p>
              </div>
              <p className="text-sm italic text-gray-700 mb-1">{exp.company}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
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

      <Separator className="my-6" />

      <section>
        <h3 className={templateStyles.sectionTitle}>Projects</h3>
        <div className="space-y-4">
          {(projects || []).map((proj) => (
            <div key={proj.id}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-md font-headline">{proj.name}</h4>
                 {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View Project</a>}
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
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

      <Separator className="my-6" />

      <section>
        <h3 className={templateStyles.sectionTitle}>Skills</h3>
        <div className="flex flex-wrap gap-2">
            {(skills || []).map((skill, index) => (
                <Badge key={index} variant="secondary">{skill.name}</Badge>
            ))}
        </div>
      </section>
      
      <Separator className="my-6" />

      <section>
        <h3 className={templateStyles.sectionTitle}>Education</h3>
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

export function CoverLetterPreview({ resumeData, templateId = 'modern' }: ResumePreviewProps) {
  const { personalInfo, coverLetter, companyInfo } = resumeData;
  const templateStyles = templates[templateId] || templates.modern;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const renderHeader = () => (
    <header className={templateStyles.header}>
        <h1 className="text-4xl font-bold text-gray-900 font-headline">{personalInfo.name}</h1>
        <h2 className="text-xl font-semibold text-primary font-headline">{personalInfo.title}</h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5"><AtSign size={14} />{personalInfo.email}</div>
          <div className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</div>
          <div className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</div>
          {personalInfo.website && <div className="flex items-center gap-1.5"><Globe size={14} />{personalInfo.website}</div>}
        </div>
      </header>
  );

  const ProfessionalCoverLetter = () => (
     <div className="bg-slate-800 text-slate-300 shadow-2xl rounded-lg w-full h-full mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-hidden print:shadow-none print:rounded-none print:max-h-full font-body flex flex-col p-8">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white font-headline">{personalInfo.name}</h1>
            <h2 className="text-md font-semibold text-primary">{personalInfo.title}</h2>
        </header>
        <main className="text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
          <p>{date}</p>
          <p>Hiring Manager<br/>{companyInfo?.name}</p>
          <br/>
          <p>Dear Hiring Manager,</p>
          <p>{coverLetter}</p>
          <br/>
          <p>Sincerely,</p>
          <p>{personalInfo.name}</p>
        </main>
    </div>
  );

  if (templateId === 'professional') {
    return <ProfessionalCoverLetter />;
  }

  return (
     <div className="bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full font-body">
      {renderHeader()}
      <Separator className="my-6" />
      <main className="text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
          <p>{date}</p>
          <p>Hiring Manager<br/>{companyInfo?.name}</p>
          <br/>
          <p>Dear Hiring Manager,</p>
          <p>{coverLetter}</p>
          <br/>
          <p>Sincerely,</p>
          <p>{personalInfo.name}</p>
        </main>
    </div>
  )
}
