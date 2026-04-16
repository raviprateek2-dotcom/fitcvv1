'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { trackEvent } from '@/lib/analytics-events';
import { LANDING_CRO_ANALYTICS_EVENTS } from '@/lib/landing-cro-spec';
import { landingAbParams } from '@/lib/landing-ab-config';

export function LandingResumeScoreTeaser() {
  return (
    <section className="relative w-full py-14 sm:py-20 md:py-24 bg-white/[0.02] dark:bg-black/[0.02] border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Before you hit “apply”</p>
            <h2 className="mt-3 text-3xl font-headline font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              See the gap between your resume and the job description
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg leading-relaxed">
              FitCV is built around a simple loop: paste a JD, tighten wording, re-check structure, repeat. The goal isn’t a vanity score — it’s fewer “silent rejections.”
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="rounded-full w-full sm:w-auto">
                <Link
                  href="/templates"
                  onClick={() =>
                    trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_score_teaser_click, {
                      page: 'home',
                      destination: '/templates',
                      ...landingAbParams(),
                    })
                  }
                >
                  Build a resume
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full w-full sm:w-auto">
                <Link
                  href="#features"
                  onClick={() =>
                    trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_score_teaser_click, {
                      page: 'home',
                      destination: '#features',
                      ...landingAbParams(),
                    })
                  }
                >
                  Explore AI tools
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Illustration only — your real match checks run in the product against your content and the posting you provide.
            </p>
          </div>

          <div className="lg:col-span-7">
            <Card className="border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="h-5 w-5 text-primary" aria-hidden />
                  Job match snapshot
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  A quick read on keyword coverage + section clarity — the two places most resumes quietly fail.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">Keyword coverage</div>
                    <div className="text-sm font-black text-primary">72%</div>
                  </div>
                  <Progress value={72} aria-label="Illustrative keyword coverage meter" />
                  <p className="text-xs text-muted-foreground">
                    Strong overlap on role fundamentals; a few posting-specific phrases are missing.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">Section clarity</div>
                    <div className="text-sm font-black text-teal-600 dark:text-teal-400">High</div>
                  </div>
                  <Progress value={88} aria-label="Illustrative section clarity meter" />
                  <p className="text-xs text-muted-foreground">
                    Headings and bullets are readable for both humans and parsers — tighten impact next.
                  </p>
                </div>

                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 flex gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">Suggested next edit</div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      Rewrite 2 bullets to mirror the posting’s language — especially the outcomes the JD repeats.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
