# Phase 11 Data Collection Playbook

Use this playbook to fill `docs/phase-11-baseline-template.md` for the initialized window.

## Baseline window

- Start: 2026-04-10
- End: 2026-04-17
- Timezone: IST (Asia/Kolkata)

## 1) GA4 extraction

Target events:
- `web_vital`
- `blog_read_complete`
- `blog_helpful_vote`
- `cta_get_started`
- `cta_signup`
- `job_tracker_open`
- `job_added`
- `job_stage_changed`
- `job_followup_set`
- `job_followup_snoozed`
- `job_followup_completed`

Steps:
1. Open GA4 Explore -> Free form.
2. Set date range to baseline window.
3. Add dimensions:
   - `eventName`
   - custom params where relevant: `vital`, `rating`, `source`, `from`, `to`
4. Add metrics:
   - Event count
5. Create tabs:
   - Web vitals by `vital` + `rating`
   - Blog funnel counts
   - Job tracker funnel + source mix
6. Export CSV and paste aggregated values into baseline template.

## 2) PostHog extraction

Use PostHog Events or Insights to validate parity with GA4.

Steps:
1. Create insight by event name for baseline window.
2. Break down by:
   - `vital`/`rating` for `web_vital`
   - `source` for `job_tracker_open`
3. Export CSV.
4. Compare trends against GA4 counts (allow small instrumentation drift).

## 3) Sentry metrics extraction

Use Sentry Metrics to corroborate web vitals trends:
- `web_vital.CLS`
- `web_vital.LCP`
- `web_vital.INP`
- `web_vital.FCP`
- `web_vital.TTFB`

Steps:
1. Set same date range.
2. View distributions and p50/p75 where available.
3. Note significant outliers/spikes.
4. Add corroboration notes in baseline template (do not overwrite GA4 source-of-truth counts).

## 4) Lighthouse CI extraction

Source: `main` workflow history and LHCI results.

Steps:
1. Review LHCI runs within baseline window.
2. Capture pass/fail trend and any CLS/LCP warnings/errors.
3. Add route-specific notes for regressions.

## 5) Required calculations

Compute and fill:
- Helpful up-vote ratio = `up / (up + down)`
- Job add conversion = `job_added / job_tracker_open`
- Follow-up completion rate = `job_followup_completed / job_followup_set`

## 6) Completion checklist

- [ ] Baseline template fully filled
- [ ] Product owner assigned
- [ ] Engineering owner assigned
- [ ] Threshold validation notes filled
- [ ] Weekly review log updated with real values
