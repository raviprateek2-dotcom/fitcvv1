'use client';

import { useEffect } from 'react';
import type { ResumeTemplate } from '@/data/resumeTemplates';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  template: ResumeTemplate;
  scale?: number;
  className?: string;
}

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const fontCache = new Set<string>();

function ensureGoogleFont(fontName: string): void {
  if (typeof document === 'undefined') return;
  const normalized = fontName.trim().replace(/\s+/g, ' ');
  if (!normalized || fontCache.has(normalized)) return;
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(normalized).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  fontCache.add(normalized);
}

function ResumeSections({ template, sidebar }: { template: ResumeTemplate; sidebar?: boolean }) {
  const { sampleData, accentColor } = template;
  return (
    <div className={cn('space-y-4', sidebar && 'space-y-3')}>
      {template.sections.map((section) => {
        const heading = (
          <h3 className="mb-2 border-b pb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: accentColor, borderColor: `${accentColor}55` }}>
            {section.label}
          </h3>
        );

        if (section.id === 'summary') return <section key={section.id}>{heading}<p className="text-[11px] leading-relaxed text-slate-700">{sampleData.summary}</p></section>;
        if (section.id === 'experience')
          return (
            <section key={section.id}>
              {heading}
              <div className="space-y-2.5">
                {sampleData.experience.map((exp, idx) => (
                  <article key={`${exp.company}-${idx}`}>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[11px] font-semibold text-slate-900">{exp.role}</h4>
                      <span className="text-[10px] text-slate-500">{exp.duration}</span>
                    </div>
                    <p className="text-[10px] text-slate-600">{exp.company}</p>
                    <ul className="mt-1 list-disc pl-4 text-[10px] text-slate-700">
                      {exp.highlights.map((line, lineIndex) => <li key={`${line}-${lineIndex}`}>{line}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          );
        if (section.id === 'education')
          return (
            <section key={section.id}>
              {heading}
              <div className="space-y-2 text-[10px]">
                {sampleData.education.map((edu, idx) => (
                  <article key={`${edu.institution}-${idx}`}>
                    <p className="font-semibold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600">{edu.institution}</p>
                    <p className="text-slate-500">{edu.duration}</p>
                  </article>
                ))}
              </div>
            </section>
          );
        if (section.id === 'skills')
          return (
            <section key={section.id}>
              {heading}
              <div className="flex flex-wrap gap-1.5">
                {sampleData.skills.map((skill) => (
                  <span key={skill} className="rounded border px-2 py-0.5 text-[10px] text-slate-700" style={{ borderColor: `${accentColor}55` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          );
        return sampleData.achievements?.length ? (
          <section key={section.id}>
            {heading}
            <ul className="list-disc pl-4 text-[10px] text-slate-700">
              {sampleData.achievements.map((item, idx) => <li key={`${item}-${idx}`}>{item}</li>)}
            </ul>
          </section>
        ) : null;
      })}
    </div>
  );
}

export function ResumePreview({ template, scale = 1, className }: ResumePreviewProps) {
  useEffect(() => {
    ensureGoogleFont(template.fontPair.heading);
    ensureGoogleFont(template.fontPair.body);
  }, [template.fontPair.body, template.fontPair.heading]);

  const docStyle = {
    width: `${A4_WIDTH}px`,
    height: `${A4_HEIGHT}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    fontFamily: `"${template.fontPair.body}", system-ui, sans-serif`,
  } as const;

  const header = (
    <header className="mb-5 border-b pb-3" style={{ borderColor: `${template.accentColor}66` }}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900" style={{ fontFamily: `"${template.fontPair.heading}", system-ui, sans-serif` }}>
        {template.sampleData.name}
      </h2>
      <p className="text-sm font-medium" style={{ color: template.accentColor }}>{template.sampleData.title}</p>
      <p className="mt-2 text-[11px] text-slate-600">
        {template.sampleData.email} | {template.sampleData.phone} | {template.sampleData.location}
      </p>
    </header>
  );

  return (
    <div className={cn('relative overflow-hidden rounded-xl border bg-white shadow-sm', className)}>
      <div
        style={docStyle}
        className="origin-top-left p-8 text-slate-900 print:scale-100 print:rounded-none print:shadow-none"
        data-resume-template-id={template.id}
      >
        {template.layout === 'single-column' && (
          <div>
            {header}
            <ResumeSections template={template} />
          </div>
        )}

        {template.layout === 'two-column' && (
          <div>
            {header}
            <div className="grid grid-cols-[1.8fr_1fr] gap-6">
              <ResumeSections template={template} />
              <ResumeSections template={template} sidebar />
            </div>
          </div>
        )}

        {(template.layout === 'sidebar-left' || template.layout === 'sidebar-right') && (
          <div className={cn('grid h-full gap-0', template.layout === 'sidebar-left' ? 'grid-cols-[1fr_2.3fr]' : 'grid-cols-[2.3fr_1fr]')}>
            <aside className={cn('p-5 text-white', template.layout === 'sidebar-left' ? 'order-1' : 'order-2')} style={{ backgroundColor: template.accentColor }}>
              <h2 className="text-xl font-bold" style={{ fontFamily: `"${template.fontPair.heading}", system-ui, sans-serif` }}>{template.sampleData.name}</h2>
              <p className="text-xs opacity-90">{template.sampleData.title}</p>
              <div className="mt-4 space-y-1 text-[10px] opacity-95">
                <p>{template.sampleData.email}</p>
                <p>{template.sampleData.phone}</p>
                <p>{template.sampleData.location}</p>
              </div>
              <div className="mt-4">
                <ResumeSections template={template} sidebar />
              </div>
            </aside>
            <main className={cn('p-6', template.layout === 'sidebar-left' ? 'order-2' : 'order-1')}>
              <section className="mb-4">
                <h3 className="mb-2 border-b pb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: template.accentColor, borderColor: `${template.accentColor}55` }}>
                  Professional Summary
                </h3>
                <p className="text-[11px] text-slate-700">{template.sampleData.summary}</p>
              </section>
              <ResumeSections template={template} />
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

