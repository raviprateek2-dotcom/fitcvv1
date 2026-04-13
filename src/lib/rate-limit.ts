/**
 * In-process sliding window limiter (Phase 4). Best-effort per server instance; use Redis/edge for strict global limits.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

const PRUNE_EVERY = 200;
let requestsSincePrune = 0;

function pruneExpired(now: number) {
  requestsSincePrune += 1;
  if (requestsSincePrune < PRUNE_EVERY) return;
  requestsSincePrune = 0;
  for (const [key, b] of store) {
    if (now > b.resetAt) store.delete(key);
  }
}

export function checkRateLimit(key: string, max: number, windowMs: number): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  pruneExpired(now);

  const bucket = store.get(key);
  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { ok: false, retryAfterSec };
  }

  bucket.count += 1;
  return { ok: true };
}

/** Per-user cap for AI server actions (see action-guard + PDF parser). */
const AI_ACTION_MAX = 10;
const AI_ACTION_WINDOW_MS = 60_000;

export const aiRateLimiter = {
  check(userId: string): boolean {
    const r = checkRateLimit(`ai_action:${userId}`, AI_ACTION_MAX, AI_ACTION_WINDOW_MS);
    return r.ok;
  },
};
