export type ProfessionCategory =
  | 'Technology & Engineering'
  | 'Business & Finance'
  | 'Healthcare & Medicine'
  | 'Creative & Design'
  | 'Sales & Marketing'
  | 'Education & Research'
  | 'Legal & Compliance'
  | 'Operations & Supply Chain'
  | 'Human Resources'
  | 'Automotive & Manufacturing'
  | 'Data & Analytics'
  | 'Hospitality & Retail'
  | 'Media & Communications'
  | 'Government & Public Sector'
  | 'Startups & Entrepreneurship';

export type TemplateStyle =
  | 'Modern'
  | 'Classic'
  | 'Minimalist'
  | 'Executive'
  | 'Creative'
  | 'Technical'
  | 'Elegant'
  | 'Bold'
  | 'Clean'
  | 'Professional';

export type ColorScheme =
  | 'Navy'
  | 'Teal'
  | 'Slate'
  | 'Charcoal'
  | 'Forest'
  | 'Burgundy'
  | 'Midnight'
  | 'Warm'
  | 'Monochrome'
  | 'Vibrant';

export interface ResumeSection {
  id: string;
  label: string;
  required: boolean;
  order: number;
}

export interface ResumeSampleData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: { role: string; company: string; duration: string; highlights: string[] }[];
  education: { degree: string; institution: string; duration: string }[];
  skills: string[];
  achievements?: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: ProfessionCategory;
  subcategory: string;
  style: TemplateStyle;
  colorScheme: ColorScheme;
  atsScore: number;
  tags: string[];
  sections: ResumeSection[];
  sampleData: ResumeSampleData;
  accentColor: string;
  fontPair: {
    heading: string;
    body: string;
  };
  layout: 'single-column' | 'two-column' | 'sidebar-left' | 'sidebar-right';
  description: string;
  bestFor: string;
}

const BASE_SECTIONS: ResumeSection[] = [
  { id: 'summary', label: 'Professional Summary', required: true, order: 1 },
  { id: 'experience', label: 'Work Experience', required: true, order: 2 },
  { id: 'education', label: 'Education', required: true, order: 3 },
  { id: 'skills', label: 'Skills', required: true, order: 4 },
  { id: 'achievements', label: 'Achievements', required: false, order: 5 },
];

const ACCENTS = ['#1D4ED8', '#0F766E', '#334155', '#1F2937', '#14532D', '#7F1D1D', '#312E81', '#A16207', '#111827', '#9333EA'];
const FONT_PAIRS = [
  { heading: 'DM Sans', body: 'Inter' },
  { heading: 'Montserrat', body: 'Lora' },
  { heading: 'Poppins', body: 'Source Sans 3' },
  { heading: 'Manrope', body: 'Inter' },
  { heading: 'Merriweather', body: 'Work Sans' },
];
const SCHEMES: ColorScheme[] = ['Navy', 'Teal', 'Slate', 'Charcoal', 'Forest', 'Burgundy', 'Midnight', 'Warm', 'Monochrome', 'Vibrant'];
const LAYOUTS: ResumeTemplate['layout'][] = ['single-column', 'two-column', 'sidebar-left', 'sidebar-right'];

const categoryMap: Record<ProfessionCategory, string[]> = {
  'Technology & Engineering': [
    'Software Engineer — Modern Dark',
    'Full Stack Developer — Clean Blue',
    'DevOps Engineer — Technical Slate',
    'iOS/Android Developer — Minimalist',
    'Cybersecurity Analyst — Bold Midnight',
    'Cloud Architect — Executive Navy',
    'Embedded Systems Engineer — Classic',
    'QA Engineer — Professional Green',
    'Machine Learning Engineer — Modern Teal',
    'IT Project Manager — Two-Column Clean',
  ],
  'Business & Finance': [
    'Investment Banker — Executive Charcoal',
    'Financial Analyst — Classic Navy',
    'CA / CPA — Professional Maroon',
    'Business Consultant — Modern Slate',
    'Private Equity Associate — Elegant Midnight',
    'CFO / Finance Director — Executive Bold',
    'Risk Manager — Classic Burgundy',
    'Startup Founder — Creative Vibrant',
    'Management Consultant — Minimalist Clean',
    'Venture Capital Analyst — Modern Two-Column',
  ],
  'Healthcare & Medicine': [
    'MBBS Doctor — Classic Teal',
    'Nurse Practitioner — Clean Warm',
    'Hospital Administrator — Executive Navy',
    'Clinical Research Associate — Professional',
    'Pharmacist — Minimalist Green',
    'Radiologist — Technical Clean',
    'Surgeon — Executive Elegant',
    'Dentist — Modern Teal',
    'Public Health Officer — Classic Slate',
    'Mental Health Counselor — Warm Minimalist',
  ],
  'Creative & Design': [
    'UX/UI Designer — Bold Creative',
    'Graphic Designer — Vibrant Two-Column',
    'Brand Strategist — Elegant Sidebar',
    'Motion Designer — Dark Modern',
    'Industrial Designer — Technical Bold',
    'Art Director — Executive Creative',
    'Illustrator — Minimalist Creative',
    'Interior Designer — Warm Elegant',
    'Product Designer — Clean Modern',
    'Creative Director — Bold Midnight',
  ],
  'Sales & Marketing': [
    'Digital Marketing Manager — Modern Teal',
    'Sales Executive — Bold Navy',
    'Growth Hacker — Vibrant Creative',
    'Brand Manager — Elegant Warm',
    'Performance Marketing Lead — Technical',
    'E-commerce Manager — Modern Clean',
    'Account Manager — Classic Professional',
    'VP of Sales — Executive Bold',
    'Content Strategist — Creative Sidebar',
    'Marketing Analyst — Minimalist Navy',
  ],
  'Education & Research': [
    'University Professor — Classic Elegant',
    'School Teacher — Warm Professional',
    'Research Scientist — Technical Slate',
    'PhD Candidate — Minimalist Clean',
    'Education Administrator — Executive Navy',
    'Academic Counselor — Classic Warm',
    'Corporate Trainer — Modern Teal',
    'EdTech Specialist — Creative Bold',
    'Curriculum Developer — Professional Green',
    'Postdoctoral Fellow — Classic Two-Column',
  ],
  'Legal & Compliance': [
    'Corporate Lawyer — Executive Charcoal',
    'Legal Associate — Classic Navy',
    'Compliance Officer — Professional Slate',
    'IP Attorney — Elegant Burgundy',
    'Paralegal — Classic Minimalist',
    'Legal Counsel — Executive Bold',
    'Contract Specialist — Clean Professional',
    'Criminal Defense Attorney — Bold Midnight',
    'Company Secretary — Classic Teal',
    'Arbitration Specialist — Elegant Classic',
  ],
  'Operations & Supply Chain': [
    'Supply Chain Manager — Technical Navy',
    'Procurement Specialist — Classic Teal',
    'Logistics Manager — Bold Slate',
    'Operations Director — Executive Bold',
    'Inventory Analyst — Minimalist Clean',
    'Warehouse Manager — Professional',
    'Vendor Manager — Modern Navy',
    'Process Improvement Lead — Technical Bold',
    'Plant Manager — Classic Professional',
    'SCM Consultant — Executive Two-Column',
  ],
  'Human Resources': [
    'HR Business Partner — Warm Modern',
    'Talent Acquisition Lead — Clean Teal',
    'HR Director — Executive Navy',
    'Compensation & Benefits Manager — Classic',
    'Learning & Development Head — Creative',
    'CHRO — Executive Bold',
    'People Operations Manager — Modern Warm',
    'HR Analyst — Minimalist Technical',
    'Recruitment Consultant — Bold Navy',
    'Culture & Engagement Lead — Creative Vibrant',
  ],
  'Automotive & Manufacturing': [
    'Automotive Engineer — Technical Navy',
    'Body Electronics Engineer — Bold Technical',
    'Manufacturing Engineer — Classic Professional',
    'Quality Assurance Engineer — Minimalist',
    'Plant Operations Head — Executive Navy',
    'Mechanical Design Engineer — Technical Slate',
    'Tooling Engineer — Classic Bold',
    'NVH Engineer — Professional Technical',
    'EV Systems Engineer — Modern Teal',
    'Production Manager — Executive Classic',
  ],
  'Data & Analytics': [
    'Data Scientist — Modern Dark',
    'Business Intelligence Analyst — Technical Navy',
    'Data Engineer — Bold Technical',
    'Analytics Manager — Executive Teal',
    'ML Engineer — Modern Midnight',
    'Data Architect — Executive Classic',
    'Statistical Analyst — Minimalist Clean',
    'AI Research Engineer — Bold Creative',
    'Product Analyst — Modern Two-Column',
    'Chief Data Officer — Executive Bold',
  ],
  'Hospitality & Retail': [
    'Hotel General Manager — Elegant Warm',
    'Restaurant Manager — Classic Bold',
    'Retail Store Manager — Modern Clean',
    'Event Manager — Creative Vibrant',
    'Food & Beverage Director — Executive Warm',
    'Customer Experience Manager — Modern Teal',
    'Luxury Brand Associate — Elegant Classic',
    'Travel Consultant — Creative Warm',
    'Revenue Manager — Technical Professional',
    'Sommelier / F&B Specialist — Elegant Minimalist',
  ],
  'Media & Communications': [
    'Journalist — Classic Bold',
    'PR Manager — Creative Warm',
    'Broadcast Producer — Modern Dark',
    'Social Media Manager — Vibrant Creative',
    'Content Writer — Minimalist Clean',
    'Podcast Producer — Bold Creative',
    'Communications Director — Executive Navy',
    'Copywriter — Creative Sidebar',
    'Film Director — Dark Bold',
    'Video Editor — Technical Creative',
  ],
  'Government & Public Sector': [
    'IAS Officer — Classic Charcoal',
    'Policy Analyst — Professional Navy',
    'Urban Planner — Technical Classic',
    'Defense Officer — Executive Bold',
    'Public Health Administrator — Classic Teal',
    'Economic Advisor — Executive Classic',
    'Municipal Engineer — Technical Professional',
    'Civil Services Aspirant — Minimalist Clean',
    'NGO Program Manager — Warm Classic',
    'Electoral Affairs Officer — Classic Professional',
  ],
  'Startups & Entrepreneurship': [
    'Startup Founder — Bold Vibrant',
    'Early Stage CEO — Executive Dark',
    'Growth Lead — Modern Creative',
    'Product Manager — Clean Navy',
    'Technical Co-Founder — Bold Technical',
    'Startup Operations Head — Modern Teal',
    'Pre-Seed Pitch CV — Creative Bold',
    'Angel Investor — Elegant Executive',
    'Startup Advisor — Classic Professional',
    'Series A Ready Executive — Executive Bold',
  ],
};

function inferStyle(name: string): TemplateStyle {
  const options: TemplateStyle[] = ['Modern', 'Classic', 'Minimalist', 'Executive', 'Creative', 'Technical', 'Elegant', 'Bold', 'Clean', 'Professional'];
  const hit = options.find((style) => name.toLowerCase().includes(style.toLowerCase()));
  return hit ?? 'Professional';
}

function inferLayout(name: string, index: number): ResumeTemplate['layout'] {
  const lowercase = name.toLowerCase();
  if (lowercase.includes('two-column')) return 'two-column';
  if (lowercase.includes('sidebar')) return index % 2 === 0 ? 'sidebar-left' : 'sidebar-right';
  return LAYOUTS[index % LAYOUTS.length];
}

function atsForLayout(layout: ResumeTemplate['layout'], index: number): number {
  if (layout === 'single-column') return 85 + (index % 14);
  if (layout === 'two-column') return 74 + (index % 12);
  return 60 + (index % 16);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildTemplate(category: ProfessionCategory, name: string, idx: number): ResumeTemplate {
  const style = inferStyle(name);
  const layout = inferLayout(name, idx);
  const accentColor = ACCENTS[idx % ACCENTS.length];
  const fontPair = FONT_PAIRS[idx % FONT_PAIRS.length];
  const title = name.split('—')[0].trim();
  const subcategory = title.split('/')[0].trim();
  return {
    id: slugify(name),
    name,
    category,
    subcategory,
    style,
    colorScheme: SCHEMES[idx % SCHEMES.length],
    atsScore: atsForLayout(layout, idx),
    tags: [category, style, layout, subcategory, 'ATS', 'resume template'].map((v) => v.toLowerCase()),
    sections: BASE_SECTIONS,
    sampleData: {
      name: 'Alex Johnson',
      title,
      email: 'alex.johnson@email.com',
      phone: '+91 98765 43210',
      location: idx % 2 === 0 ? 'Bengaluru, India' : 'Mumbai, India',
      summary:
        'Outcome-focused professional with a track record of building high-impact initiatives, leading cross-functional teams, and delivering measurable business outcomes. Combines strategy and execution to accelerate growth.',
      experience: [
        {
          role: title,
          company: 'Apex Dynamics',
          duration: '2022 - Present',
          highlights: ['Delivered 3 major initiatives ahead of schedule', 'Improved KPI performance by 27% quarter-over-quarter'],
        },
        {
          role: `Associate ${title}`,
          company: 'Nova Labs',
          duration: '2019 - 2022',
          highlights: ['Partnered with stakeholders across product and operations', 'Built playbooks that scaled team execution'],
        },
      ],
      education: [{ degree: 'B.Tech / MBA', institution: 'Indian Institute of Excellence', duration: '2015 - 2019' }],
      skills: ['Strategic Planning', 'Stakeholder Management', 'Data-Driven Decision Making', 'Execution Excellence', 'Leadership'],
      achievements: ['Top 5% performer for 2 consecutive years', 'Led initiatives resulting in multi-crore impact'],
    },
    accentColor,
    fontPair,
    layout,
    description: `${name} crafted for high-performance candidates targeting ${subcategory.toLowerCase()} opportunities.`,
    bestFor: idx % 3 === 0 ? 'Entry to mid-level professionals' : idx % 3 === 1 ? 'Mid to senior professionals' : 'Leadership and executive profiles',
  };
}

export const resumeTemplates: ResumeTemplate[] = Object.entries(categoryMap).flatMap(([category, names], categoryIndex) =>
  names.map((name, index) => buildTemplate(category as ProfessionCategory, name, categoryIndex * 10 + index))
);

