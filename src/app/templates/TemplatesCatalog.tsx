'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Eye, Loader2, Plus, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { trackEvent } from '@/lib/analytics-events';
import { resumeTemplates, type ProfessionCategory, type ResumeTemplate, type TemplateStyle } from '@/data/resumeTemplates';
import {
  TEMPLATE_CATALOG_SORT,
  parseTemplateCatalogQuery,
  serializeTemplateCatalogQuery,
  templateCatalogFiltersEqual,
  type TemplateCatalogSort,
  type TemplateLayoutFilter,
} from '@/lib/templates-catalog-url';
import { templateStylePreviewPath } from '@/lib/template-style-preview-image';
import {
  trackTemplatesCatalogView,
  trackTemplatesFilterReset,
  trackTemplatesPreviewClose,
  trackTemplatesPreviewNav,
  trackTemplatesPreviewOpen,
  trackTemplatesUrlSync,
} from '@/lib/templates-analytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

function prefetchResumePreviewModule(): void {
  void import('@/components/resume/ResumePreview');
}

const LazyResumePreview = dynamic(
  () => import('@/components/resume/ResumePreview').then((mod) => mod.ResumePreview),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[min(74vh,800px)] w-[635px] max-w-full flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-white/70"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
        <span className="text-sm">Loading preview…</span>
      </div>
    ),
  },
);

const categories: ProfessionCategory[] = [...new Set(resumeTemplates.map((template) => template.category))];
const styleOptions: Array<TemplateStyle | 'All'> = ['All', 'Modern', 'Classic', 'Minimalist', 'Executive', 'Creative'];

function layoutRank(layout: ResumeTemplate['layout']): number {
  if (layout === 'single-column') return 3;
  if (layout === 'two-column' || layout === 'sidebar-left' || layout === 'sidebar-right') return 2;
  return 1;
}

function scoreVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
}

function sortFiltered(selected: ResumeTemplate[], sortBy: TemplateCatalogSort): ResumeTemplate[] {
  if (sortBy === 'ATS Score') {
    return [...selected].sort((a, b) => b.atsScore - a.atsScore || a.name.localeCompare(b.name));
  }
  if (sortBy === 'Name') {
    return [...selected].sort((a, b) => a.name.localeCompare(b.name));
  }
  return [...selected].sort(
    (a, b) =>
      b.atsScore - a.atsScore ||
      layoutRank(b.layout) - layoutRank(a.layout) ||
      a.name.localeCompare(b.name),
  );
}

export default function TemplatesCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const parentRef = useRef<HTMLDivElement>(null);
  const skipUrlParse = useRef(false);
  const stateRef = useRef({
    query: '',
    category: 'All' as 'All' | ProfessionCategory,
    style: 'All' as TemplateStyle | 'All',
    layout: 'All' as TemplateLayoutFilter,
    atsThreshold: 0,
    sortBy: 'Recommended' as TemplateCatalogSort,
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ProfessionCategory>('All');
  const [style, setStyle] = useState<TemplateStyle | 'All'>('All');
  const [layout, setLayout] = useState<TemplateLayoutFilter>('All');
  const [atsThreshold, setAtsThreshold] = useState(0);
  const [sortBy, setSortBy] = useState<TemplateCatalogSort>('Recommended');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [columns, setColumns] = useState(3);

  stateRef.current = { query, category, style, layout, atsThreshold, sortBy };

  useEffect(() => {
    trackTemplatesCatalogView();
  }, []);

  const searchKey = searchParams.toString();

  useEffect(() => {
    if (skipUrlParse.current) {
      skipUrlParse.current = false;
      return;
    }
    const parsed = parseTemplateCatalogQuery(new URLSearchParams(searchKey), categories, styleOptions);
    setQuery(parsed.query);
    setCategory(parsed.category);
    setStyle(parsed.style);
    setLayout(parsed.layout);
    setAtsThreshold(parsed.atsThreshold);
    setSortBy(parsed.sortBy);
  }, [searchKey]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const local = stateRef.current;
      const qs = typeof window !== 'undefined' ? window.location.search.slice(1) : '';
      const urlParsed = parseTemplateCatalogQuery(new URLSearchParams(qs), categories, styleOptions);
      if (templateCatalogFiltersEqual(local, urlParsed)) return;

      const next = serializeTemplateCatalogQuery(local);
      skipUrlParse.current = true;
      router.replace(next ? `/templates?${next}` : '/templates', { scroll: false });

      let filterCount = 0;
      if (local.query.trim()) filterCount += 1;
      if (local.category !== 'All') filterCount += 1;
      if (local.style !== 'All') filterCount += 1;
      if (local.layout !== 'All') filterCount += 1;
      if (local.atsThreshold > 0) filterCount += 1;
      if (local.sortBy !== 'Recommended') filterCount += 1;
      trackTemplatesUrlSync({ has_query: Boolean(local.query.trim()), filter_count: filterCount });
    }, 220);
    return () => window.clearTimeout(id);
  }, [query, category, style, layout, atsThreshold, sortBy, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selected = resumeTemplates.filter((template) => {
      const matchesQuery =
        !q ||
        template.name.toLowerCase().includes(q) ||
        template.tags.some((tag) => tag.includes(q)) ||
        template.category.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || template.category === category;
      const matchesStyle = style === 'All' || template.style === style;
      const matchesLayout =
        layout === 'All'
          ? true
          : layout === 'sidebar'
            ? template.layout === 'sidebar-left' || template.layout === 'sidebar-right'
            : template.layout === layout;
      const matchesAts = template.atsScore >= atsThreshold;
      return matchesQuery && matchesCategory && matchesStyle && matchesLayout && matchesAts;
    });

    return sortFiltered(selected, sortBy);
  }, [query, category, style, layout, atsThreshold, sortBy]);

  const previewTemplate = filtered.find((template) => template.id === previewId) ?? null;
  const previewSeries = useMemo(() => {
    if (!previewTemplate) return filtered;
    return filtered.filter((template) => template.category === previewTemplate.category);
  }, [filtered, previewTemplate]);
  const previewIndex = previewTemplate ? previewSeries.findIndex((template) => template.id === previewTemplate.id) : -1;

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 768) {
        setColumns(1);
      } else if (window.innerWidth < 1200) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const rows = Math.ceil(filtered.length / columns);
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 4,
    measureElement: typeof window !== 'undefined' && typeof window.ResizeObserver !== 'undefined' ? (el) => el.getBoundingClientRect().height : undefined,
  });

  useEffect(() => {
    rowVirtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, filtered.length, rows]);

  const applyTemplate = (template: ResumeTemplate, source: 'grid' | 'preview') => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fitcv:selected-template-id', template.id);
    }
    if (!user) trackEvent('signup_gate_hit', { action: 'template_start' });
    trackEvent('template_use_click', { template_id: template.id, template_name: template.name, source });
    toast({ title: `Using ${template.name}`, description: 'Loading this template in your editor with starter content.' });
    router.push(`/editor/new?template=${template.id}`);
  };

  const movePreview = (direction: -1 | 1) => {
    if (!previewTemplate || !previewSeries.length) return;
    trackTemplatesPreviewNav(direction === -1 ? 'prev' : 'next', sortBy);
    const next = (previewIndex + direction + previewSeries.length) % previewSeries.length;
    setPreviewId(previewSeries[next].id);
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    category !== 'All' ||
    style !== 'All' ||
    layout !== 'All' ||
    atsThreshold > 0 ||
    sortBy !== 'Recommended';

  const resetFilters = () => {
    trackTemplatesFilterReset();
    setQuery('');
    setCategory('All');
    setStyle('All');
    setLayout('All');
    setAtsThreshold(0);
    setSortBy('Recommended');
    skipUrlParse.current = true;
    router.replace('/templates', { scroll: false });
  };

  return (
    <>
      <section className="sticky top-20 z-20 mb-6 rounded-xl border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" disabled={!hasActiveFilters} onClick={resetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
            Reset filters
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Label htmlFor="template-search">Search</Label>
            <Input id="template-search" placeholder="Search templates..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as 'All' | ProfessionCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Style</Label>
            <Select value={style} onValueChange={(value) => setStyle(value as TemplateStyle | 'All')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Layout</Label>
            <Select value={layout} onValueChange={(value) => setLayout(value as TemplateLayoutFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All layouts</SelectItem>
                <SelectItem value="single-column">Single Column</SelectItem>
                <SelectItem value="two-column">Two Column</SelectItem>
                <SelectItem value="sidebar">Sidebar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Sort by</Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as TemplateCatalogSort)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATALOG_SORT.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label>ATS Optimized ({atsThreshold}+)</Label>
          <Slider value={[atsThreshold]} onValueChange={(value) => setAtsThreshold(value[0] ?? 0)} max={95} step={5} />
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
          <p className="mb-4">No templates match these filters.</p>
          <Button type="button" variant="secondary" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div ref={parentRef} className="h-[calc(100vh-260px)] overflow-auto rounded-xl border bg-background p-4">
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((item) => {
              const start = item.index * columns;
              const rowItems = filtered.slice(start, start + columns);
              return (
                <div
                  key={item.key}
                  ref={rowVirtualizer.measureElement}
                  data-index={item.index}
                  className="absolute left-0 top-0 w-full py-3"
                  style={{ transform: `translateY(${item.start}px)` }}
                >
                  <div className={cn('grid gap-4', columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
                    {rowItems.map((template) => (
                      <Card
                        key={template.id}
                        className="group flex flex-col overflow-hidden border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <CardContent className="space-y-3 p-4">
                          <div className="overflow-hidden rounded-md border bg-muted/40">
                            <Image
                              src={templateStylePreviewPath(template.style)}
                              alt=""
                              width={190}
                              height={269}
                              sizes="190px"
                              loading="lazy"
                              className="mx-auto block h-auto w-full max-w-[190px] object-cover object-top"
                              unoptimized
                            />
                          </div>
                          <div>
                            <h3 className="font-headline text-lg font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{template.category}</Badge>
                            <Badge variant={scoreVariant(template.atsScore)}>ATS {template.atsScore}</Badge>
                            <Badge variant="secondary">{template.style}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto grid grid-cols-2 gap-2 p-4 pt-0">
                          <Button
                            variant="outline"
                            onMouseEnter={prefetchResumePreviewModule}
                            onFocus={prefetchResumePreviewModule}
                            onClick={() => {
                              trackTemplatesPreviewOpen(template.id);
                              setPreviewId(template.id);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" aria-hidden /> Preview
                          </Button>
                          <Button onClick={() => applyTemplate(template, 'grid')}>
                            <Plus className="mr-2 h-4 w-4" aria-hidden /> Use This Template
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    {rowItems.length < columns
                      ? Array.from({ length: columns - rowItems.length }).map((_, idx) => (
                          <div key={`spacer-${idx}`} aria-hidden className="min-h-0" />
                        ))
                      : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog
        open={Boolean(previewTemplate)}
        onOpenChange={(open) => {
          if (!open) {
            if (previewId) trackTemplatesPreviewClose(previewId);
            setPreviewId(null);
          }
        }}
      >
        <DialogContent className="max-h-[92vh] max-w-[98vw] overflow-hidden border-none bg-black/95 p-0 text-white">
          {previewTemplate ? (
            <>
              <DialogHeader className="border-b border-white/15 px-4 py-3">
                <DialogTitle className="flex items-center justify-between gap-3">
                  <span className="truncate">{previewTemplate.name}</span>
                  <Button variant="secondary" onClick={() => applyTemplate(previewTemplate, 'preview')}>
                    Use This Template
                  </Button>
                </DialogTitle>
                <p className="text-sm text-white/70">
                  {previewTemplate.category} | {previewTemplate.style} | ATS {previewTemplate.atsScore} | Best for {previewTemplate.bestFor}
                </p>
              </DialogHeader>
              <div className="relative flex h-[74vh] items-center justify-center p-4">
                <Button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  variant="outline"
                  aria-label="Previous template in this category"
                  onClick={() => movePreview(-1)}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </Button>
                <div className="max-h-full overflow-auto rounded-lg bg-white p-2">
                  <LazyResumePreview template={previewTemplate} scale={0.8} className="w-[635px]" />
                </div>
                <Button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  variant="outline"
                  aria-label="Next template in this category"
                  onClick={() => movePreview(1)}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
              <DialogFooter className="border-t border-white/15 px-4 py-3">
                <div className="w-full text-sm text-white/70">
                  {previewIndex + 1} / {previewSeries.length} in {previewTemplate.category}
                </div>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
