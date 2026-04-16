import type { TemplateStyle } from '@/data/resumeTemplates';

/** Static SVGs under /public/images/templates — representative art per style (not per-template). */
const STYLE_TO_FILE: Record<TemplateStyle, string> = {
  Modern: 'template-modern.svg',
  Classic: 'template-classic.svg',
  Minimalist: 'template-minimalist.svg',
  Executive: 'template-executive.svg',
  Creative: 'template-creative.svg',
  Technical: 'template-technical.svg',
  Elegant: 'template-elegant.svg',
  Bold: 'template-creative.svg',
  Clean: 'template-minimalist.svg',
  Professional: 'template-professional.svg',
};

export function templateStylePreviewPath(style: TemplateStyle): string {
  const file = STYLE_TO_FILE[style] ?? 'template-professional.svg';
  return `/images/templates/${file}`;
}
