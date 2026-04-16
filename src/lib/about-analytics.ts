/**
 * Client-side analytics for `/about` story journey (scroll depth + section visibility).
 * Complements `trackEvent()` in `@/lib/analytics-events` (GA4 / dataLayer / PostHog when configured).
 */

import { trackEvent } from '@/lib/analytics-events';
import { landingAbParams } from '@/lib/landing-ab-config';

export const ABOUT_ANALYTICS_EVENTS = {
  about_scroll_depth: 'about_scroll_depth',
  about_section_view: 'about_section_view',
  about_cta_click: 'about_cta_click',
} as const;

export function trackAboutCta(params: {
  section_id: string;
  destination: string;
  /** Short label for dashboards, e.g. primary_templates */
  cta_id: string;
}): void {
  trackEvent(ABOUT_ANALYTICS_EVENTS.about_cta_click, {
    page: 'about',
    section_id: params.section_id,
    destination: params.destination,
    cta_id: params.cta_id,
    ...landingAbParams(),
  });
}
