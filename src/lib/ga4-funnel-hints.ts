/**
 * GA4 / GTM “Explorations” hints for FitCV landing funnels.
 * GA4 UI changes over time — treat this as a checklist, not an automation API.
 */

export const GA4_FUNNEL_HOMEPAGE_ACQUISITION_V1 = {
  name: 'Homepage → template/editor intent (custom events)',
  prerequisites: [
    'Register custom dimensions for event parameters you care about (GA4 Admin → Custom definitions).',
    'Suggested params already emitted by the app: hero_primary_ab, hero_secondary_ab, depth_pct, template_id, destination, target, tertiary_id.',
  ],
  explorationSteps: [
    {
      title: '1) Assignment + exposure',
      ga4Step: 'Event name exactly matches `landing_hero_ab_exposure`',
      segmentTip: 'Add comparison: `hero_primary_ab` = control vs ats_picker',
    },
    {
      title: '2) Primary CTA click',
      ga4Step: 'Event name exactly matches `landing_hero_primary_click`',
      segmentTip: 'Break down by `destination` and `hero_primary_ab`',
    },
    {
      title: '3) Mid-funnel attention',
      ga4Step: 'Event name exactly matches `landing_scroll_depth` where `depth_pct` = 50 (or 75)',
      segmentTip: 'Use as a proxy for “read past hero”',
    },
    {
      title: '4) Guided start (high intent)',
      ga4Step: 'Event name exactly matches `landing_guided_template_click`',
      segmentTip: 'Break down by `action` (editor_start vs browse_ats) and `template_id`',
    },
    {
      title: '5) Editor entry (off-site of landing but linked)',
      ga4Step: 'Use your existing editor/template events (e.g. template_use_click) if configured in those routes',
      segmentTip: 'Join in BigQuery/Looker if you need strict sequential funnels across routes',
    },
  ],
} as const;

export const POSTHOG_FUNNEL_HOMEPAGE_V1 = {
  name: 'PostHog funnel (same event names as GA4 dataLayer pushes)',
  steps: [
    'landing_hero_ab_exposure',
    'landing_hero_primary_click',
    'landing_scroll_depth', // filter depth_pct >= 50
    'landing_guided_template_click',
  ],
  cohortSuggestion: 'Create cohort: first URL contains `/` and first event is landing_hero_ab_exposure',
} as const;

/** `/about` story page — find where attention drops between sections. */
export const GA4_ABOUT_STORY_FUNNEL_V1 = {
  name: 'About page story engagement',
  events: [
    {
      name: 'about_scroll_depth',
      params: ['page=about', 'depth_pct', 'hero_primary_ab', 'hero_secondary_ab'],
      explorationTip: 'Compare depth_pct=50 vs 75 by traffic source to see if the story holds attention.',
    },
    {
      name: 'about_section_view',
      params: ['page=about', 'section_id', 'hero_primary_ab', 'hero_secondary_ab'],
      explorationTip:
        'Build a funnel ordered by `section_id` (about-hook → about-close). Large drop-offs between adjacent sections indicate copy/layout friction.',
    },
    {
      name: 'about_cta_click',
      params: ['page=about', 'section_id', 'cta_id', 'destination', 'hero_primary_ab', 'hero_secondary_ab'],
      explorationTip: 'Correlate proof/close clicks with prior `about_section_view` on `about-proof` and `about-close`.',
    },
  ],
  sectionOrder: [
    'about-hook',
    'about-problem',
    'about-insight',
    'about-origin',
    'about-differentiation',
    'about-proof',
    'about-trust',
    'about-close',
  ],
} as const;
