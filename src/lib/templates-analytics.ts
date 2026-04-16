import { trackEvent } from '@/lib/analytics-events';
import { landingAbParams } from '@/lib/landing-ab-config';
import type { TemplateCatalogSort } from '@/lib/templates-catalog-url';

export const TEMPLATES_ANALYTICS_EVENTS = {
  templates_catalog_view: 'templates_catalog_view',
  templates_url_sync: 'templates_url_sync',
  templates_filter_reset: 'templates_filter_reset',
  templates_preview_open: 'templates_preview_open',
  templates_preview_close: 'templates_preview_close',
  templates_preview_nav: 'templates_preview_nav',
} as const;

export function trackTemplatesCatalogView(): void {
  trackEvent(TEMPLATES_ANALYTICS_EVENTS.templates_catalog_view, {
    page: 'templates',
    ...landingAbParams(),
  });
}

export function trackTemplatesUrlSync(payload: { has_query: boolean; filter_count: number }): void {
  trackEvent(TEMPLATES_ANALYTICS_EVENTS.templates_url_sync, {
    page: 'templates',
    ...landingAbParams(),
    ...payload,
  });
}

export function trackTemplatesFilterReset(): void {
  trackEvent(TEMPLATES_ANALYTICS_EVENTS.templates_filter_reset, {
    page: 'templates',
    ...landingAbParams(),
  });
}

export function trackTemplatesPreviewOpen(templateId: string): void {
  trackEvent(TEMPLATES_ANALYTICS_EVENTS.templates_preview_open, {
    page: 'templates',
    template_id: templateId,
    ...landingAbParams(),
  });
}

export function trackTemplatesPreviewClose(templateId: string): void {
  trackEvent(TEMPLATES_ANALYTICS_EVENTS.templates_preview_close, {
    page: 'templates',
    template_id: templateId,
    ...landingAbParams(),
  });
}

export function trackTemplatesPreviewNav(direction: 'prev' | 'next', sortBy: TemplateCatalogSort): void {
  trackEvent(TEMPLATES_ANALYTICS_EVENTS.templates_preview_nav, {
    page: 'templates',
    direction,
    sort_by: sortBy,
    ...landingAbParams(),
  });
}
