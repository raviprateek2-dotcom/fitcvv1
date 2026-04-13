import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Uptime / load-balancer probe. No auth; returns JSON with ISO timestamp.
 * Phase 4: wire external monitors to GET /api/health
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'fitcv',
      time: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
