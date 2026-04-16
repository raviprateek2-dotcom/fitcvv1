'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics-events';
import { LANDING_CRO_ANALYTICS_EVENTS } from '@/lib/landing-cro-spec';
import { landingAbParams } from '@/lib/landing-ab-config';

type HeroLandingCtasProps = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function HeroLandingCtas({ primaryHref, primaryLabel, secondaryHref, secondaryLabel }: HeroLandingCtasProps) {
  const exposedRef = useRef(false);

  useEffect(() => {
    if (exposedRef.current) return;
    exposedRef.current = true;
    trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_hero_ab_exposure, {
      page: 'home',
      ...landingAbParams(),
    });
  }, []);

  const ab = landingAbParams();

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row justify-center pt-2 sm:pt-4 w-full max-w-md sm:max-w-none sm:px-0">
        <Link
          href={primaryHref}
          className={cn(
            buttonVariants({ variant: 'premium', size: 'lg' }),
            'min-h-[52px] h-auto py-3.5 px-6 sm:px-8 text-base rounded-full w-full sm:w-auto inline-flex items-center justify-center group',
          )}
          onClick={() =>
            trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_hero_primary_click, {
              page: 'home',
              destination: primaryHref,
              ...ab,
            })
          }
        >
          {primaryLabel}
          <ArrowRight
            className="ml-2 h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform motion-reduce:transition-none"
            aria-hidden
          />
        </Link>
        <Link
          href={secondaryHref}
          className={cn(
            buttonVariants({ variant: 'glass', size: 'lg' }),
            'min-h-[52px] h-auto py-3.5 px-6 sm:px-8 text-base rounded-full border-primary/20 hover:border-primary/40 w-full sm:w-auto inline-flex items-center justify-center',
          )}
          onClick={() =>
            trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_hero_secondary_click, {
              page: 'home',
              destination: secondaryHref,
              ...ab,
            })
          }
        >
          {secondaryLabel}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
        <Link
          href="#features"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          onClick={() =>
            trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_hero_tertiary_click, {
              page: 'home',
              tertiary_id: 'see_ai_features',
              ...ab,
            })
          }
        >
          See what the AI helps with
        </Link>
        <span className="hidden sm:inline text-muted-foreground/40" aria-hidden>
          •
        </span>
        <Link
          href="/templates/ats"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          onClick={() =>
            trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_hero_tertiary_click, {
              page: 'home',
              tertiary_id: 'browse_ats_layouts',
              ...ab,
            })
          }
        >
          Browse ATS-focused layouts
        </Link>
      </div>
    </>
  );
}
