import React from 'react';
import type { ResumeData } from './types';

export function AtsSimulationPreview({ resumeData }: { resumeData: ResumeData }) {
  // Strip all CSS, colors, grids, etc. and present as raw parseable text
  return (
    <div className="bg-white text-black p-8 font-mono text-sm leading-relaxed max-w-[816px] mx-auto border border-gray-300 shadow-sm min-h-[1056px] whitespace-pre-wrap">
      <div className="mb-4 text-xs text-red-600 border-b border-red-200 pb-2 mb-8 font-sans">
        <strong>ATS SIMULATION MODE</strong> - This view strips all structural formatting, invisible elements, and visual CSS to simulate how a robotic Applicant Tracking System parses the raw text of your resume. Ensure headings and bullet points read logically here.
      </div>

      <div className="mb-6">
        {resumeData.personalInfo.name && <div className="uppercase font-bold text-lg">{resumeData.personalInfo.name}</div>}
        {resumeData.personalInfo.email && <div>Email: {resumeData.personalInfo.email}</div>}
        {resumeData.personalInfo.phone && <div>Phone: {resumeData.personalInfo.phone}</div>}
        {resumeData.personalInfo.location && <div>Location: {resumeData.personalInfo.location}</div>}
        {resumeData.personalInfo.website && <div>Website: {resumeData.personalInfo.website}</div>}
      </div>

      {resumeData.summary && (
        <div className="mb-6">
          <div className="font-bold border-b border-dashed border-gray-400 mb-2">SUMMARY</div>
          <div>{resumeData.summary}</div>
        </div>
      )}

      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="mb-6">
          <div className="font-bold border-b border-dashed border-gray-400 mb-2">EXPERIENCE</div>
          {resumeData.experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="font-semibold">{exp.company} - {exp.role}</div>
              <div>{exp.date}</div>
              <div className="mt-1">{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {resumeData.education && resumeData.education.length > 0 && (
        <div className="mb-6">
          <div className="font-bold border-b border-dashed border-gray-400 mb-2">EDUCATION</div>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="font-semibold">{edu.institution}</div>
              <div>{edu.degree}</div>
              {edu.date && <div>{edu.date}</div>}
            </div>
          ))}
        </div>
      )}

      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="mb-6">
          <div className="font-bold border-b border-dashed border-gray-400 mb-2">SKILLS</div>
          <div>{resumeData.skills.join(', ')}</div>
        </div>
      )}

      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="mb-6">
          <div className="font-bold border-b border-dashed border-gray-400 mb-2">PROJECTS</div>
          {resumeData.projects.map(proj => (
            <div key={proj.id} className="mb-4">
              <div className="font-semibold">{proj.name}</div>
              {proj.link && <div>Link: {proj.link}</div>}
              <div className="mt-1">{proj.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
