# FitCV Execution Progress

Updated: 2026-04-15

## Phase Status

- Phase 1: Template foundation + catalog contract — Completed
- Phase 2: Template gallery UX + swipe modal + local original previews + funnel events — Completed
- Phase 3: CI hardening (template contract + Lighthouse budget gates) — Completed
- Phase 4: Blog engagement instrumentation (read complete, helpful votes, share/related analytics) — Completed
- Phase 5: Onboarding walkthrough trigger + replay entry points (header, dashboard, editor) — Completed
- Phase 6: Mobile performance and all-device polish — Completed
- Phase 7: CLS/LCP remediation (auth shell stability, route transitions, font fallbacks) — Completed
- Phase 8: Production observation loop (Core Web Vitals → GA / PostHog alongside Sentry) — Completed

## Latest Delivered

- Central template catalog and parity tests
- Swipeable template preview modal with sticky CTA
- Local branded template preview assets under `public/images/templates`
- CI quality gates for template contract and Lighthouse budgets
- Blog engagement event coverage
- Walkthrough replay access from user menu, dashboard, and editor
- Mobile interview controls aligned to 44px touch target guidance
- Blog long-content mobile wrapping and blockquote rendering polish
- CI workflow fix: Playwright Chromium installation added before E2E step
- Local E2E validation: `npx playwright test` passed (5/5)
- Header auth area: reserved desktop width + mobile sheet placeholders while Firebase resolves (reduces CLS)
- Page transitions: opacity-only route changes (no vertical offset) for fewer layout shifts
- `next/font` explicit `adjustFontFallback` on all Google families used in the root layout
- `web_vital` analytics events (`CLS`, `LCP`, `INP`, `FCP`, `TTFB`) in production for GA4 / PostHog / dataLayer

## Next Focus

- Watch Lighthouse CI and GA4 / PostHog for `web_vital` + blog funnels (`blog_read_complete`, `blog_helpful_vote`, CTAs); tighten budgets if regressions appear
