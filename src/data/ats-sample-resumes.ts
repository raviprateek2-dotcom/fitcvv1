import type { MasterResumeSchema } from '@/lib/resume-master-schema';
import type { ResumeTemplateVariantId } from '@/lib/resume-template-variants';

export interface AtsSampleResume {
  id: string;
  roleLabel: string;
  recommendedVariant: ResumeTemplateVariantId;
  resume: MasterResumeSchema;
}

export const atsSampleResumes: AtsSampleResume[] = [
  {
    id: 'software-engineer-fresher',
    roleLabel: 'Software Engineer (Fresher)',
    recommendedVariant: 'fresher-student',
    resume: {
      personalInfo: {
        name: 'Rohan Mehta',
        contact: {
          phone: '+91 98765 11001',
          email: 'rohan.mehta.dev@gmail.com',
          linkedin: 'linkedin.com/in/rohanmehta-dev',
          portfolio: 'rohanmehta.dev',
          location: 'Pune, India',
        },
      },
      summary:
        'Entry-level software engineer with strong fundamentals in data structures and backend systems. Built production-like full-stack projects and shipped features through internships with measurable user impact.',
      skills: [
        { category: 'Technical', items: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'PostgreSQL'] },
        { category: 'Tools', items: ['Git', 'Docker', 'Postman', 'Jest', 'GitHub Actions'] },
        { category: 'Soft Skills', items: ['Problem Solving', 'Communication', 'Ownership'] },
      ],
      experience: [
        {
          company: 'CodeSprout Labs',
          role: 'Software Engineering Intern',
          location: 'Remote',
          startDate: 'Jan 2025',
          endDate: 'Jun 2025',
          bullets: [
            'Built role-based API middleware using Node.js and reduced authorization bugs by 42% across staging releases',
            'Improved endpoint response time by 31% by indexing PostgreSQL query paths and batching expensive lookups',
            'Automated regression test runs using GitHub Actions and increased PR merge confidence for a 6-member team',
          ],
        },
      ],
      education: [
        {
          degree: 'B.E. Computer Engineering',
          institution: 'Pune Institute of Technology',
          year: '2025',
          score: 'CGPA: 8.7/10',
        },
      ],
      projects: [
        {
          title: 'Campus Placement Tracker',
          description: 'Developed a placement management platform for 1,200+ students to track applications, rounds, and outcomes.',
          techStack: ['React', 'Node.js', 'PostgreSQL', 'Express'],
          link: 'https://github.com/rohanmehta/placement-tracker',
        },
        {
          title: 'Real-time Collaborative Notes',
          description: 'Built collaborative editing with conflict-safe updates and sub-second syncing for shared note sessions.',
          techStack: ['TypeScript', 'Socket.IO', 'Redis', 'Next.js'],
        },
      ],
      certifications: [{ name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' }],
    },
  },
  {
    id: 'mba-finance-analyst',
    roleLabel: 'MBA Finance Analyst',
    recommendedVariant: 'ats-classic',
    resume: {
      personalInfo: {
        name: 'Ananya Kulkarni',
        contact: {
          phone: '+91 99220 30011',
          email: 'ananya.kulkarni.finance@gmail.com',
          linkedin: 'linkedin.com/in/ananyakulkarni-finance',
          location: 'Mumbai, India',
        },
      },
      summary:
        'MBA Finance candidate with internship experience in valuation, budgeting, and MIS reporting. Skilled at translating financial data into recommendations that improve profitability and decision speed.',
      skills: [
        { category: 'Technical', items: ['Financial Modeling', 'DCF Valuation', 'Ratio Analysis', 'Forecasting'] },
        { category: 'Tools', items: ['Excel', 'Power BI', 'Tally', 'SQL'] },
        { category: 'Domain', items: ['Corporate Finance', 'FP&A', 'Investment Analysis'] },
      ],
      experience: [
        {
          company: 'Vertex Capital Advisors',
          role: 'Finance Intern',
          location: 'Mumbai',
          startDate: 'Apr 2025',
          endDate: 'Jul 2025',
          bullets: [
            'Built a 5-year revenue and margin forecast model that improved scenario planning speed by 45% for client reviews',
            'Analyzed monthly variance reports and identified cost leakages worth ₹18L annually through category-level diagnostics',
            'Prepared investor-ready dashboards using Power BI and reduced reporting turnaround time from 3 days to 1 day',
          ],
        },
      ],
      education: [
        { degree: 'MBA, Finance', institution: 'NMIMS School of Business Management', year: '2026' },
        { degree: 'B.Com', institution: 'St. Xavier’s College, Mumbai', year: '2023', score: '8.9/10' },
      ],
      projects: [
        {
          title: 'Sector-wise Portfolio Backtesting',
          description: 'Evaluated risk-adjusted returns of sector-based portfolios over 8 years using drawdown and Sharpe metrics.',
          techStack: ['Excel', 'Python', 'Pandas'],
        },
      ],
      certifications: [{ name: 'NISM Equity Derivatives', issuer: 'NISM', year: '2024' }],
    },
  },
  {
    id: 'marketing-executive-growth',
    roleLabel: 'Marketing Executive',
    recommendedVariant: 'professional-2-5-years',
    resume: {
      personalInfo: {
        name: 'Sneha Bhatia',
        contact: {
          phone: '+91 98100 44012',
          email: 'sneha.bhatia.marketing@gmail.com',
          linkedin: 'linkedin.com/in/snehabhatia-growth',
          portfolio: 'snehabhatia.notion.site/marketing',
          location: 'Gurugram, India',
        },
      },
      summary:
        'Performance-focused marketing executive with 3+ years of experience in paid campaigns, funnels, and lifecycle communication. Consistently improves CAC efficiency while scaling qualified lead volume.',
      skills: [
        { category: 'Technical', items: ['Performance Marketing', 'Funnel Optimization', 'Email Automation'] },
        { category: 'Tools', items: ['Meta Ads', 'Google Ads', 'GA4', 'HubSpot', 'Canva'] },
        { category: 'Soft Skills', items: ['Experimentation', 'Storytelling', 'Cross-team Collaboration'] },
      ],
      experience: [
        {
          company: 'ScaleMint Commerce',
          role: 'Marketing Executive',
          location: 'Gurugram',
          startDate: 'Feb 2023',
          endDate: 'Present',
          bullets: [
            'Increased qualified lead volume by 52% by restructuring campaign audiences and introducing intent-based ad sets',
            'Reduced CAC by 28% by optimizing funnel drop-offs and reallocating spend toward high-conversion cohorts',
            'Launched lifecycle email journeys that improved trial-to-paid conversion by 19% across 3 product lines',
          ],
        },
      ],
      education: [{ degree: 'BBA, Marketing', institution: 'Amity University', year: '2022' }],
      projects: [
        {
          title: 'D2C Product Launch GTM',
          description: 'Designed a 6-week go-to-market campaign that delivered 11,000 sign-ups and 2.8x return on ad spend.',
          techStack: ['Google Ads', 'Meta Ads', 'GA4', 'HubSpot'],
        },
      ],
      certifications: [{ name: 'Google Ads Search Certification', issuer: 'Google', year: '2024' }],
    },
  },
  {
    id: 'product-manager-associate',
    roleLabel: 'Associate Product Manager',
    recommendedVariant: 'professional-2-5-years',
    resume: {
      personalInfo: {
        name: 'Harsh Vardhan',
        contact: {
          phone: '+91 98210 77023',
          email: 'harsh.vardhan.pm@gmail.com',
          linkedin: 'linkedin.com/in/harshvardhan-pm',
          location: 'Bengaluru, India',
        },
      },
      summary:
        'Associate product manager with experience owning roadmap slices, experimentation, and user journey improvements in SaaS products. Delivers measurable growth through discovery-led execution.',
      skills: [
        { category: 'Technical', items: ['Product Discovery', 'PRD Writing', 'A/B Testing', 'SQL'] },
        { category: 'Tools', items: ['Mixpanel', 'Jira', 'Notion', 'Figma'] },
        { category: 'Soft Skills', items: ['Stakeholder Management', 'Prioritization', 'User Empathy'] },
      ],
      experience: [
        {
          company: 'NimbusHR',
          role: 'Associate Product Manager',
          location: 'Bengaluru',
          startDate: 'Jul 2022',
          endDate: 'Present',
          bullets: [
            'Improved onboarding completion by 24% by redesigning setup steps and shipping in-product guidance experiments',
            'Reduced support tickets by 33% by prioritizing high-friction workflow fixes from call and session analysis',
            'Delivered payroll approval revamp with engineering and design, cutting processing time by 38% for enterprise accounts',
          ],
        },
      ],
      education: [{ degree: 'B.Tech Information Technology', institution: 'NIT Jaipur', year: '2022' }],
      projects: [
        {
          title: 'Self-serve Reporting Module',
          description: 'Scoped and shipped configurable report builder that increased monthly active admin usage by 17%.',
          techStack: ['Mixpanel', 'SQL', 'React'],
        },
      ],
      certifications: [],
    },
  },
  {
    id: 'data-analyst-business',
    roleLabel: 'Data Analyst',
    recommendedVariant: 'ats-classic',
    resume: {
      personalInfo: {
        name: 'Priyank Shah',
        contact: {
          phone: '+91 99001 22456',
          email: 'priyank.shah.data@gmail.com',
          linkedin: 'linkedin.com/in/priyankshah-data',
          location: 'Hyderabad, India',
        },
      },
      summary:
        'Data analyst with strong SQL and dashboarding capabilities, focused on turning raw operational data into actionable business insights for revenue and retention teams.',
      skills: [
        { category: 'Technical', items: ['SQL', 'Python', 'Data Cleaning', 'Cohort Analysis'] },
        { category: 'Tools', items: ['Power BI', 'Looker Studio', 'Excel'] },
        { category: 'Domain', items: ['SaaS Analytics', 'Retention', 'Forecasting'] },
      ],
      experience: [
        {
          company: 'CloudLedger',
          role: 'Data Analyst',
          location: 'Hyderabad',
          startDate: 'Aug 2021',
          endDate: 'Present',
          bullets: [
            'Built executive KPI dashboards in Power BI and reduced monthly reporting effort by 16 analyst-hours',
            'Improved churn prediction precision by 21% by engineering behavior-based features from product usage logs',
            'Created weekly anomaly alerts using SQL checks that cut revenue leakage detection time from 5 days to 1 day',
          ],
        },
      ],
      education: [{ degree: 'B.Sc. Statistics', institution: 'Loyola College', year: '2021' }],
      projects: [
        {
          title: 'Subscription Churn Deep Dive',
          description: 'Analyzed 18-month subscription data to identify leading churn signals and retention opportunities.',
          techStack: ['SQL', 'Python', 'Power BI'],
        },
      ],
      certifications: [{ name: 'Microsoft Power BI Data Analyst', issuer: 'Microsoft', year: '2023' }],
    },
  },
  {
    id: 'hr-generalist',
    roleLabel: 'HR Generalist',
    recommendedVariant: 'ats-classic',
    resume: {
      personalInfo: {
        name: 'Kritika Arora',
        contact: {
          phone: '+91 98980 66221',
          email: 'kritika.arora.hr@gmail.com',
          linkedin: 'linkedin.com/in/kritikaarora-hr',
          location: 'Noida, India',
        },
      },
      summary:
        'HR generalist with 4 years of experience in hiring, onboarding, policy implementation, and employee engagement for fast-scaling teams.',
      skills: [
        { category: 'Technical', items: ['Talent Acquisition', 'Employee Relations', 'Policy Management'] },
        { category: 'Tools', items: ['Zoho Recruit', 'Keka', 'MS Excel'] },
        { category: 'Soft Skills', items: ['Conflict Resolution', 'Communication', 'Confidentiality'] },
      ],
      experience: [
        {
          company: 'Vertex Digital',
          role: 'HR Generalist',
          location: 'Noida',
          startDate: 'Jun 2021',
          endDate: 'Present',
          bullets: [
            'Reduced average time-to-hire by 26% by redesigning interview coordination and recruiter handoff workflows',
            'Improved first-90-day retention by 18% by launching structured onboarding and manager check-in cadences',
            'Led annual policy refresh across 6 departments and increased compliance completion rates to 98%',
          ],
        },
      ],
      education: [{ degree: 'MBA Human Resources', institution: 'IMT Ghaziabad', year: '2021' }],
      projects: [
        {
          title: 'Employee Engagement Pulse Program',
          description: 'Implemented monthly pulse survey workflow and action tracker to improve engagement visibility.',
          techStack: ['Google Forms', 'Excel', 'Keka'],
        },
      ],
      certifications: [{ name: 'SHRM Essentials of HR Management', issuer: 'SHRM', year: '2022' }],
    },
  },
  {
    id: 'sales-account-executive',
    roleLabel: 'Sales Account Executive',
    recommendedVariant: 'professional-2-5-years',
    resume: {
      personalInfo: {
        name: 'Nikhil Verma',
        contact: {
          phone: '+91 99871 44500',
          email: 'nikhil.verma.sales@gmail.com',
          linkedin: 'linkedin.com/in/nikhilverma-sales',
          location: 'Delhi, India',
        },
      },
      summary:
        'Results-driven account executive with consistent quota achievement across B2B SaaS and consultative sales cycles. Strong at pipeline hygiene, objection handling, and deal progression.',
      skills: [
        { category: 'Technical', items: ['Prospecting', 'Discovery', 'Negotiation', 'Pipeline Management'] },
        { category: 'Tools', items: ['HubSpot CRM', 'Apollo', 'LinkedIn Sales Navigator'] },
        { category: 'Soft Skills', items: ['Relationship Building', 'Communication', 'Resilience'] },
      ],
      experience: [
        {
          company: 'FlowOps SaaS',
          role: 'Account Executive',
          location: 'Delhi',
          startDate: 'May 2022',
          endDate: 'Present',
          bullets: [
            'Exceeded quarterly revenue quota by 118% by improving outbound sequencing and qualification discipline',
            'Increased average deal size by 23% by introducing multi-stakeholder value mapping in enterprise pitches',
            'Reduced sales cycle length by 17 days by standardizing proposal-to-closure follow-up workflows',
          ],
        },
      ],
      education: [{ degree: 'BBA', institution: 'Christ University', year: '2021' }],
      projects: [
        {
          title: 'Win-Loss Analysis Program',
          description: 'Created structured win-loss feedback loop and messaging updates for high-intent verticals.',
          techStack: ['HubSpot', 'Excel', 'Gong'],
        },
      ],
      certifications: [],
    },
  },
  {
    id: 'ui-ux-designer',
    roleLabel: 'UI/UX Designer',
    recommendedVariant: 'professional-2-5-years',
    resume: {
      personalInfo: {
        name: 'Megha Iyer',
        contact: {
          phone: '+91 90040 10078',
          email: 'megha.iyer.design@gmail.com',
          linkedin: 'linkedin.com/in/meghaiyer-design',
          portfolio: 'meghaiyer.design',
          location: 'Chennai, India',
        },
      },
      summary:
        'UI/UX designer with 3 years of experience creating user-centered flows for web and mobile products. Balances design quality with measurable business outcomes.',
      skills: [
        { category: 'Technical', items: ['User Research', 'Wireframing', 'Interaction Design', 'Design Systems'] },
        { category: 'Tools', items: ['Figma', 'FigJam', 'Miro', 'Maze'] },
        { category: 'Soft Skills', items: ['Collaboration', 'Storytelling', 'Feedback Integration'] },
      ],
      experience: [
        {
          company: 'PaySprint',
          role: 'UI/UX Designer',
          location: 'Chennai',
          startDate: 'Apr 2022',
          endDate: 'Present',
          bullets: [
            'Improved checkout completion by 29% by simplifying payment flow steps and reducing visual clutter',
            'Reduced design-to-dev handoff rework by 36% by building a reusable Figma component library',
            'Increased feature adoption by 22% by validating prototype alternatives with moderated user testing',
          ],
        },
      ],
      education: [{ degree: 'B.Des Communication Design', institution: 'Srishti Institute', year: '2021' }],
      projects: [
        {
          title: 'Mobile Banking UX Redesign',
          description: 'Redesigned transfer and bill-pay journeys with accessibility-friendly interactions and microcopy.',
          techStack: ['Figma', 'Maze', 'FigJam'],
        },
      ],
      certifications: [{ name: 'Google UX Design Certificate', issuer: 'Google', year: '2023' }],
    },
  },
  {
    id: 'operations-manager',
    roleLabel: 'Operations Manager',
    recommendedVariant: 'ats-classic',
    resume: {
      personalInfo: {
        name: 'Rahul Nanda',
        contact: {
          phone: '+91 98111 33445',
          email: 'rahul.nanda.ops@gmail.com',
          linkedin: 'linkedin.com/in/rahulnanda-operations',
          location: 'Ahmedabad, India',
        },
      },
      summary:
        'Operations manager with 5+ years of experience improving process reliability, service SLAs, and cross-functional execution in high-volume environments.',
      skills: [
        { category: 'Technical', items: ['Process Optimization', 'SLA Management', 'Vendor Coordination'] },
        { category: 'Tools', items: ['Excel', 'Power BI', 'ERP', 'Asana'] },
        { category: 'Domain', items: ['Logistics', 'Service Operations', 'Quality Control'] },
      ],
      experience: [
        {
          company: 'RapidRoute Logistics',
          role: 'Operations Manager',
          location: 'Ahmedabad',
          startDate: 'Jan 2020',
          endDate: 'Present',
          bullets: [
            'Improved on-time delivery SLA from 89% to 96% by redesigning routing and dispatch escalation workflows',
            'Reduced order processing cost by 18% by consolidating vendor contracts and automating shipment reconciliation',
            'Cut repeat quality incidents by 41% by implementing root-cause tracking and weekly corrective action reviews',
          ],
        },
      ],
      education: [{ degree: 'MBA Operations', institution: 'Nirma University', year: '2019' }],
      projects: [
        {
          title: 'City-Level Dispatch Optimization',
          description: 'Designed city cluster strategy that improved fleet utilization and reduced idle time across 4 zones.',
          techStack: ['Excel', 'Power BI', 'ERP'],
        },
      ],
      certifications: [],
    },
  },
  {
    id: 'financial-planning-analyst',
    roleLabel: 'Financial Planning Analyst',
    recommendedVariant: 'professional-2-5-years',
    resume: {
      personalInfo: {
        name: 'Ishita Rao',
        contact: {
          phone: '+91 99588 22109',
          email: 'ishita.rao.fpna@gmail.com',
          linkedin: 'linkedin.com/in/ishitarao-fpna',
          location: 'Bengaluru, India',
        },
      },
      summary:
        'FP&A analyst with 4 years of experience in budgeting, variance analysis, and executive reporting. Partners with business leaders to improve forecasting accuracy and cost discipline.',
      skills: [
        { category: 'Technical', items: ['Budgeting', 'Forecasting', 'Variance Analysis', 'Financial Reporting'] },
        { category: 'Tools', items: ['Excel', 'Power BI', 'SAP'] },
        { category: 'Domain', items: ['SaaS Finance', 'Unit Economics', 'Business Partnering'] },
      ],
      experience: [
        {
          company: 'OrbitCloud',
          role: 'FP&A Analyst',
          location: 'Bengaluru',
          startDate: 'Mar 2021',
          endDate: 'Present',
          bullets: [
            'Improved quarterly forecast accuracy from 82% to 93% by introducing driver-based planning across business units',
            'Identified spend optimization opportunities worth ₹2.4Cr annually through detailed variance and contract analysis',
            'Reduced board reporting cycle by 40% by automating data consolidation and dashboard refresh workflows',
          ],
        },
      ],
      education: [{ degree: 'M.Com Finance', institution: 'Christ University', year: '2020' }],
      projects: [
        {
          title: 'Unit Economics Dashboard',
          description: 'Built margin and CAC payback dashboard for leadership reviews and scenario planning.',
          techStack: ['Excel', 'Power BI', 'SAP'],
        },
      ],
      certifications: [{ name: 'FMVA', issuer: 'CFI', year: '2022' }],
    },
  },
];

export const atsSampleResumesById = Object.fromEntries(atsSampleResumes.map((item) => [item.id, item])) as Record<
  string,
  AtsSampleResume
>;

