export const ATS_PAGE_DIMENSIONS = {
  width: '794px', // A4 @ 96dpi
  minHeight: '1123px',
} as const;

export const ATS_TEMPLATE_CLASSNAMES = {
  shell:
    'mx-auto w-full max-w-[794px] rounded-md border border-slate-300 bg-white p-10 text-slate-900 shadow-sm print:max-w-none print:rounded-none print:border-none print:p-8 print:shadow-none',
  sectionTitle: 'border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-800',
  paragraph: 'text-[11px] leading-relaxed text-slate-800',
  meta: 'text-[10px] text-slate-600',
} as const;

