'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { getClient, metrics } from '@sentry/browser';
import { trackEvent } from '@/lib/analytics-events';

/** Forward to GA4 / PostHog / dataLayer for production dashboards (values sized for GA numeric params). */
const ANALYTICS_VITALS = new Set(['CLS', 'LCP', 'INP', 'FCP', 'TTFB']);

function sendWebVitalToSentry(metric: {
  id: string;
  name: string;
  value: number;
  rating: string;
  navigationType?: string;
}) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  if (!getClient()) return;

  const unit = metric.name === 'CLS' ? undefined : 'millisecond';
  try {
    metrics.distribution(`web_vital.${metric.name}`, metric.value, {
      unit,
      attributes: {
        rating: metric.rating,
        navigation_type: metric.navigationType ?? 'unknown',
      },
    });
  } catch {
    // Metrics require a working Sentry client; never break the page.
  }
}

/**
 * Phase 3: dev logs + optional Sentry metrics (set NEXT_PUBLIC_SENTRY_DSN).
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[web-vitals] ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }
    if (process.env.NODE_ENV === 'production') {
      sendWebVitalToSentry(metric);
      if (ANALYTICS_VITALS.has(metric.name)) {
        const metricValue =
          metric.name === 'CLS'
            ? Math.round(metric.value * 100_000) / 100_000
            : Math.round(metric.value);
        trackEvent('web_vital', {
          vital: metric.name,
          metric_value: metricValue,
          rating: metric.rating,
          ...(metric.navigationType
            ? { navigation_type: String(metric.navigationType) }
            : {}),
        });
      }
    }
  });
  return null;
}
