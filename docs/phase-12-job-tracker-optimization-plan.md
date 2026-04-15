# Phase 12 Plan: Job Tracker conversion optimization sprint

## Goal

Improve progression through the Job Tracker funnel using Phase 11 baseline data.

## Scope

- Optimize `job_tracker_open -> job_added` conversion.
- Improve stage progression quality (`saved -> applied`, `applied -> interview`, `interview -> offer`).
- Improve reminder completion (`job_followup_completed / job_followup_set`).

## Workstreams

1. CTA and entry-point optimization
   - Rank `source` performance (`dashboard_header`, `editor_header`, `interview_completion`, etc.).
   - Promote strongest entry source and reduce weak/noise surfaces.
2. Form friction reduction
   - Reduce required fields for first add.
   - Add optional enrichment after first save.
3. Reminder completion UX
   - Improve due-state visibility and completion affordances.
   - Tune snooze defaults based on completion rate.

## Acceptance criteria

- `job_added / job_tracker_open` improves by >= 15% vs Phase 11 baseline.
- `job_followup_completed / job_followup_set` improves by >= 10 points.
- No negative regression in Lighthouse CLS/LCP on tracker routes.
