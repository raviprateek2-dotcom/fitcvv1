#!/usr/bin/env node
/**
 * Prints GA4 / PostHog setup reminders (no network). Run: npm run analytics:checklist
 */

const lines = [
  'FitCV analytics — manual setup checklist',
  '',
  '1) GA4 Admin → Custom definitions (event-scoped)',
  '   Register parameters you will break down in reports:',
  '   - hero_primary_ab, hero_secondary_ab (landing A/B)',
  '   - depth_pct (home + about scroll milestones)',
  '   - section_id (about_section_view)',
  '   - cta_id, destination (about_cta_click)',
  '   - template_id, action (landing_guided_template_click)',
  '',
  '2) Home funnel (custom events)',
  '   - landing_hero_ab_exposure → landing_hero_primary_click → landing_scroll_depth (50/75)',
  '   - landing_guided_template_click',
  '',
  '3) About funnel',
  '   - about_section_view (order: about-hook … about-close) — see src/lib/ga4-funnel-hints.ts',
  '   - about_scroll_depth + about_cta_click',
  '',
  '3b) Templates catalog',
  '   - templates_catalog_view, templates_url_sync (has_query, filter_count)',
  '   - templates_filter_reset, templates_preview_open/close/nav',
  '',
  '4) PostHog',
  '   - Same event names as gtag/dataLayer pushes from trackEvent()',
  '',
  '5) Vercel env for first hero A/B',
  '   - NEXT_PUBLIC_LANDING_AB_HERO_PRIMARY=control | ats_picker',
  '   - NEXT_PUBLIC_LANDING_AB_HERO_SECONDARY=control | demo_anchor',
  '',
];

console.log(lines.join('\n'));
