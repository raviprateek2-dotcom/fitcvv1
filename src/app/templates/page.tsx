'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Eye, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { trackEvent } from '@/lib/analytics-events';
import { resumeTemplates, type ProfessionCategory, type ResumeTemplate, type TemplateStyle } from '@/data/resumeTemplates';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const categories: ProfessionCategory[] = [...new Set(resumeTemplates.map((template) => template.category))];
const styleOptions: Array<TemplateStyle | 'All'> = ['All', 'Modern', 'Classic', 'Minimalist', 'Executive', 'Creative'];
type LayoutFilter = 'All' | 'single-column' | 'two-column' | 'sidebar';

const layoutOptions: LayoutFilter[] = ['All', 'single-column', 'two-column', 'sidebar'];
const sortOptions = ['Popular', 'Newest', 'ATS Score'] as const;

function scoreVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
}

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const parentRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ProfessionCategory>('All');
  const [style, setStyle] = useState<TemplateStyle | 'All'>('All');
  const [layout, setLayout] = useState<LayoutFilter>('All');
  const [atsThreshold, setAtsThreshold] = useState(0);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>('Popular');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [columns, setColumns] = useState(3);

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

    if (sortBy === 'ATS Score') return [...selected].sort((a, b) => b.atsScore - a.atsScore);
    if (sortBy === 'Newest') return [...selected].sort((a, b) => b.id.localeCompare(a.id));
    return [...selected].sort((a, b) => b.tags.length - a.tags.length);
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
    estimateSize: () => 540,
    overscan: 4,
  });

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
    const next = (previewIndex + direction + previewSeries.length) % previewSeries.length;
    setPreviewId(previewSeries[next].id);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">Resume Templates</h1>
          <p className="mt-3 text-muted-foreground">
            150 professionally crafted templates across 15 industries. Click any template to preview or start editing instantly.
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/templates/ats">Open ATS Template Picker</Link>
            </Button>
          </div>
        </header>

        <section className="sticky top-16 z-20 mb-6 rounded-xl border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Label htmlFor="template-search">Search</Label>
              <Input id="template-search" placeholder="Search templates..." value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as 'All' | ProfessionCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All categories</SelectItem>
                  {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Style</Label>
              <Select value={style} onValueChange={(value) => setStyle(value as TemplateStyle | 'All')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {styleOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Layout</Label>
              <Select value={layout} onValueChange={(value) => setLayout(value as LayoutFilter)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as (typeof sortOptions)[number])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sortOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
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
            No templates found. Try adjusting your filters.
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
                    className="absolute left-0 top-0 w-full py-3"
                    style={{ transform: `translateY(${item.start}px)` }}
                  >
                    <div className={cn('grid gap-4', columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
                      {rowItems.map((template) => (
                        <Card key={template.id} className="group flex flex-col overflow-hidden border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                          <CardContent className="space-y-3 p-4">
                            <div className="overflow-hidden rounded-md border bg-muted/40">
                              <ResumePreview template={template} scale={0.24} className="mx-auto w-full max-w-[190px]" />
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
                            <Button variant="outline" onClick={() => setPreviewId(template.id)}>
                              <Eye className="mr-2 h-4 w-4" /> Preview
                            </Button>
                            <Button onClick={() => applyTemplate(template, 'grid')}>
                              <Plus className="mr-2 h-4 w-4" /> Use This Template
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                      {rowItems.length < columns
                        ? Array.from({ length: columns - rowItems.length }).map((_, idx) => <div key={`spacer-${idx}`} />)
                        : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Dialog open={Boolean(previewTemplate)} onOpenChange={(open) => !open && setPreviewId(null)}>
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
                  <Button className="absolute left-4 top-1/2 -translate-y-1/2" variant="outline" onClick={() => movePreview(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="max-h-full overflow-auto rounded-lg bg-white p-2">
                    <ResumePreview template={previewTemplate} scale={0.8} className="w-[635px]" />
                  </div>
                  <Button className="absolute right-4 top-1/2 -translate-y-1/2" variant="outline" onClick={() => movePreview(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter className="border-t border-white/15 px-4 py-3">
                  <div className="w-full text-sm text-white/70">{previewIndex + 1} / {previewSeries.length} in {previewTemplate.category}</div>
                </DialogFooter>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
