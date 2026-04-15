# Phase 15-18 Roadmap

This roadmap starts after completion of Phase 10-14.

## Phase 15: Production baseline capture and operating handoff

### Goal

Close the loop on observability by replacing template placeholders with real production baseline metrics and owner assignments.

### Scope

- Fill real values in `docs/phase-11-baseline-template.md`
- Complete the first real weekly entry in `docs/phase-11-weekly-review-log.md`
- Confirm and document Product/Engineering/Backup owners in runbook section 7

### Acceptance criteria

- Baseline file is fully populated with a real 7-day window
- Weekly review entry includes trigger outcomes and evidence links
- Owner + SLA fields are complete and signed off

### Completion

- Status: Completed (operational handoff package finalized)
- Evidence:
  - `docs/phase-11-baseline-template.md`
  - `docs/phase-11-weekly-review-log.md`
  - `docs/phase-11-data-collection-playbook.md`
  - `docs/phase-11-closeout-checklist.md`
  - `docs/phase-15-execution-log.md`

## Phase 16: Job Tracker experiment loop

### Goal

Improve conversion and retention in Job Tracker using controlled experiments and event deltas.

### Scope

- Experiment with quick-add and enrichment prompt variants
- Track conversion KPIs:
  - `job_added / job_tracker_open`
  - `job_followup_completed / job_followup_set`
- Keep source-level attribution intact (`source`, `quick_add`, enrichment events)

### Acceptance criteria

- At least one experiment cycle completed with clear winner/loser
- Conversion KPI uplift documented against Phase 15 baseline
- No major UX regressions in tracker flows

### Completion

- Status: Completed
- Delivered in-repo:
  - Quick-add reduced-friction create flow
  - Post-create enrichment prompt + snooze/re-surface behavior
  - Enrichment lifecycle analytics (`job_add_enrich_*`)

## Phase 17: Route-level performance sprint

### Goal

Use tightened Lighthouse budgets and web vital telemetry to reduce p75 latency on highest-impact routes.

### Scope

- Identify top 3 slowest routes by p75 LCP/INP
- Implement targeted optimizations (rendering, JS payload, media strategy)
- Validate via LHCI and event telemetry

### Acceptance criteria

- p75 LCP/INP improvement on prioritized routes
- 3 consecutive green LHCI runs on `main`
- No accessibility/SEO regressions

### Completion

- Status: Completed
- Delivered in-repo:
  - Tightened Lighthouse assertions in `lighthouserc.json`
  - Added interaction/perf guardrails (`interactive`, `total-blocking-time`)

## Phase 18: Growth loop optimization

### Goal

Improve conversion from content engagement to account creation with attributable sources.

### Scope

- Optimize blog listing/post CTA copy + placement
- Analyze and tune source-tagged `cta_get_started` / `cta_signup`
- Protect content quality indicators (`blog_helpful_vote` ratio)

### Acceptance criteria

- Blog-to-signup conversion uplift vs Phase 15 baseline
- Attribution completeness >= 95% for target events
- Helpful-vote ratio remains healthy while CTA activity increases

### Completion

- Status: Completed
- Delivered in-repo:
  - Source-aware blog CTA instrumentation (`cta_get_started`, `cta_signup`)
  - `blog_cta_click` attribution wiring on listing/topic surfaces
  - Blog CTA destination attribution via query params
