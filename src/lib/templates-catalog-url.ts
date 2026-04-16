import type { ProfessionCategory, TemplateStyle } from '@/data/resumeTemplates';

export const TEMPLATE_CATALOG_SORT = ['Recommended', 'Name', 'ATS Score'] as const;
export type TemplateCatalogSort = (typeof TEMPLATE_CATALOG_SORT)[number];

export type TemplateLayoutFilter = 'All' | 'single-column' | 'two-column' | 'sidebar';

const LAYOUT_VALUES: TemplateLayoutFilter[] = ['All', 'single-column', 'two-column', 'sidebar'];

function isProfessionCategory(value: string, categories: ProfessionCategory[]): value is ProfessionCategory {
  return categories.includes(value as ProfessionCategory);
}

function parseSort(raw: string | null): TemplateCatalogSort {
  const v = (raw ?? '').toLowerCase().replace(/\s+/g, '');
  if (v === 'ats' || v === 'atsscore') return 'ATS Score';
  if (v === 'name' || v === 'newest' || v === 'a-z') return 'Name';
  if (v === 'popular' || v === 'recommended' || v === 'default' || v === '') return 'Recommended';
  return 'Recommended';
}

function sortToParam(sort: TemplateCatalogSort): string {
  if (sort === 'ATS Score') return 'ats';
  if (sort === 'Name') return 'name';
  return 'recommended';
}

export function parseTemplateCatalogQuery(
  searchParams: URLSearchParams,
  categories: readonly ProfessionCategory[],
  styleOptions: readonly (TemplateStyle | 'All')[],
): {
  query: string;
  category: 'All' | ProfessionCategory;
  style: TemplateStyle | 'All';
  layout: TemplateLayoutFilter;
  atsThreshold: number;
  sortBy: TemplateCatalogSort;
} {
  const query = searchParams.get('q') ?? '';
  const catRaw = searchParams.get('cat');
  const category: 'All' | ProfessionCategory =
    catRaw && catRaw !== 'All' && isProfessionCategory(catRaw, [...categories]) ? catRaw : 'All';

  const styleRaw = searchParams.get('style');
  const style: TemplateStyle | 'All' =
    styleRaw && (styleOptions as readonly string[]).includes(styleRaw) ? (styleRaw as TemplateStyle | 'All') : 'All';

  const layoutRaw = searchParams.get('layout');
  const layout: TemplateLayoutFilter =
    layoutRaw && (LAYOUT_VALUES as readonly string[]).includes(layoutRaw) ? (layoutRaw as TemplateLayoutFilter) : 'All';

  const atsRaw = searchParams.get('ats');
  const parsedAts = atsRaw ? Number.parseInt(atsRaw, 10) : 0;
  const atsThreshold = Number.isFinite(parsedAts) ? Math.min(95, Math.max(0, Math.round(parsedAts / 5) * 5)) : 0;

  const sortBy = parseSort(searchParams.get('sort'));

  return { query, category, style, layout, atsThreshold, sortBy };
}

export function serializeTemplateCatalogQuery(state: {
  query: string;
  category: 'All' | ProfessionCategory;
  style: TemplateStyle | 'All';
  layout: TemplateLayoutFilter;
  atsThreshold: number;
  sortBy: TemplateCatalogSort;
}): string {
  const p = new URLSearchParams();
  const q = state.query.trim();
  if (q) p.set('q', q);
  if (state.category !== 'All') p.set('cat', state.category);
  if (state.style !== 'All') p.set('style', state.style);
  if (state.layout !== 'All') p.set('layout', state.layout);
  if (state.atsThreshold > 0) p.set('ats', String(state.atsThreshold));
  if (state.sortBy !== 'Recommended') p.set('sort', sortToParam(state.sortBy));
  return p.toString();
}

export type TemplateCatalogFilters = ReturnType<typeof parseTemplateCatalogQuery>;

export function templateCatalogFiltersEqual(a: TemplateCatalogFilters, b: TemplateCatalogFilters): boolean {
  return (
    a.query.trim() === b.query.trim() &&
    a.category === b.category &&
    a.style === b.style &&
    a.layout === b.layout &&
    a.atsThreshold === b.atsThreshold &&
    a.sortBy === b.sortBy
  );
}
