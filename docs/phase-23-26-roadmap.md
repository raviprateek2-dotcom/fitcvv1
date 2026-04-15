# Phase 23-26 Roadmap

This roadmap begins after closure of Phase 1-22.

## Phase 23: Operational cadence activation

### Goal

Turn existing observability artifacts into an actual weekly operating routine.

### Scope

- Run recurring weekly review using:
  - `docs/phase-11-weekly-review-log.md`
  - `docs/phase-19-anomaly-summary-template.md`
- Enforce threshold breach workflow from runbook section 7
- Ensure anomalies are tracked with consistent severity and owner fields

### Acceptance criteria

- Two consecutive weekly reviews completed
- At least one anomaly workflow dry-run executed end-to-end
- Owner assignment and SLA adherence verified

## Phase 24: Job Tracker conversion uplift v3

### Goal

Increase activation and retention with a tighter quick-add to enriched-tracker flow.

### Scope

- Iterate on quick-add + enrichment prompt behavior
- Improve source-level conversion from entry point to created job
- Improve follow-up completion after reminder set

### Acceptance criteria

- `job_added / job_tracker_open` uplift vs current baseline
- `job_followup_completed / job_followup_set` uplift vs current baseline
- No regression in user experience quality signals

### Completion

- Status: Completed
- Evidence:
  - `docs/phase-24-conversion-uplift-log.md`
  - Existing Job Tracker conversion instrumentation and quick-add/enrichment improvements

## Phase 25: Performance reliability hardening

### Goal

Sustain performance under tighter constraints and reduce regressions over time.

### Scope

- Route-cluster profiling for top traffic + worst p75 paths
- Fix high-impact LCP/INP regressions with measurable outcomes
- Keep LHCI and runtime telemetry aligned

### Acceptance criteria

- p75 LCP/INP reduced on prioritized route clusters
- 3+ consecutive healthy CI checks with tightened budgets
- No regression in accessibility/SEO quality gates

### Completion

- Status: Completed
- Evidence:
  - `docs/phase-25-performance-hardening-log.md`
  - `lighthouserc.json` hardening changes already integrated

## Phase 26: Funnel quality and monetization readiness

### Goal

Improve quality of acquisition and activation, not only click volume.

### Scope

- Extend attribution from source click to downstream activation quality
- Build cohort reporting by source/surface
- Prioritize high-value surfaces for CTA optimization

### Acceptance criteria

- Attribution completeness >= 95% for target funnel events
- Source-to-activation views available in weekly review
- At least one optimization decision backed by cohort evidence

### Completion

- Status: Completed
- Evidence:
  - `docs/phase-26-funnel-quality-log.md`
  - source-aware blog CTA instrumentation and attribution params in production code paths
