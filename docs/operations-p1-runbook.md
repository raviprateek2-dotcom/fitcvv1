# P1 Operations Runbook

This runbook covers production stability items for exports, newsletter capture, and abuse controls.

## 1) PDF export (Puppeteer) readiness

- Required env:
  - `NEXT_PUBLIC_SITE_URL` (canonical origin)
  - `NEXT_PUBLIC_APP_URL` (preferred explicit app origin for print route)
- Server action uses:
  - `NEXT_PUBLIC_APP_URL` -> `NEXT_PUBLIC_SITE_URL` -> `http://localhost:9002`
- Production recommendation:
  - If Vercel runtime has Puppeteer issues, switch to `puppeteer-core` + managed Chromium package.
  - Keep launch args `--no-sandbox`, `--disable-dev-shm-usage`.

### Staging test checklist

1. Login with a real user.
2. Open editor and create sample resume.
3. Trigger export PDF.
4. Verify:
  - Download starts within 3-8 seconds.
  - Output has expected fonts/layout.
  - No 401/403 when opening `?print=true` route.

### Incident hints

- Blank/failed PDF:
  - Check `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL`.
  - Confirm print route is reachable from server runtime.
- Timeout:
  - Check cold start and external font/network delays.
  - Increase navigation timeout only after verifying URL/auth first.

## 2) Newsletter capture behavior

- `NEWSLETTER_FORM_ACTION` set:
  - API forwards to provider and returns `{ ok: true, mode: "forwarded" }`.
- `NEWSLETTER_FORM_ACTION` missing:
  - Development: placeholder success for local iteration.
  - Production: API returns `503 newsletter_not_configured` to avoid false-positive conversions.

## 3) Playwright and dev port parity

- App dev script runs on `9002`.
- Playwright now defaults to `http://localhost:9002`.
- CI can override via `PLAYWRIGHT_TEST_BASE_URL` when needed.

## 4) Firestore/rate-limit monitoring cadence

- Weekly checks:
  - 429 volume on AI/newsletter endpoints.
  - Auth and Firestore permission errors in logs.
  - Slow/error trends on export flow.
- Monthly checks:
  - Firestore indexes and hot-path query health.
  - Security rules review against newly added features.

## 5) Payments (Razorpay) hardening notes

- Checkout order endpoint: `POST /api/payments/create-order`
- Webhook endpoint: `POST /api/payments/webhook`
- Required env:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- Webhook protections included:
  - signature validation (`x-razorpay-signature`)
  - idempotency guard for duplicate payment events
- Production follow-up:
  - persist verified webhook events to your billing datastore
  - map payment to user and flip subscription state server-side

## 6) Web vitals and blog funnel observation (Phase 9)

Client events are emitted from `trackEvent` in `src/lib/analytics-events.ts` (GA4 when `NEXT_PUBLIC_GA_MEASUREMENT_ID` + `gtag`, `dataLayer`, PostHog when configured). Core Web Vitals are duplicated into that pipeline from `WebVitalsReporter` in production.

**Events to watch**


| Event                                                                  | Meaning                                                                                                                       |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `web_vital`                                                            | Params: `vital` (CLS, LCP, INP, FCP, TTFB), `metric_value`, `rating`, optional `navigation_type`.                             |
| `blog_read_complete`                                                   | Reader reached ~95% scroll on a post (`slug`).                                                                                |
| `blog_helpful_vote`                                                    | Thumbs feedback (`slug`, `vote`: up/down).                                                                                    |
| `cta_get_started`, `cta_signup`                                        | Header and other surfaces (see `surface` param where set).                                                                    |
| `job_tracker_open`                                                     | Job Tracker opened; use `source` to identify entry point (`dashboard_header`, `editor_header`, `interview_completion`, etc.). |
| `job_added`                                                            | New job added from tracker form (`status`, `source`).                                                                         |
| `job_stage_changed`                                                    | Stage transitions with `from`, `to`, and interaction `source` (`drag`, `menu`, `quick_action`, `detail_panel`).               |
| `job_followup_set` / `job_followup_snoozed` / `job_followup_completed` | Reminder lifecycle tracking for retention loops.                                                                              |


**Where to look**

- **GA4**: Explore → Events (register custom dimensions for `vital`, `slug`, `surface` if you segment often).
- **PostHog**: Events → filter by name above; build dashboards for `web_vital` by `vital` and `rating`.
- **Sentry**: Metrics `web_vital.`* when `NEXT_PUBLIC_SENTRY_DSN` is set (distribution, not GA parity).
- **Lighthouse CI**: GitHub Actions `lhci` step on `main` PRs/pushes; budgets in `lighthouserc.json` (CLS error threshold, LCP warn).

**Cadence**

- After each production deploy: spot-check a key URL in GA4 real-time for `web_vital` and a blog read.
- Weekly: compare `web_vital` poor ratings vs prior week; scan `blog_read_complete` / `blog_helpful_vote` volume for anomalies.
- If Lighthouse CI fails on CLS/LCP: reproduce locally with `npm run build && npm run start` then `npm run lhci`; adjust layout/fonts or relax assertions only with a documented reason.

## 7) Thresholds and baseline loop (Phase 11)

Use the baseline template in `docs/phase-11-baseline-template.md` and maintain this threshold table:


| Area        | Trigger                                           | First response                                                           |
| ----------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| Web vitals  | CLS poor-rate +20% WoW                            | Check recent layout/font/header changes and LHCI diff on key routes      |
| Web vitals  | LCP p75 > 2500ms                                  | Inspect hero/image/font payload and route-level resource waterfalls      |
| Web vitals  | INP p75 > 200ms                                   | Profile heavy handlers on primary interactions; check long tasks         |
| Blog funnel | `blog_read_complete` -25% WoW                     | Verify traffic mix first, then article rendering/performance regressions |
| Blog funnel | Helpful up-vote ratio < 60%                       | Inspect recent content updates and article quality outliers              |
| Job tracker | `job_added / job_tracker_open` -20% WoW           | Review CTA entry source mix and tracker form friction                    |
| Job tracker | `job_followup_completed / job_followup_set` < 40% | Review reminder UX and follow-up completion flow                         |


### Owner model and escalation SLA

- Product owner (recommended): Growth/Product lead for funnel impact decisions.
- Engineering owner (recommended): Web platform lead for vitals + instrumentation fixes.
- Backup owner: On-call/fullstack lead for incident triage when primary owners are unavailable.

Escalation path:

1. Trigger breach detected in weekly review or post-deploy check.
2. Create anomaly issue (use `docs/phase-11-anomaly-issue-template.md`).
3. Assign product + engineering owners within 1 business day.
4. Classify severity:
  - P1: severe regression (core vitals/funnel collapse) -> hotfix target <= 24h
  - P2: moderate regression -> scheduled fix target <= 7 days
  - P3: minor regression/noise -> monitor with next weekly review
5. Post-fix: record outcome in weekly log and close anomaly issue with evidence links.

### Current owner assignments (Phase 15 handoff)

- Product owner: Growth/Product lead
- Engineering owner: Web platform lead
- Backup owner: Fullstack on-call lead
- Last updated: 2026-04-19

