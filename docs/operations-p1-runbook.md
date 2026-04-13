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
