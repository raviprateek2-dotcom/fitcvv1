'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trackEvent } from '@/lib/analytics-events';
import { LANDING_CRO_ANALYTICS_EVENTS } from '@/lib/landing-cro-spec';
import { useLandingFinalCtaVisible } from '@/hooks/use-landing-final-cta-visible';
import { landingAbParams } from '@/lib/landing-ab-config';

const SCROLL_DEPTHS = [25, 50, 75, 100] as const;
const EXIT_INTENT_FIRED_KEY = 'fitcv:landing-exit-intent-fired';

function safeSessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function LandingCroTriggers() {
  const finalCtaVisible = useLandingFinalCtaVisible();
  const [exitOpen, setExitOpen] = useState(false);
  const armedRef = useRef(false);
  const closeReasonRef = useRef<'cta' | null>(null);

  // One-way scroll depth milestones (session-persisted)
  useEffect(() => {
    const fired = new Set<number>();
    for (const d of SCROLL_DEPTHS) {
      if (safeSessionGet(`fitcv:landing-scroll-${d}`) === '1') fired.add(d);
    }

    let ticking = false;
    const flush = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const winH = window.innerHeight;
      const docH = Math.max(doc.scrollHeight, doc.offsetHeight, doc.clientHeight);
      const denom = Math.max(1, docH - winH);
      const pct = (scrollTop / denom) * 100;

      for (const d of SCROLL_DEPTHS) {
        if (fired.has(d)) continue;
        if (pct >= d - 0.75) {
          fired.add(d);
          safeSessionSet(`fitcv:landing-scroll-${d}`, '1');
          trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_scroll_depth, {
            depth_pct: d,
            page: 'home',
            ...landingAbParams(),
          });
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(flush);
      }
    };

    flush();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Exit intent: desktop-only, coarse-pointer skip, delayed arming, once per session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(pointer: coarse)')?.matches) return;
    if (window.matchMedia?.('(max-width: 767px)')?.matches) return;

    const t = window.setTimeout(() => {
      armedRef.current = true;
    }, 4500);

    return () => window.clearTimeout(t);
  }, []);

  const tryOpenExitIntent = useCallback(() => {
    if (!armedRef.current) return;
    if (finalCtaVisible) return;
    if (safeSessionGet(EXIT_INTENT_FIRED_KEY) === '1') return;

    safeSessionSet(EXIT_INTENT_FIRED_KEY, '1');
    setExitOpen(true);
    trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_exit_intent_open, { page: 'home', ...landingAbParams() });
  }, [finalCtaVisible]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(pointer: coarse)')?.matches) return;
    if (window.matchMedia?.('(max-width: 767px)')?.matches) return;

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      if (e.clientY > 28) return;
      tryOpenExitIntent();
    };

    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, [tryOpenExitIntent]);

  return (
    <Dialog
      open={exitOpen}
      onOpenChange={(next) => {
        if (!next) {
          if (closeReasonRef.current !== 'cta') {
            trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_exit_intent_dismiss, {
              page: 'home',
              ...landingAbParams(),
            });
          }
          closeReasonRef.current = null;
        }
        setExitOpen(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Want a faster path to a strong first draft?</DialogTitle>
          <DialogDescription>
            Start with an ATS-friendly layout, then tighten bullets with JD-aware checks — without hunting through hundreds of templates first.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild className="rounded-full">
            <Link
              href="/templates/ats"
              onClick={() => {
                closeReasonRef.current = 'cta';
                trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_exit_intent_cta, {
                  page: 'home',
                  destination: '/templates/ats',
                  ...landingAbParams(),
                });
              }}
            >
              Open ATS picker
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link
              href="/templates"
              onClick={() => {
                closeReasonRef.current = 'cta';
                trackEvent(LANDING_CRO_ANALYTICS_EVENTS.landing_exit_intent_cta, {
                  page: 'home',
                  destination: '/templates',
                  ...landingAbParams(),
                });
              }}
            >
              Browse all templates
            </Link>
          </Button>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              setExitOpen(false);
            }}
          >
            Keep browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
