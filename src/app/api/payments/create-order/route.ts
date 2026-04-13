import { NextResponse } from 'next/server';

const DEFAULT_AMOUNT_INR = 29900; // paise (INR 299)

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const amount = Number(process.env.RAZORPAY_PRO_AMOUNT_PAISE ?? DEFAULT_AMOUNT_INR);
  const currency = process.env.RAZORPAY_CURRENCY ?? 'INR';

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { ok: false, error: 'razorpay_not_configured' },
      { status: 503 }
    );
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `fitcv_${Date.now()}`,
        notes: { product: 'fitcv_pro' },
      }),
      cache: 'no-store',
    });

    const data = (await orderRes.json()) as { id?: string; error?: { description?: string } };
    if (!orderRes.ok || !data.id) {
      return NextResponse.json(
        { ok: false, error: data.error?.description ?? 'order_creation_failed' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, orderId: data.id, amount, currency });
  } catch {
    return NextResponse.json({ ok: false, error: 'order_creation_error' }, { status: 502 });
  }
}
