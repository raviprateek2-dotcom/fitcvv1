import { validateResumeTemplateBeforeDownload } from '../resume-template-validation';
import type { MasterResumeSchema } from '../resume-master-schema';

const baseResume: MasterResumeSchema = {
  personalInfo: {
    name: 'Alex Johnson',
    contact: {
      phone: '+91 9876543210',
      email: 'alex@example.com',
      linkedin: 'linkedin.com/in/alex-johnson',
      portfolio: 'alex.dev',
      location: 'Bengaluru, India',
    },
  },
  summary: 'Software engineer focused on scalable backend systems and measurable delivery impact.',
  skills: [
    { category: 'Technical', items: ['TypeScript', 'Node.js', 'PostgreSQL'] },
    { category: 'Tools', items: ['Docker', 'GitHub Actions'] },
  ],
  experience: [
    {
      company: 'Apex Labs',
      role: 'Software Engineer',
      location: 'Bengaluru',
      startDate: '2022',
      endDate: 'Present',
      bullets: ['Improved API latency by 35% by optimizing query plans and cache strategy'],
    },
  ],
  education: [{ degree: 'B.Tech Computer Science', institution: 'VTU', year: '2022' }],
  projects: [
    {
      title: 'Order Platform Rewrite',
      description: 'Built event-driven order processing pipeline with idempotent workers.',
      techStack: ['TypeScript', 'Kafka', 'PostgreSQL'],
      link: 'https://github.com/example/order-platform',
    },
  ],
  certifications: [{ name: 'AWS Developer Associate', year: '2023' }],
};

describe('resume template validation engine', () => {
  it('passes a complete ATS classic resume', () => {
    const result = validateResumeTemplateBeforeDownload(baseResume, 'ats-classic');
    expect(result.canDownload).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('blocks download when required section is missing', () => {
    const invalid: MasterResumeSchema = { ...baseResume, projects: [] };
    const result = validateResumeTemplateBeforeDownload(invalid, 'ats-classic');
    expect(result.canDownload).toBe(false);
    expect(result.errors.some((item) => item.code === 'projects_missing')).toBe(true);
  });

  it('returns weak bullet warnings without blocking valid structure', () => {
    const weakBulletResume: MasterResumeSchema = {
      ...baseResume,
      experience: [
        {
          ...baseResume.experience[0],
          bullets: ['Worked on backend services'],
        },
      ],
    };
    const result = validateResumeTemplateBeforeDownload(weakBulletResume, 'professional-2-5-years');
    expect(result.canDownload).toBe(true);
    expect(result.warnings.some((item) => item.category === 'weak_bullet')).toBe(true);
  });
});

