# Phase 11 Plan: Metrics baseline and alert thresholds

## Goal

Turn ongoing monitoring into a repeatable operating loop with clear thresholds and owners.

## Scope

- In scope:
  - Baseline snapshot template for vitals and funnel events
  - Alert thresholds for regressions
  - Weekly review cadence and response actions
- Out of scope:
  - Building a full in-app analytics dashboard
  - Pager/on-call automation integrations

## Baseline snapshot

Capture the first baseline over 7 days after a stable deploy:

- Web vitals:
  - `web_vital` p50/p75 by `vital` (`CLS`, `LCP`, `INP`, `FCP`, `TTFB`)
  - Poor-rating percentage by vital
- Blog funnel:
  - `blog_read_complete` count
  - `blog_helpful_vote` up/down ratio
  - CTA events (`cta_get_started`, `cta_signup`) conversion trend
- Job tracker funnel:
  - `job_tracker_open` by `source`
  - `job_added` rate from opens
  - `job_stage_changed` progression (`saved->applied`, `applied->interview`, `interview->offer`)
  - Follow-up lifecycle rates (`job_followup_set`, `job_followup_snoozed`, `job_followup_completed`)

## Alert thresholds

- Web vitals:
  - CLS poor rate +20% week-over-week
  - LCP p75 > 2500ms on key marketing routes
  - INP p75 > 200ms sustained for 2+ days
- Blog funnel:
  - `blog_read_complete` drops >25% week-over-week without traffic drop explanation
  - Helpful up-vote ratio drops below 60%
- Job tracker:
  - `job_added / job_tracker_open` drops >20% week-over-week
  - `job_followup_completed / job_followup_set` drops below 40%

## Weekly review checklist

1. Export previous 7-day metrics (GA4/PostHog + LHCI outcomes).
2. Compare to baseline and last week.
3. Tag anomalies by likely source:
   - performance regression
   - UX friction
   - instrumentation break
4. Create follow-up issue with:
   - impact estimate
   - likely owner
   - target fix release

## Definition of done

- Baseline snapshot is documented in an issue or ops doc.
- Thresholds are accepted by product + engineering owner.
- Weekly review owner assigned and calendarized.
- `docs/operations-p1-runbook.md` reflects final threshold values.

## Execution artifacts

- Baseline sheet: `docs/phase-11-baseline-template.md`
- Weekly review log: `docs/phase-11-weekly-review-log.md`
- Data collection guide: `docs/phase-11-data-collection-playbook.md`
- Anomaly issue template: `docs/phase-11-anomaly-issue-template.md`
- Closeout gate: `docs/phase-11-closeout-checklist.md`
