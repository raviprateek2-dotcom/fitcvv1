import { test, expect } from '@playwright/test';

test.describe('Marketing & content smoke', () => {
  test('health API returns ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as { ok?: boolean; service?: string; time?: string };
    expect(json.ok).toBe(true);
    expect(json.service).toBe('fitcv');
    expect(json.time).toBeTruthy();
  });

  test('blog RSS feed returns RSS XML', async ({ request }) => {
    const res = await request.get('/blog/feed.xml');
    expect(res.ok(), `expected 200, got ${res.status()}`).toBeTruthy();
    const ct = res.headers()['content-type'] ?? '';
    expect(ct).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('FitCV Blog');
  });

  test('blog index shows main heading', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/career|insights/i);
  });

  test('topics hub loads', async ({ page }) => {
    await page.goto('/blog/topics');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/topic/i);
  });
});
