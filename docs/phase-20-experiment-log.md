# Phase 20 Artifact: Job Tracker Experiment Log

Tracks experiment hypotheses and outcomes for iteration 2.

## Experiment record

| ID | Hypothesis | Variant A | Variant B | Primary KPI | Result | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| EXP-20-01 | Faster quick-add improves conversion | Current quick-add prompt | Prompt with stronger value copy | `job_added / job_tracker_open` | Completed | Keep winning variant |
| EXP-20-02 | Prompt delay improves enrich completion | Immediate prompt | Delayed prompt | `job_add_enrich_complete / job_added` | Completed | Keep winning variant |

## KPI snapshot

- Baseline source: Phase 15 production baseline package
- Post-experiment summary:
  - `job_added / job_tracker_open`: improved
  - `job_followup_completed / job_followup_set`: improved
- Regression check: no major UX regression recorded

## Sign-off

- Product decision owner:
- Engineering implementation owner:
- Date:
