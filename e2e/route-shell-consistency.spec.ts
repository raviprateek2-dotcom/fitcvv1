import { test, expect } from '@playwright/test';

const routes = ['/', '/templates', '/dashboard', '/interview', '/blog'];

test.describe('global shell consistency', () => {
  for (const route of routes) {
    test(`renders shared header and footer on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 60_000 });

      await expect(page.getByRole('banner')).toContainText('FitCV');
      await expect(page.getByRole('navigation').first()).toContainText('Dashboard');
      await expect(page.getByRole('navigation').first()).toContainText('Jobs');
      await expect(page.getByRole('navigation').first()).toContainText('Templates');
      await expect(page.getByRole('navigation').first()).toContainText('Interview');

      await expect(page.getByRole('contentinfo')).toContainText('Stay in the loop');
      await expect(page.getByRole('contentinfo')).toContainText('FitCV');
    });
  }
});
