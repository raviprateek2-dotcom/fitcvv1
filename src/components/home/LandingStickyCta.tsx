'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics-events';
import { LANDING_CRO_ANALYTICS_EVENTS } from '@/lib/landing-cro-spec';
import { useLandingFinalCtaVisible } from '@/hooks/use-landing-final-cta-visible';
import { landingAbParams } from '@/lib/landing-ab-config';

export function LandingStickyCta() {
  const finalCtaVisible = useLandingFinalCtaVisible();
  const [scrolled, setScrolled] = useState(false);
  const viewedRef = useRef(false);

  const show = useMemo(() => scrolled && !finalCtaVisible, [scrolled, finalCtaVisible]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 520);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!show || viewedRef.current) return;
    viewedRef.current = true;
    trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_sticky_cta_view, { page: 'home', ...landingAbParams() });
  }, [show]);

  return (
    <div
      className={cn(
        'md:hidden fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-2 pointer-events-none transition-all duration-300',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
      )}
      aria-hidden={!show}
    >
      <div
        className={cn(
          'mx-auto max-w-md rounded-2xl border border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-lg shadow-black/10 pointer-events-auto',
          !show && 'pointer-events-none',
        )}
      >
        <div className="p-3 sm:p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-bold font-headline leading-snug truncate">Ready to start?</div>
              <div className="text-xs text-muted-foreground leading-snug">Pick a template — edit in minutes.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="sm" className="rounded-full w-full">
              <Link
                href="/templates"
                onClick={() =>
                  trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_sticky_cta_click, {
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
            <Button asChild size="sm" variant="outline" className="rounded-full w-full">
              <Link
                href="/editor/new"
                onClick={() =>
                  trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_sticky_cta_click, {
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
        </div>
      </div>
    </div>
  );
}
