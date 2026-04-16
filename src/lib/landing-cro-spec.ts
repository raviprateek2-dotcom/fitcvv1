/**
 * FitCV landing CRO — analytics catalog, A/B backlog, and a lightweight 100-user simulation artifact.
 * Kept as TypeScript (not markdown) so it ships with the repo and stays type-checkable alongside product code.
 *
 * GA4 / PostHog funnel “how to build it” checklist: `src/lib/ga4-funnel-hints.ts`
 */

export const LANDING_CRO_ANALYTICS_EVENTS = {
  landing_hero_ab_exposure: 'landing_hero_ab_exposure',
  landing_hero_primary_click: 'landing_hero_primary_click',
  landing_hero_secondary_click: 'landing_hero_secondary_click',
  landing_hero_tertiary_click: 'landing_hero_tertiary_click',
  landing_scroll_depth: 'landing_scroll_depth',
  landing_exit_intent_open: 'landing_exit_intent_open',
  landing_exit_intent_dismiss: 'landing_exit_intent_dismiss',
  landing_exit_intent_cta: 'landing_exit_intent_cta',
  landing_sticky_cta_view: 'landing_sticky_cta_view',
  landing_sticky_cta_click: 'landing_sticky_cta_click',
  landing_desktop_fab_view: 'landing_desktop_fab_view',
  landing_desktop_fab_click: 'landing_desktop_fab_click',
  landing_guided_template_click: 'landing_guided_template_click',
  landing_score_teaser_click: 'landing_score_teaser_click',
} as const;

export type LandingCroAnalyticsEventName = (typeof LANDING_CRO_ANALYTICS_EVENTS)[keyof typeof LANDING_CRO_ANALYTICS_EVENTS];

/**
 * Suggested GA4 custom dimensions / user properties to add in the console (names are suggestions).
 * `section_id` is used by `/about` (`about_section_view`).
 */
export const LANDING_CRO_GA4_DIMENSIONS = [
  'landing_surface',
  'page',
  'hero_primary_ab',
  'hero_secondary_ab',
  'destination',
  'tertiary_id',
  'template_id',
  'depth_pct',
  'cta_surface',
  'target',
  'action',
  'section_id',
] as const;

export const LANDING_CRO_AB_TEST_PLAN_V1 = [
  {
    id: 'hero_primary_cta_destination',
    hypothesis: 'Routing cold traffic to `/templates/ats` may reduce choice overload versus `/templates`.',
    control: { label: 'Choose a template — start free', href: '/templates' },
    variant: { label: 'Start with ATS layouts', href: '/templates/ats' },
    primaryMetric: 'landing_to_editor_start_rate',
    guardrailMetric: 'bounce_rate',
    implementation: {
      envVar: 'NEXT_PUBLIC_LANDING_AB_HERO_PRIMARY',
      values: { control: 'control (default)', variant: 'ats_picker' },
    },
  },
  {
    id: 'hero_secondary_cta',
    hypothesis: 'A softer secondary CTA increases scroll without reducing primary clicks.',
    control: { label: 'Quick start (blank editor)', href: '/editor/new' },
    variant: { label: 'See a 60-second demo', href: '#how-it-works' },
    primaryMetric: 'scroll_depth_75_pct',
    guardrailMetric: 'landing_to_template_click_rate',
    implementation: {
      envVar: 'NEXT_PUBLIC_LANDING_AB_HERO_SECONDARY',
      values: { control: 'control (default)', variant: 'demo_anchor' },
    },
  },
  {
    id: 'guided_templates_count',
    hypothesis: 'Three guided cards beat six for first-session completion.',
    control: { picks: 3 },
    variant: { picks: 6 },
    primaryMetric: 'landing_guided_template_click_rate',
    guardrailMetric: 'time_to_first_meaningful_scroll',
  },
] as const;

/**
 * Synthetic qualitative simulation (not statistical truth).
 * Use it to prioritize instrumentation + UX experiments, then replace assumptions with real funnel data.
 */
export const LANDING_CRO_SIMULATION_100_USERS_V1 = {
  cohortSize: 100,
  segments: [
    { id: 'cold_job_seeker', share: 0.55, traits: ['mobile-heavy', 'skims hero', 'fears rejection'] },
    { id: 'switching_tool', share: 0.25, traits: ['desktop', 'compares features', 'ATS sensitive'] },
    { id: 'returning_visitor', share: 0.2, traits: ['higher intent', 'may skip hero'] },
  ],
  funnel: [
    { step: 'land', label: 'Landed on home', modeledContinue: 1.0, topFriction: 'none' },
    { step: 'scroll_50', label: 'Reached mid-page', modeledContinue: 0.62, topFriction: 'unclear “what first?”' },
    { step: 'template_intent', label: 'Clicked templates / guided pick', modeledContinue: 0.34, topFriction: 'choice overload on `/templates`' },
    { step: 'editor_open', label: 'Opened editor', modeledContinue: 0.22, topFriction: 'signup/guest confusion' },
    { step: 'first_edit', label: 'Made first meaningful edit', modeledContinue: 0.14, topFriction: 'blank-page stall' },
  ],
  outcomes: {
    biggestLiftIdeas: [
      'Keep hero typing off LCP; keep one obvious primary CTA.',
      'Offer 3 guided starts + deep-link to `/editor/new?template=…`.',
      'Add sticky mobile CTA that hides at final CTA (reduces annoyance + conflict).',
      'Instrument scroll depth + exit intent to validate where attention dies.',
    ],
    watchouts: [
      'Exit intent can harm brand if shown twice or on mobile; cap to once/session and desktop-only.',
      'Floating CTAs can hurt accessibility; keep focus traps inside dialogs only.',
    ],
  },
} as const;
