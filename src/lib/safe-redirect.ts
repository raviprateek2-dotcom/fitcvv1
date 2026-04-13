/**
 * Validates a post-auth redirect target: internal path only (no open redirects).
 */
export function safeInternalRedirectPath(
  raw: string | null | undefined,
): string | null {
  if (raw == null || raw === '') return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null;
  const pathOnly = decoded.split('?')[0] ?? decoded;
  if (pathOnly === '/login' || pathOnly === '/signup') return null;
  return decoded;
}
