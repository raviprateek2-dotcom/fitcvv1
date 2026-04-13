import { NextResponse } from 'next/server';
import crypto from 'crypto';

const seenEventIds = new Set<string>();

function safeTimingEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ ok: false, error: 'webhook_not_configured' }, { status: 503 });
  }

  const signature = request.headers.get('x-razorpay-signature');
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'missing_signature' }, { status: 400 });
  }

  const rawBody = await request.text();
  const digest = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (!safeTimingEqual(digest, signature)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  let payload: { event?: string; payload?: { payment?: { entity?: { id?: string } } } };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const eventId = payload.payload?.payment?.entity?.id;
  if (eventId && seenEventIds.has(eventId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  if (eventId) {
    seenEventIds.add(eventId);
    if (seenEventIds.size > 2000) {
      const first = seenEventIds.values().next().value;
      if (first) seenEventIds.delete(first);
    }
  }

  // Data-store update hook:
  // Add Firebase Admin or your billing DB write here to mark user subscription as premium.
  // This endpoint currently validates source authenticity + idempotency before processing.
  return NextResponse.json({ ok: true, event: payload.event ?? 'unknown' });
}
