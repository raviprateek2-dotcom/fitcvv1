'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics-events';
import { LANDING_CRO_ANALYTICS_EVENTS } from '@/lib/landing-cro-spec';
import { useLandingFinalCtaVisible } from '@/components/home/LandingFinalCtaVisibility';
import { landingAbParams } from '@/lib/landing-ab-config';

export function LandingDesktopScrollCta() {
  const finalCtaVisible = useLandingFinalCtaVisible();
  const [open, setOpen] = useState(false);
  const viewedRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setOpen(y > 560 && !finalCtaVisible);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [finalCtaVisible]);

  useEffect(() => {
    if (!open || viewedRef.current) return;
    viewedRef.current = true;
    trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_desktop_fab_view, { page: 'home', ...landingAbParams() });
  }, [open]);

  return (
    <div
      className={cn(
        'hidden md:flex fixed bottom-8 right-8 z-40 flex-col gap-2 transition-all duration-300 motion-reduce:transition-none',
        open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <Button asChild size="sm" className="rounded-full shadow-lg">
        <Link
          href="/templates"
          onClick={() =>
            trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_desktop_fab_click, {
              page: 'home',
              target: 'templates',
              ...landingAbParams(),
            })
          }
        >
          Templates
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </Link>
      </Button>
      <Button asChild size="sm" variant="outline" className="rounded-full shadow-lg bg-background/80 backdrop-blur">
        <Link
          href="/editor/new"
          onClick={() =>
            trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_desktop_fab_click, {
              page: 'home',
              target: 'editor_new',
              ...landingAbParams(),
            })
          }
        >
          Quick start
        </Link>
      </Button>
    </div>
  );
}
