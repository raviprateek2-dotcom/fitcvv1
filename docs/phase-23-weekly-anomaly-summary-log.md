# Phase 23 Weekly Anomaly Summary Log

Recurring leadership/ops summaries derived from the Phase 19 template.

---

## Week: 2026-04-24

- Overall health: Yellow
- New breaches: None confirmed (baseline metrics still being populated)
- Open anomalies: 0
- Closed anomalies: 0

## Breach table

| Metric area | Trigger | Current status | Severity | Owner | ETA |
| --- | --- | --- | --- | --- | --- |
| Web vitals | CLS poor-rate +20% WoW / LCP p75 > 2500ms / INP p75 > 200ms | Monitoring (awaiting first fully populated baseline window) | N/A | Web platform lead | Next weekly review |
| Blog funnel | `blog_read_complete` -25% WoW / Helpful ratio < 60% | Monitoring (no confirmed breach) | N/A | Growth/Product lead | Next weekly review |
| Job tracker funnel | `job_added / job_tracker_open` -20% WoW / follow-up completion < 40% | Monitoring (Phase 12 instrumentation active) | N/A | Growth/Product lead + Fullstack on-call lead | Next weekly review |

## Actions this week

- [x] Weekly anomaly summary executed with standardized format
- [x] Threshold review path confirmed against runbook section 7
- [ ] Escalation dry-run issue creation (next item in Phase 23 log)

## Notes

- Key risks: Baseline values are still template-driven and need first fully populated export pass.
- Requests for support: Data export support for GA4/PostHog/Sentry/LHCI baseline values before next review.

---

## Week: 2026-05-01

- Overall health: Yellow
- New breaches: None confirmed
- Open anomalies: 0
- Closed anomalies: 0

## Breach table

| Metric area | Trigger | Current status | Severity | Owner | ETA |
| --- | --- | --- | --- | --- | --- |
| Web vitals | CLS poor-rate +20% WoW / LCP p75 > 2500ms / INP p75 > 200ms | Monitoring (still awaiting fully populated baseline export) | N/A | Web platform lead | Next weekly review |
| Blog funnel | `blog_read_complete` -25% WoW / Helpful ratio < 60% | Monitoring (no confirmed breach) | N/A | Growth/Product lead | Next weekly review |
| Job tracker funnel | `job_added / job_tracker_open` -20% WoW / follow-up completion < 40% | Monitoring (no confirmed breach) | N/A | Growth/Product lead + Fullstack on-call lead | Next weekly review |

## Actions this week

- [x] Weekly anomaly summary executed with standardized format
- [x] Threshold review path confirmed against runbook section 7
- [x] Escalation dry-run issue completed and linked (`docs/phase-23-anomaly-dry-run.md`)

## Notes

- Key risks: Real-value baseline export still pending from analytics sources.
- Requests for support: Confirm GA4/PostHog/Sentry/LHCI export ownership before the next cycle.
