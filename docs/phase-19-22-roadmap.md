# Phase 19-22 Roadmap

This roadmap starts after completion of Phase 1-18.

## Phase 19: Insight-to-action automation

### Goal

Reduce manual monitoring overhead by standardizing and automating recurring anomaly review outputs.

### Scope

- Generate weekly anomaly summary from tracked signals (`web_vital`, blog funnel, job tracker funnel)
- Standardize issue creation path from threshold breach to assignment
- Add repeatable status output format for leadership review

### Acceptance criteria

- Weekly review can be produced with a single runbook-driven workflow
- Anomaly issues include consistent severity, owner, and ETA fields
- Time-to-triage decreases versus prior manual process

### Completion

- Status: Completed
- Evidence:
  - `docs/phase-19-anomaly-summary-template.md`
  - `docs/phase-11-anomaly-issue-template.md`
  - `docs/phase-11-weekly-review-log.md`

## Phase 20: Job Tracker experiment iteration 2

### Goal

Drive another measurable uplift in Job Tracker conversion and follow-up completion with controlled experiments.

### Scope

- Run A/B variants for quick-add and enrichment prompt timing/copy
- Compare conversion by source and enrichment path
- Keep instrumentation parity (`quick_add`, enrich start/complete/snooze)

### Acceptance criteria

- At least one statistically meaningful experiment result documented
- `job_added / job_tracker_open` improves vs Phase 16 baseline
- `job_followup_completed / job_followup_set` improves without UX regressions

### Completion

- Status: Completed
- Evidence:
  - `docs/phase-20-experiment-log.md`
  - Job tracker quick-add and enrichment instrumentation already landed in app code

## Phase 21: Route-cluster performance deep-dive

### Goal

Sustain performance gains by attacking the highest-impact route clusters using profiling evidence.

### Scope

- Prioritize route clusters by traffic x p75 pain (LCP/INP)
- Apply route-specific optimizations (payload, render strategy, interaction handlers)
- Verify with LHCI and runtime telemetry

### Acceptance criteria

- p75 LCP/INP improved on selected clusters
- No regression in accessibility/SEO budgets
- 3+ consecutive healthy CI signals post-change

### Completion

- Status: Completed
- Evidence:
  - `docs/phase-21-performance-cluster-log.md`
  - tightened LHCI constraints in `lighthouserc.json`

## Phase 22: Full-funnel attribution quality

### Goal

Optimize for high-quality signup outcomes, not just top-of-funnel clicks.

### Scope

- Extend attribution from CTA clicks to signup outcomes and downstream activation
- Build cohort views by source/surface
- Identify and prioritize high-quality acquisition paths

### Acceptance criteria

- Attribution coverage for target funnel events >= 95%
- Source-to-activation reporting is available for weekly review
- At least one surface optimization decision made from cohort evidence

### Completion

- Status: Completed
- Evidence:
  - `docs/phase-22-attribution-quality-checklist.md`
  - source-aware blog CTA instrumentation in blog listing/post surfaces
