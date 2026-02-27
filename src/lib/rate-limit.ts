/**
 * In-memory rate limiter using a sliding-window token-bucket algorithm.
 *
 * Usage:
 *   const limiter = new RateLimiter({ limit: 10, windowMs: 60_000 });
 *   const allowed = limiter.check(userId);
 *   if (!allowed) throw new Error('Rate limit exceeded');
 *
 * IMPORTANT: This is in-memory only. In a multi-process/serverless environment,
 * replace the Map with a shared store (e.g., Redis via Upstash).
 */

interface RateLimiterOptions {
  /** Maximum number of requests per window */
  limit: number;
  /** Window length in milliseconds */
  windowMs: number;
}

interface BucketEntry {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private buckets = new Map<string, BucketEntry>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor({ limit, windowMs }: RateLimiterOptions) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check whether the caller identified by `key` is within their rate limit.
   * Increments the counter automatically.
   *
   * @returns `true` if the request is allowed, `false` if rate-limited.
   */
  check(key: string): boolean {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || now >= existing.resetAt) {
      // New window
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (existing.count >= this.limit) {
      return false;
    }

    existing.count++;
    return true;
  }

  /** Remaining requests for the given key (0 if unknown). */
  remaining(key: string): number {
    const now = Date.now();
    const existing = this.buckets.get(key);
    if (!existing || now >= existing.resetAt) return this.limit;
    return Math.max(0, this.limit - existing.count);
  }
}

// Singleton: 10 AI calls per user per minute (generous for dev; tune for prod)
export const aiRateLimiter = new RateLimiter({ limit: 10, windowMs: 60_000 });
