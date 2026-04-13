import { checkRateLimit } from '../rate-limit';

describe('checkRateLimit', () => {
  it('allows requests under the cap', () => {
    const key = `test-ip-a-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(key, 3, 60_000)).toEqual({ ok: true });
    expect(checkRateLimit(key, 3, 60_000)).toEqual({ ok: true });
    expect(checkRateLimit(key, 3, 60_000)).toEqual({ ok: true });
  });

  it('blocks after max in the window', () => {
    const key = `test-ip-b-${Date.now()}`;
    expect(checkRateLimit(key, 2, 60_000)).toEqual({ ok: true });
    expect(checkRateLimit(key, 2, 60_000)).toEqual({ ok: true });
    const blocked = checkRateLimit(key, 2, 60_000);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    }
  });

  it('uses separate buckets per key', () => {
    const t = Date.now();
    expect(checkRateLimit(`u1-${t}`, 1, 60_000)).toEqual({ ok: true });
    expect(checkRateLimit(`u1-${t}`, 1, 60_000).ok).toBe(false);
    expect(checkRateLimit(`u2-${t}`, 1, 60_000)).toEqual({ ok: true });
  });
});
