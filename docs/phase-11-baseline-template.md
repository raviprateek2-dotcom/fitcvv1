# Phase 11 Baseline Snapshot Template

Use this template to capture a 7-day baseline after a stable deploy.

## Baseline window (Entry 1 initialized)

- Start date: 2026-04-10
- End date: 2026-04-17
- Environment: production
- Owner: TBD
- Status: Awaiting metric exports from GA4 / PostHog / Sentry / LHCI history

## 1) Web vitals baseline (`web_vital`)

| Vital | p50 | p75 | Poor rating % | Notes |
| --- | --- | --- | --- | --- |
| CLS | TODO | TODO | TODO | Pull from `web_vital` events grouped by `vital=CLS` |
| LCP (ms) | TODO | TODO | TODO | Validate against LHCI route history |
| INP (ms) | TODO | TODO | TODO | Check sustained spikes over 2+ days |
| FCP (ms) | TODO | TODO | TODO | Track as supporting metric |
| TTFB (ms) | TODO | TODO | TODO | Correlate with backend/runtime events |

Data sources:
- GA4 events / PostHog events (`web_vital`)
- Sentry metrics (`web_vital.*`) for corroboration
- Lighthouse CI history on `main`

## 2) Blog funnel baseline

| Metric | Value | WoW delta | Notes |
| --- | --- | --- | --- |
| `blog_read_complete` count | TODO | TODO | Export event counts for 7-day window |
| `blog_helpful_vote` up count | TODO | TODO |  |
| `blog_helpful_vote` down count | TODO | TODO |  |
| Helpful up-vote ratio | TODO | TODO | Compute `up / (up + down)` |
| `cta_get_started` count | TODO | TODO |  |
| `cta_signup` count | TODO | TODO | Segment blog sessions when possible |

## 3) Job tracker funnel baseline

| Metric | Value | WoW delta | Notes |
| --- | --- | --- | --- |
| `job_tracker_open` count | TODO | TODO |  |
| `job_added` count | TODO | TODO |  |
| `job_added / job_tracker_open` | TODO | TODO | Primary conversion KPI for Phase 12 |
| `job_stage_changed` count | TODO | TODO | Include `from`/`to` breakdown |
| `job_followup_set` count | TODO | TODO |  |
| `job_followup_completed` count | TODO | TODO |  |
| `job_followup_completed / job_followup_set` | TODO | TODO | Reminder retention KPI |

### Job tracker entry-source distribution

| Source | Opens | Added | Added/Open | Notes |
| --- | --- | --- | --- | --- |
| `dashboard_header` | TODO | TODO | TODO |  |
| `editor_header` | TODO | TODO | TODO |  |
| `interview_completion` | TODO | TODO | TODO |  |
| `jobs_page` / direct | TODO | TODO | TODO |  |

## 4) Threshold validation notes

- CLS poor-rate trigger (+20% WoW): TODO
- LCP p75 trigger (>2500ms): TODO
- INP p75 trigger (>200ms sustained): TODO
- Blog completion trigger (-25% WoW): TODO
- Helpful ratio trigger (<60%): TODO
- Job add conversion trigger (-20% WoW): TODO
- Follow-up completion trigger (<40%): TODO

## 5) Sign-off

- Product owner: TBD
- Engineering owner: TBD
- Date: 2026-04-17 (initialized)
