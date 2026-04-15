export type TemplateCategory = 'campus' | 'corporate' | 'government';

export type TemplateId =
  | 'modern'
  | 'classic'
  | 'creative'
  | 'minimalist'
  | 'professional'
  | 'executive'
  | 'elegant'
  | 'technical';

export interface TemplateCatalogItem {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  useCase: string;
  atsReady: boolean;
  isOriginal: boolean;
  isPremium: boolean;
}

export const templateCategoryLabels: Record<TemplateCategory, string> = {
  campus: 'Campus & Fresher',
  corporate: 'Corporate',
  government: 'Govt & Exams',
};

/**
 * Central template catalog used by the gallery and analytics.
 * Keep this in sync with templateRegistry keys.
 */
export const templateCatalog: TemplateCatalogItem[] = [
  {
    id: 'modern',
    name: 'Modern Campus',
    category: 'campus',
    useCase: 'Final-year students and off-campus fresher applications',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
  {
    id: 'classic',
    name: 'Classic Corporate',
    category: 'corporate',
    useCase: 'Service and operations roles in large enterprises',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    category: 'campus',
    useCase: 'Design, content, and product portfolio-linked profiles',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
  {
    id: 'minimalist',
    name: 'Minimal Govt Ready',
    category: 'government',
    useCase: 'Exam-oriented and structured role applications',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
  {
    id: 'professional',
    name: 'Professional Corporate',
    category: 'corporate',
    useCase: 'Analyst, consultant, and general corporate positions',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'corporate',
    useCase: 'Mid-senior management and leadership applications',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
  {
    id: 'elegant',
    name: 'Elegant Consulting',
    category: 'corporate',
    useCase: 'Client-facing business and consulting profiles',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
  {
    id: 'technical',
    name: 'Technical Product',
    category: 'campus',
    useCase: 'Engineering, product, and developer roles',
    atsReady: true,
    isOriginal: true,
    isPremium: false,
  },
];
