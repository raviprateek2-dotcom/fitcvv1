import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NEWSLETTER_MAX_PER_WINDOW = 8;
const NEWSLETTER_WINDOW_MS = 60_000;

function clientKey(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown';
}

function getForwardUrl(): string | undefined {
  const raw = process.env.NEWSLETTER_FORM_ACTION?.trim();
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
}

/**
 * POST { "email": "..." }
 * Forwards JSON { email } to NEWSLETTER_FORM_ACTION (e.g. Formspree) from the server
 * so the browser CSP connect-src stays on 'self' + your existing allowlist.
 */
export async function POST(request: Request) {
  const rl = checkRateLimit(`newsletter:${clientKey(request)}`, NEWSLETTER_MAX_PER_WINDOW, NEWSLETTER_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('email' in body)) {
    return NextResponse.json({ ok: false, error: 'missing_email' }, { status: 400 });
  }

  const email = String((body as { email: unknown }).email ?? '').trim();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const forward = getForwardUrl();
  if (!forward) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { ok: false, error: 'newsletter_not_configured' },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true, mode: 'placeholder' as const });
  }

  try {
    const res = await fetch(forward, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: 'forward_failed', status: res.status },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, mode: 'forwarded' as const });
  } catch {
    return NextResponse.json({ ok: false, error: 'forward_error' }, { status: 502 });
  }
}
