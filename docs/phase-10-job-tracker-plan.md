# Phase 10 Plan: Job Tracker activation and retention loop

## Goal

Increase weekly active usage of Job Tracker by making it easier to capture jobs, move them through stages, and receive timely nudges.

## Scope

- In scope:
  - Better stage transition UX in board/list views
  - Follow-up reminders for stale applications
  - Conversion nudges from resume/interview surfaces into Job Tracker
  - Event instrumentation for adoption and retention metrics
- Out of scope:
  - New billing/paywall experiments
  - CRM-grade email sequencing
  - Major schema migrations that require downtime

## Workstreams

### 1) Pipeline interaction hardening

- Add explicit quick actions for common transitions:
  - Applied -> Interview
  - Interview -> Offer
  - Interview -> Rejected
- Ensure optimistic UI updates with rollback on failure.
- Preserve keyboard and mobile touch parity for transitions.

Acceptance criteria:
- User can move any card in <=2 taps/clicks.
- Failed network save restores previous stage and shows a non-blocking error toast.
- No regressions in existing board interactions on mobile.

### 2) Follow-up reminders

- Add reminder metadata to job items:
  - `nextFollowUpAt`
  - `lastFollowUpAt`
  - `followUpCount`
- Surface reminders in dashboard/job tracker:
  - "Due today"
  - "Overdue"
  - "This week"
- Add safe snooze actions (1 day, 3 days, 1 week).

Acceptance criteria:
- Users can set and snooze reminders from both card and detail views.
- Reminder status updates correctly after snooze/complete actions.
- Overdue reminder count appears in at least one high-visibility surface.

### 3) Cross-surface conversion nudges

- Add Job Tracker CTA from:
  - Resume editor success/exit points
  - Interview completion state
  - Dashboard summary
- Track entry source to identify strongest conversion surfaces.

Acceptance criteria:
- Each entry surface emits event with `source` param.
- At least one CTA is visible on mobile and desktop without layout shift.
- Deep link preserves intended context when opening tracker.

### 4) Analytics and operational checks

- Instrument events:
  - `job_tracker_open`
  - `job_added`
  - `job_stage_changed`
  - `job_followup_set`
  - `job_followup_snoozed`
  - `job_followup_completed`
- Add runbook note for weekly metric review and alert thresholds.

Acceptance criteria:
- Events fire with expected params in dev console and production analytics.
- Weekly report fields are defined and queryable in GA4/PostHog.

## Definition of done

- All acceptance criteria pass.
- Typecheck/lint/tests pass in CI.
- No Lighthouse CLS/LCP regression on key routes.
- `docs/phase-progress.md` updated with Phase 10 status and delivered items.

## Implementation order

1. Pipeline interaction hardening
2. Reminder data model and UI
3. Conversion nudges
4. Analytics instrumentation and runbook update
5. Final QA and phase closeout docs

