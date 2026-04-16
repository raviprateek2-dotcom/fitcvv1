/**
 * Client-side analytics for `/about` story journey (scroll depth + section visibility).
 * Complements `trackEvent()` in `@/lib/analytics-events` (GA4 / dataLayer / PostHog when configured).
 */

export const ABOUT_ANALYTICS_EVENTS = {
  about_scroll_depth: 'about_scroll_depth',
  about_section_view: 'about_section_view',
} as const;
