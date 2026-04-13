'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Eye, Plus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn, isPlaceholderCoUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { trackEvent } from '@/lib/analytics-events';
import { useUser } from '@/firebase';

type TemplateCategory = 'campus' | 'corporate' | 'government';

type TemplateItem = {
  id: string;
  name: string;
  category: TemplateCategory;
  image: ImagePlaceholder;
  isPremium: boolean;
};

const FILTER_TABS: { id: 'all' | TemplateCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'campus', label: 'Campus & Fresher' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'government', label: 'Govt & Exams' },
];

const rawTemplates: Omit<TemplateItem, 'image'>[] = [
  { id: 'modern', name: 'Modern Campus', category: 'campus', isPremium: false },
  { id: 'classic', name: 'Classic Corporate', category: 'corporate', isPremium: false },
  { id: 'creative', name: 'Creative Portfolio', category: 'campus', isPremium: false },
  { id: 'minimalist', name: 'Minimal Govt Ready', category: 'government', isPremium: false },
  { id: 'professional', name: 'Professional Corporate', category: 'corporate', isPremium: false },
  { id: 'executive', name: 'Executive Leadership', category: 'corporate', isPremium: false },
  { id: 'elegant', name: 'Elegant Consulting', category: 'corporate', isPremium: false },
  { id: 'technical', name: 'Technical Product', category: 'campus', isPremium: false },
];

const templates: TemplateItem[] = rawTemplates
  .map((t) => {
    const image = PlaceHolderImages.find((img) => img.id === `template-${t.id}`);
    if (!image) return null;
    return { ...t, image };
  })
  .filter((t): t is TemplateItem => t !== null);

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [filter, setFilter] = useState<'all' | TemplateCategory>('all');

  const visible = useMemo(() => {
    if (filter === 'all') return templates;
    return templates.filter((t) => t.category === filter);
  }, [filter]);

  const handleUseTemplate = (templateId: string, templateName?: string) => {
    const label = templateName ?? templateId;
    trackEvent('template_use_click', { template_id: templateId, template_name: label });
    if (!user) {
      trackEvent('signup_gate_hit', { action: 'template_start' });
    }
    toast({
      title: `Opening ${label}`,
      description: 'We’ll create a new resume with this layout in the editor.',
    });
    router.push(`/editor/new?template=${templateId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-20">
        <motion.div
          className="text-center mb-8 md:mb-12 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight leading-tight"
          >
            Choose your template
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground">
            Pick a layout for campus placements, private-sector roles, or exam-focused applications. All templates are ATS-friendly and free with a FitCV account.
          </motion.p>
        </motion.div>

        <div
          className="mb-8 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto pb-1 flex gap-2 snap-x snap-mandatory"
          role="tablist"
          aria-label="Filter templates"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id ? true : false}
              onClick={() => setFilter(tab.id)}
              className={cn(
                'snap-start shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px] border',
                filter === tab.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {visible.map((template) => {
            const src = template.image.imageUrl;
            const unopt = isPlaceholderCoUrl(src);

            return (
              <motion.div key={template.id} variants={itemVariants}>
                <Card className="group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border-border">
                  <CardContent className="p-0 relative">
                    {template.isPremium && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
                          Premium
                        </div>
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-wide bg-background/90 backdrop-blur-sm"
                    >
                      ATS-friendly
                    </Badge>

                    <div className="relative aspect-video w-full bg-muted overflow-hidden">
                      <Image
                        src={src}
                        alt={template.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={unopt}
                        data-ai-hint={template.image.imageHint}
                        className="object-cover object-top transition-transform duration-500 ease-out md:group-hover:scale-[1.03]"
                      />

                      <div className="hidden md:flex absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-full"
                              aria-label={`Preview ${template.name}`}
                            >
                              <Eye className="h-6 w-6" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 flex flex-col max-h-[min(92dvh,900px)]">
                            <DialogHeader className="sr-only">
                              <DialogTitle>{template.name} template preview</DialogTitle>
                              <DialogDescription>
                                Larger preview of the {template.name} resume template.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="overflow-y-auto flex-1 p-3 sm:p-4 min-h-0">
                              <Image
                                src={src}
                                alt={`${template.name} full preview`}
                                width={800}
                                height={1131}
                                sizes="(max-width: 1024px) 95vw, 800px"
                                unoptimized={unopt}
                                data-ai-hint={template.image.imageHint}
                                className="w-full h-auto object-contain rounded-lg mx-auto max-h-[65dvh] sm:max-h-[70vh]"
                              />
                            </div>
                            <DialogFooter className="p-4 border-t border-border bg-card shrink-0 flex-col sm:flex-row gap-2">
                              <Button
                                type="button"
                                className="w-full min-h-[48px] text-base"
                                onClick={() => handleUseTemplate(template.id, template.name)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Use this template
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="lg"
                          className="min-h-[48px] text-base"
                          onClick={() => handleUseTemplate(template.id, template.name)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Use template
                        </Button>
                      </div>
                    </div>

                    <div className="flex md:hidden gap-2 p-3 border-t border-border bg-card">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 min-h-[48px] text-base"
                            aria-label={`Preview ${template.name}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 flex flex-col max-h-[min(92dvh,900px)]">
                          <DialogHeader className="sr-only">
                            <DialogTitle>{template.name} template preview</DialogTitle>
                            <DialogDescription>Preview of the {template.name} template.</DialogDescription>
                          </DialogHeader>
                          <div className="overflow-y-auto flex-1 p-3 min-h-0">
                            <Image
                              src={src}
                              alt={`${template.name} full preview`}
                              width={800}
                              height={1131}
                              sizes="(max-width: 1024px) 95vw, 800px"
                              unoptimized={unopt}
                              className="w-full h-auto object-contain rounded-lg mx-auto max-h-[60dvh]"
                            />
                          </div>
                          <DialogFooter className="p-4 border-t border-border bg-card shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <Button
                              type="button"
                              className="w-full min-h-[52px] text-base"
                              onClick={() => handleUseTemplate(template.id, template.name)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Use this template
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        className="flex-1 min-h-[48px] text-base"
                        onClick={() => handleUseTemplate(template.id, template.name)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-background/80 border-t border-border mt-auto flex items-center justify-between gap-2">
                    <h3 className="font-headline text-lg font-semibold">{template.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground shrink-0">
                      {template.category}
                    </span>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
