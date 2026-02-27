/**
 * action-guard.ts
 *
 * A higher-order helper that wraps every server action with:
 *  1. Zod input validation
 *  2. Per-user rate limiting (via aiRateLimiter)
 *  3. Consistent error envelope compatible with the existing codebase:
 *     { success: boolean, data?: T, error?: string, code?: string }
 *
 * The response shape is intentionally kept backward-compatible with the
 * existing `{ success, data?, error? }` pattern used throughout callers.
 */



import { z, ZodSchema } from 'zod';
import { aiRateLimiter } from './rate-limit';

/** Unified response shape — backward-compatible with existing callers */
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: 'VALIDATION_ERROR' | 'RATE_LIMIT' | 'INTERNAL_ERROR';
}

/**
 * Wraps a server action with validation + rate limiting.
 *
 * @param schema   Zod schema for the raw (untrusted) input
 * @param handler  Async function that receives the validated input
 */
export function guardedAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: (input: TInput, rateLimitKey: string) => Promise<TOutput>
) {
  return async (rawInput: unknown, userId = 'anonymous'): Promise<ActionResponse<TOutput>> => {
    // 1. Rate limit
    if (!aiRateLimiter.check(userId)) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please wait a moment before trying again.',
        code: 'RATE_LIMIT',
      };
    }

    // 2. Validate input
    const parsed = schema.safeParse(rawInput);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
      return {
        success: false,
        error: `Validation failed: ${message}`,
        code: 'VALIDATION_ERROR',
      };
    }

    // 3. Execute
    try {
      const data = await handler(parsed.data, userId);
      return { success: true, data };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      console.error('[action-guard] handler threw:', error);
      return { success: false, error: message, code: 'INTERNAL_ERROR' };
    }
  };
}
