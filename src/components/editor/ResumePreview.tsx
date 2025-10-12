
'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import React from 'react';

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

type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  jobDescription?: string;
};

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white text-gray-800 shadow-2xl rounded-lg w-full h-full p-8 mx-auto aspect-[8.5/11] max-w-[816px] max-h-[1056px] overflow-auto print:shadow-none print:rounded-none print:max-h-full font-body">
      <header className="text-center mb-6">
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
        <h3 className="text-lg font-bold text-primary mb-2 uppercase tracking-wider font-headline">Summary</h3>
        <p className="text-sm leading-relaxed">{summary}</p>
      </section>

      <Separator className="my-6" />

      <section>
        <h3 className="text-lg font-bold text-primary mb-3 uppercase tracking-wider font-headline">Experience</h3>
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
                    // Strip leading hyphens or asterisks, which are common for bullet points
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
        <h3 className="text-lg font-bold text-primary mb-3 uppercase tracking-wider font-headline">Skills</h3>
        <div className="flex flex-wrap gap-2">
            {skillList.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
        </div>
      </section>
      
      <Separator className="my-6" />

      <section>
        <h3 className="text-lg font-bold text-primary mb-3 uppercase tracking-wider font-headline">Education</h3>
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
