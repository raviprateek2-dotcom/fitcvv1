# FitCV Execution Progress

Updated: 2026-04-18

## Phase Status

- Phase 1: Template foundation + catalog contract — Completed
- Phase 2: Template gallery UX + swipe modal + local original previews + funnel events — Completed
- Phase 3: CI hardening (template contract + Lighthouse budget gates) — Completed
- Phase 4: Blog engagement instrumentation (read complete, helpful votes, share/related analytics) — Completed
- Phase 5: Onboarding walkthrough trigger + replay entry points (header, dashboard, editor) — Completed
- Phase 6: Mobile performance and all-device polish — Completed
- Phase 7: CLS/LCP remediation (auth shell stability, route transitions, font fallbacks) — Completed
- Phase 8: Production observation loop (Core Web Vitals → GA / PostHog alongside Sentry) — Completed
- Phase 9: Monitoring runbook + production branch alignment — Completed
- Phase 10: Job Tracker activation and retention loop — Completed
- Phase 11: Metrics baseline + alert thresholds — Completed (operationalized)
- Phase 12: Job Tracker conversion optimization sprint — Completed
- Phase 13: Performance budget tightening and route-level remediation — Completed
- Phase 14: Growth loop hardening (blog -> CTA -> signup) — Completed
- Phase 15: Production baseline capture and operating handoff — Planned
- Phase 16: Job Tracker experiment loop — Planned
- Phase 17: Route-level performance sprint — Planned
- Phase 18: Growth loop optimization — Planned

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
- Phase 9: `docs/operations-p1-runbook.md` §6 documents event names, tooling, and cadence for web vitals and blog funnels.
- Phase 10: Job board quick stage actions (`saved -> applied`, `applied -> interview`, `interview -> offer/rejected`) and follow-up reminder states (today, overdue, this week).
- Phase 10: New `job_*` analytics events (`job_tracker_open`, `job_added`, `job_stage_changed`, follow-up events) and source-aware entry CTAs from dashboard, editor, and interview flows.
- Phase 11: baseline + threshold checklist added for web vitals, blog engagement, and job-tracker conversion metrics.
- Phase 12 WIP: Job Tracker quick-add flow now supports required-only capture (company + role) with optional details toggles, reducing first-entry friction.
- Phase 12 WIP: `job_added` now includes `quick_add` signal for conversion analysis.
- Phase 12 WIP: Post-create enrichment prompt added for quick-add jobs, with `job_add_enrich_start` and `job_add_enrich_complete` events.
- Phase 12 WIP: Enrichment prompt now supports snooze/re-surface behavior and completion confirmation toast; `job_add_enrich_snoozed` event added.
- Phase 13: Lighthouse budgets tightened (`categories:performance`, `largest-contentful-paint`, and interactive blocking checks).
- Phase 14: Blog listing/post CTAs now emit source-aware `cta_get_started` / `cta_signup` and `blog_cta_click` analytics with attribution query params.

## Steady state (ongoing)

- Use runbook §6 and Lighthouse CI on `main` to watch `web_vital` and blog funnels; tighten `lighthouserc.json` only when justified by regressions.

## Active phase

- Phase 15-18 roadmap: `docs/phase-15-18-roadmap.md`

## Progress checklist

- Phase 11 checklist: `docs/phase-11-observability-plan.md`
  - [x] Baseline snapshot template created (`docs/phase-11-baseline-template.md`)
  - [x] Weekly review log template created (`docs/phase-11-weekly-review-log.md`)
  - [x] First baseline window initialized (2026-04-10 to 2026-04-17)
  - [x] First weekly review entry initialized (`docs/phase-11-weekly-review-log.md`)
  - [x] Data collection playbook created (`docs/phase-11-data-collection-playbook.md`)
  - [x] Escalation SLA + anomaly issue template created (`docs/operations-p1-runbook.md`, `docs/phase-11-anomaly-issue-template.md`)
  - [x] Closeout checklist created (`docs/phase-11-closeout-checklist.md`)
  - [x] Capture workflow prepared for first real 7-day baseline snapshot (`docs/phase-11-baseline-template.md` + playbook)
  - [x] Validate threshold owners + escalation action
  - [x] Weekly review workflow initialized and ready for recurring anomaly logs (`docs/phase-11-weekly-review-log.md`)
- Phase 12 spec: `docs/phase-12-job-tracker-optimization-plan.md`
- Phase 13 spec: `docs/phase-13-performance-tightening-plan.md`
- Phase 14 spec: `docs/phase-14-growth-loop-plan.md`
- Phase 15-18 roadmap: `docs/phase-15-18-roadmap.md`
