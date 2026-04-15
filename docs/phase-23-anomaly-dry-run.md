# Phase 23 Dry-Run Anomaly Issue

Dry-run based on `docs/phase-11-anomaly-issue-template.md` to validate workflow readiness.

## Metadata

- Date detected: 2026-04-24
- Detected by: Weekly review simulation
- Severity: P2
- Status: Monitoring

## Trigger

- Triggered metric: `job_added / job_tracker_open`
- Threshold: -20% WoW
- Observed value: Simulated -22% WoW (dry-run dataset)
- Window: 2026-04-17 to 2026-04-24

## Business impact

- Affected funnel/surface: Job Tracker conversion from entry surfaces
- Estimated user impact: Fewer tracked applications created from visits
- Revenue or conversion risk (if known): Medium impact on downstream activation

## Suspected cause

- Candidate root causes:
  - Enrichment prompt timing friction for quick-add users
  - Traffic mix shift toward lower-intent sources
- Related deploy(s): N/A (dry-run scenario)
- Related PR(s): N/A (dry-run scenario)

## Evidence

- GA4 link: TODO (attach from real review)
- PostHog link: TODO (attach from real review)
- Sentry link: N/A for this funnel metric
- LHCI link: N/A for this funnel metric
- Screenshots/logs: TODO

## Owners and SLA

- Product owner: Growth/Product lead
- Engineering owner: Web platform lead
- Backup owner: Fullstack on-call lead
- Mitigation ETA: 2026-04-28
- Permanent fix ETA: 2026-05-02

## Action plan

- [x] Immediate mitigation (dry-run plan documented)
- [x] Root cause confirmation (hypotheses listed)
- [ ] Fix implemented (deferred for real anomaly)
- [ ] Post-fix validation (deferred for real anomaly)
- [ ] Weekly log updated (to be done in real cycle)

## Closure

- Outcome summary: Dry-run confirms anomaly issue template and owner/SLA workflow are operational.
- Regression prevented by: Early escalation and source-level funnel monitoring.
- Follow-up tasks:
  - Run this workflow against real breach conditions in next weekly cycle.
  - Attach real evidence links from GA4/PostHog.
