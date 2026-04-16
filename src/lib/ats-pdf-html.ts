import type { MasterResumeSchema } from '@/lib/resume-master-schema';
import { ATS_TEMPLATE_REGISTRY } from '@/lib/ats-template-registry';
import type { ResumeTemplateVariantId } from '@/lib/resume-template-variants';

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sectionTitle(label: string): string {
  return `<h2>${escapeHtml(label)}</h2>`;
}

function summarySection(title: string, content: string): string {
  return `<section>${sectionTitle(title)}<p>${escapeHtml(content)}</p></section>`;
}

function skillsSection(resume: MasterResumeSchema): string {
  const lines = resume.skills
    .map((group) => `<p><strong>${escapeHtml(group.category)}:</strong> ${escapeHtml(group.items.join(', '))}</p>`)
    .join('');
  return `<section>${sectionTitle('Skills')}${lines}</section>`;
}

function experienceSection(title: string, items: MasterResumeSchema['experience']): string {
  const rows = items
    .map((item) => {
      const bullets = item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('');
      return `
        <article>
          <div class="row">
            <h3>${escapeHtml(item.role)} | ${escapeHtml(item.company)}</h3>
            <span>${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</span>
          </div>
          <p class="meta">${escapeHtml(item.location)}</p>
          <ul>${bullets}</ul>
        </article>
      `;
    })
    .join('');
  return `<section>${sectionTitle(title)}${rows}</section>`;
}

function projectsSection(resume: MasterResumeSchema, maxProjects?: number): string {
  const projects = maxProjects ? resume.projects.slice(0, maxProjects) : resume.projects;
  const rows = projects
    .map((project) => {
      const link = project.link ? `<p class="meta"><strong>Link:</strong> ${escapeHtml(project.link)}</p>` : '';
      return `
        <article>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <p class="meta"><strong>Tech Stack:</strong> ${escapeHtml(project.techStack.join(', '))}</p>
          ${link}
        </article>
      `;
    })
    .join('');
  return `<section>${sectionTitle('Projects')}${rows}</section>`;
}

function educationSection(resume: MasterResumeSchema): string {
  const rows = resume.education
    .map((item) => {
      const score = item.score ? `<p class="meta">Score: ${escapeHtml(item.score)}</p>` : '';
      return `
        <article>
          <div class="row">
            <div>
              <h3>${escapeHtml(item.degree)}</h3>
              <p>${escapeHtml(item.institution)}</p>
              ${score}
            </div>
            <span>${escapeHtml(item.year)}</span>
          </div>
        </article>
      `;
    })
    .join('');
  return `<section>${sectionTitle('Education')}${rows}</section>`;
}

function certificationsSection(resume: MasterResumeSchema): string {
  if (!resume.certifications || resume.certifications.length === 0) return '';
  const rows = resume.certifications
    .map((cert) => {
      const suffix = `${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.year ? ` (${cert.year})` : ''}`;
      return `<li><strong>${escapeHtml(cert.name)}</strong>${escapeHtml(suffix)}</li>`;
    })
    .join('');
  return `<section>${sectionTitle('Certifications')}<ul>${rows}</ul></section>`;
}

export function buildAtsResumeHtml(resume: MasterResumeSchema, variantId: ResumeTemplateVariantId): string {
  const variant = ATS_TEMPLATE_REGISTRY[variantId].config;
  const internships = resume.experience.filter((entry) => /(intern|internship|trainee)/i.test(entry.role));
  const experienceOnly = resume.experience.filter((entry) => !/(intern|internship|trainee)/i.test(entry.role));

  const sectionHtml = variant.sectionOrder
    .map((sectionKey) => {
      if (sectionKey === 'summary' && resume.summary) return summarySection('Professional Summary', resume.summary);
      if (sectionKey === 'career_objective' && resume.summary) return summarySection('Career Objective', resume.summary);
      if (sectionKey === 'skills' && resume.skills.length > 0) return skillsSection(resume);
      if (sectionKey === 'experience' && experienceOnly.length > 0) return experienceSection('Experience', experienceOnly);
      if (sectionKey === 'internships' && internships.length > 0) return experienceSection('Internships', internships);
      if (sectionKey === 'projects' && resume.projects.length > 0) return projectsSection(resume, variant.maxProjects);
      if (sectionKey === 'education' && resume.education.length > 0) return educationSection(resume);
      if (sectionKey === 'certifications') return certificationsSection(resume);
      return '';
    })
    .join('');

  const contact = [
    resume.personalInfo.contact.phone,
    resume.personalInfo.contact.email,
    resume.personalInfo.contact.linkedin,
    resume.personalInfo.contact.portfolio,
    resume.personalInfo.contact.location,
  ]
    .filter(Boolean)
    .map((value) => escapeHtml(value as string))
    .join(' | ');

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(resume.personalInfo.name)} - Resume</title>
    <style>
      @page { size: A4; margin: 12mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Arial", "Helvetica", sans-serif;
        color: #0f172a;
        background: #ffffff;
        line-height: 1.35;
        font-size: 11px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        width: 100%;
      }
      header { margin-bottom: 14px; }
      h1 {
        margin: 0;
        font-size: 30px;
        line-height: 1.1;
        font-weight: 700;
        word-break: break-word;
      }
      header .contact {
        margin-top: 8px;
        color: #334155;
        word-break: break-word;
      }
      main { display: block; }
      section { margin-bottom: 12px; page-break-inside: avoid; }
      h2 {
        margin: 0 0 6px;
        border-bottom: 1px solid #cbd5e1;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #1e293b;
        padding-bottom: 2px;
      }
      h3 {
        margin: 0;
        font-size: 12px;
        font-weight: 700;
        color: #0f172a;
        word-break: break-word;
      }
      p {
        margin: 0 0 4px;
        word-break: break-word;
      }
      .meta {
        color: #475569;
        font-size: 10px;
      }
      .row {
        display: flex;
        gap: 10px;
        justify-content: space-between;
        align-items: baseline;
      }
      .row > span {
        white-space: nowrap;
        color: #475569;
        font-size: 10px;
      }
      article { margin-bottom: 8px; }
      ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      li {
        margin-bottom: 2px;
        word-break: break-word;
      }
    </style>
  </head>
  <body>
    <article class="page">
      <header>
        <h1>${escapeHtml(resume.personalInfo.name)}</h1>
        <p class="contact">${contact}</p>
      </header>
      <main>${sectionHtml}</main>
    </article>
  </body>
</html>
`;
}

