'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resumeTemplates, type ProfessionCategory, type ResumeTemplate } from '@/data/resumeTemplates';
import { trackEvent } from '@/lib/analytics-events';
import { LANDING_CRO_ANALYTICS_EVENTS } from '@/lib/landing-cro-spec';
import { landingAbParams } from '@/lib/landing-ab-config';

function topInCategory(category: ProfessionCategory, exclude: Set<string>) {
  const candidates = resumeTemplates
    .filter((template) => template.category === category && !exclude.has(template.id))
    .slice()
    .sort((a, b) => b.atsScore - a.atsScore || a.name.localeCompare(b.name));
  return candidates[0] ?? null;
}

function pickGuidedTemplates(): ResumeTemplate[] {
  const picked: ResumeTemplate[] = [];
  const exclude = new Set<string>();

  const push = (template: ResumeTemplate | null) => {
    if (!template) return;
    if (exclude.has(template.id)) return;
    picked.push(template);
    exclude.add(template.id);
  };

  push(topInCategory('Technology & Engineering', exclude));
  push(topInCategory('Business & Finance', exclude));
  push(topInCategory('Sales & Marketing', exclude));

  if (picked.length < 3) {
    const fallback = resumeTemplates
      .filter((template) => !exclude.has(template.id))
      .slice()
      .sort((a, b) => b.atsScore - a.atsScore || a.name.localeCompare(b.name));
    for (const template of fallback) {
      push(template);
      if (picked.length >= 3) break;
    }
  }

  return picked.slice(0, 3);
}

export function LandingGuidedTemplates() {
  const picks = useMemo(() => pickGuidedTemplates(), []);

  return (
    <section className="relative w-full py-14 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Start here (30 seconds)</p>
          <h2 className="mt-3 text-3xl font-headline font-extrabold tracking-tight sm:text-4xl md:text-5xl text-gradient">
            Not sure which template to pick?
          </h2>
          <p className="mt-3 text-muted-foreground md:text-lg leading-relaxed">
            Skip the endless grid for now. These three are strong defaults across common roles — you can switch layouts later without losing content.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {picks.map((template) => (
            <div
              key={template.id}
              className="premium-card p-6 sm:p-7 flex flex-col h-full motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{template.category}</div>
                  <h3 className="mt-2 font-headline text-xl sm:text-2xl font-bold leading-snug text-foreground">{template.name}</h3>
                </div>
                <Badge variant={template.atsScore >= 80 ? 'default' : 'secondary'} className="shrink-0">
                  ATS {template.atsScore}
                </Badge>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-grow">{template.description}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-semibold">
                  Best for: {template.bestFor}
                </Badge>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button asChild className="w-full sm:w-auto rounded-full">
                  <Link
                    href={`/editor/new?template=${encodeURIComponent(template.id)}`}
                    onClick={() =>
                      trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_guided_template_click, {
                        page: 'home',
                        template_id: template.id,
                        template_name: template.name,
                        action: 'editor_start',
                        ...landingAbParams(),
                      })
                    }
                  >
                    Start with this layout
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto rounded-full">
                  <Link
                    href="/templates/ats"
                    onClick={() =>
                      trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_guided_template_click, {
                        page: 'home',
                        template_id: template.id,
                        template_name: template.name,
                        action: 'browse_ats',
                        ...landingAbParams(),
                      })
                    }
                  >
                    Browse ATS templates
                  </Link>
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground flex items-start gap-2">
                <BadgeCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                <span>
                  Opens the editor with starter content so you’re not staring at a blank page.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
