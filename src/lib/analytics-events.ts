/**
 * Phase 4: client-side growth events. Safe to call from any client component.
 * - Dev: logs to console.
 * - If gtag is loaded + NEXT_PUBLIC_GA_MEASUREMENT_ID: sends GA4 event.
 * - If dataLayer exists: pushes a structured object (GTM-friendly).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: { capture?: (name: string, params?: Record<string, unknown>) => void };
  }
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: AnalyticsEventParams): void {
  if (typeof window === 'undefined') return;

  const cleaned = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined) as [string, string | number | boolean][],
      )
    : undefined;

  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, cleaned ?? {});
  }

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (typeof window.gtag === 'function' && gaId) {
    try {
      window.gtag('event', name, cleaned ?? {});
    } catch {
      // ignore
    }
  }

  const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dl)) {
    dl.push({ event: name, ...cleaned });
  }

  if (window.posthog?.capture) {
    try {
      window.posthog.capture(name, cleaned ?? {});
    } catch {
      // ignore
    }
  }
}
