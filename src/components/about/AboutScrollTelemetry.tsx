'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics-events';
import { ABOUT_ANALYTICS_EVENTS } from '@/lib/about-analytics';
import { landingAbParams } from '@/lib/landing-ab-config';

const SCROLL_DEPTHS = [25, 50, 75, 100] as const;

const SECTION_IDS = [
  'about-hook',
  'about-problem',
  'about-insight',
  'about-origin',
  'about-differentiation',
  'about-proof',
  'about-trust',
  'about-close',
] as const;

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

/**
 * Scroll-depth + first-time section impressions for `/about` (session de-dupe).
 * Retries attachment because lower sections may load via `next/dynamic` after first paint.
 */
export function AboutScrollTelemetry() {
  // Scroll depth milestones
  useEffect(() => {
    const fired = new Set<number>();
    for (const d of SCROLL_DEPTHS) {
      if (safeSessionGet(`fitcv:about-scroll-${d}`) === '1') fired.add(d);
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
          safeSessionSet(`fitcv:about-scroll-${d}`, '1');
          trackEvent(ABOUT_ANALYTICS_EVENTS.about_scroll_depth, {
            page: 'about',
            depth_pct: d,
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

  // Section impressions (dynamic-safe)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const seen = new Set<string>();
    const wiredIds = new Set<string>();
    const observers: IntersectionObserver[] = [];

    const tryAttach = (id: (typeof SECTION_IDS)[number]) => {
      if (wiredIds.has(id)) return;

      const sessionKey = `fitcv:about-section-${id}`;
      if (safeSessionGet(sessionKey) === '1') {
        wiredIds.add(id);
        return;
      }

      const el = document.getElementById(id);
      if (!el) return;

      wiredIds.add(id);

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting || seen.has(id)) return;
          seen.add(id);
          safeSessionSet(sessionKey, '1');
          trackEvent(ABOUT_ANALYTICS_EVENTS.about_section_view, {
            page: 'about',
            section_id: id,
            ...landingAbParams(),
          });
          observer.disconnect();
        },
        { root: null, threshold: 0.28 },
      );

      observer.observe(el);
      observers.push(observer);
    };

    const attemptAll = () => SECTION_IDS.forEach((id) => tryAttach(id));

    attemptAll();
    const delays = [0, 400, 1000, 2200, 4000];
    const timers = delays.map((ms) => window.setTimeout(attemptAll, ms));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}
