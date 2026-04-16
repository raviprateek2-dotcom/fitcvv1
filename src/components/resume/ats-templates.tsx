'use client';

import type { MasterResumeSchema } from '@/lib/resume-master-schema';
import type { ResumeTemplateVariantId } from '@/lib/resume-template-variants';
import { ATS_TEMPLATE_REGISTRY } from '@/lib/ats-template-registry';
import { cn } from '@/lib/utils';
import { ATS_PAGE_DIMENSIONS, ATS_TEMPLATE_CLASSNAMES } from '@/components/resume/ats-template-styles';

interface ResumeTemplateProps {
  resume: MasterResumeSchema;
  className?: string;
}

interface ConfigurableAtsTemplateProps extends ResumeTemplateProps {
  variantId: ResumeTemplateVariantId;
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className={ATS_TEMPLATE_CLASSNAMES.sectionTitle}>{children}</h2>;
}

function ResumeHeader({ resume }: { resume: MasterResumeSchema }) {
  const { personalInfo } = resume;
  const contact = [
    personalInfo.contact.phone,
    personalInfo.contact.email,
    personalInfo.contact.linkedin,
    personalInfo.contact.portfolio,
    personalInfo.contact.location,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <header className="mb-5">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">{personalInfo.name}</h1>
      <p className="mt-2 text-[11px] text-slate-700">{contact}</p>
    </header>
  );
}

function SummarySection({ title, content }: { title: string; content: string }) {
  return (
    <section className="space-y-2">
      <SectionTitle>{title}</SectionTitle>
      <p className={ATS_TEMPLATE_CLASSNAMES.paragraph}>{content}</p>
    </section>
  );
}

function SkillsSection({ groups }: { groups: MasterResumeSchema['skills'] }) {
  return (
    <section className="space-y-2">
      <SectionTitle>Skills</SectionTitle>
      <div className="space-y-1.5">
        {groups.map((group) => (
          <p key={group.category} className="text-[11px] leading-relaxed text-slate-800">
            <span className="font-semibold">{group.category}:</span> {group.items.join(', ')}
          </p>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ title, items }: { title: string; items: MasterResumeSchema['experience'] }) {
  return (
    <section className="space-y-2">
      <SectionTitle>{title}</SectionTitle>
      <div className="space-y-3">
        {items.map((item, index) => (
          <article key={`${item.company}-${item.role}-${index}`} className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[12px] font-semibold text-slate-900">
                {item.role} | {item.company}
              </h3>
              <p className="text-[10px] text-slate-600">
                {item.startDate} - {item.endDate}
              </p>
            </div>
            <p className="text-[10px] text-slate-600">{item.location}</p>
            <ul className="list-disc space-y-0.5 pl-5 text-[11px] leading-relaxed text-slate-800">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: MasterResumeSchema['projects'] }) {
  return (
    <section className="space-y-2">
      <SectionTitle>Projects</SectionTitle>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <article key={`${project.title}-${index}`} className="space-y-1">
            <h3 className="text-[12px] font-semibold text-slate-900">{project.title}</h3>
            <p className="text-[11px] leading-relaxed text-slate-800">{project.description}</p>
            <p className="text-[10px] text-slate-700">
              <span className="font-semibold">Tech Stack:</span> {project.techStack.join(', ')}
            </p>
            {project.link ? (
              <p className="text-[10px] text-slate-700">
                <span className="font-semibold">Link:</span> {project.link}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ education }: { education: MasterResumeSchema['education'] }) {
  return (
    <section className="space-y-2">
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-2">
        {education.map((item, index) => (
          <article key={`${item.institution}-${item.degree}-${index}`} className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-[12px] font-semibold text-slate-900">{item.degree}</h3>
              <p className="text-[11px] text-slate-800">{item.institution}</p>
              {item.score ? <p className="text-[10px] text-slate-700">Score: {item.score}</p> : null}
            </div>
            <p className="text-[10px] text-slate-600">{item.year}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection({ certifications }: { certifications?: MasterResumeSchema['certifications'] }) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="space-y-2">
      <SectionTitle>Certifications</SectionTitle>
      <ul className="list-disc space-y-1 pl-5 text-[11px] text-slate-800">
        {certifications.map((cert, index) => (
          <li key={`${cert.name}-${index}`}>
            <span className="font-medium">{cert.name}</span>
            {cert.issuer ? ` - ${cert.issuer}` : ''}
            {cert.year ? ` (${cert.year})` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ConfigurableAtsTemplate({ resume, className, variantId }: ConfigurableAtsTemplateProps) {
  const definition = ATS_TEMPLATE_REGISTRY[variantId];
  const variant = definition.config;
  const internships = resume.experience.filter((entry) => /(intern|internship|trainee)/i.test(entry.role));
  const experienceOnly = resume.experience.filter((entry) => !/(intern|internship|trainee)/i.test(entry.role));
  const selectedProjects = variant.maxProjects ? resume.projects.slice(0, variant.maxProjects) : resume.projects;

  return (
    <article className={cn(ATS_TEMPLATE_CLASSNAMES.shell, className)} style={ATS_PAGE_DIMENSIONS}>
      <ResumeHeader resume={resume} />

      <main className="space-y-4">
        {variant.sectionOrder.map((sectionKey) => {
          if ((sectionKey === 'summary' || sectionKey === 'career_objective') && resume.summary) {
            return <SummarySection key={sectionKey} title={definition.summaryTitle} content={resume.summary} />;
          }
          if (sectionKey === 'skills' && resume.skills.length > 0) {
            return <SkillsSection key={sectionKey} groups={resume.skills} />;
          }
          if (sectionKey === 'experience' && experienceOnly.length > 0) {
            return <ExperienceSection key={sectionKey} title="Experience" items={experienceOnly} />;
          }
          if (sectionKey === 'internships' && internships.length > 0) {
            return <ExperienceSection key={sectionKey} title="Internships" items={internships} />;
          }
          if (sectionKey === 'projects' && selectedProjects.length > 0) {
            return <ProjectsSection key={sectionKey} projects={selectedProjects} />;
          }
          if (sectionKey === 'education' && resume.education.length > 0) {
            return <EducationSection key={sectionKey} education={resume.education} />;
          }
          if (sectionKey === 'certifications') {
            return <CertificationsSection key={sectionKey} certifications={resume.certifications} />;
          }
          return null;
        })}
      </main>
    </article>
  );
}

export function AtsClassicTemplate({ resume, className }: ResumeTemplateProps) {
  return <ConfigurableAtsTemplate resume={resume} className={className} variantId="ats-classic" />;
}

export function FresherStudentTemplate({ resume, className }: ResumeTemplateProps) {
  return <ConfigurableAtsTemplate resume={resume} className={className} variantId="fresher-student" />;
}

export function ProfessionalTemplate({ resume, className }: ResumeTemplateProps) {
  return <ConfigurableAtsTemplate resume={resume} className={className} variantId="professional-2-5-years" />;
}

