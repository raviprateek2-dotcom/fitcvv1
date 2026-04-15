import { test, expect } from '@playwright/test';

test.describe('Job board demo flow', () => {
  test('add job and persist status move after refresh', async ({ page }) => {
    await page.goto('/dashboard/jobs?demo=1');

    await page.getByRole('button', { name: /add job/i }).click();
    await page.locator('#job-company').fill('Razorpay');
    await page.locator('#job-role').fill('Product Manager');
    await page.locator('#job-location').fill('Bangalore');
    await page.locator('#job-notes').fill('Prepare fintech metrics for round 1');
    await page.getByRole('button', { name: /add to board/i }).click();

    const cardButton = page.getByTestId(/open-job-demo-/).first();
    await expect(cardButton).toContainText('Razorpay');

    await page.getByTestId(/job-menu-demo-/).first().click();
    await page.getByRole('menuitem', { name: /move to applied/i }).click();
    await expect(page.getByTestId('column-applied')).toContainText('Razorpay');

    await page.reload();
    await expect(page.getByTestId('column-applied')).toContainText('Razorpay');
  });
});

test.describe('Job board mobile behavior', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens detail bottom sheet on card tap', async ({ page }) => {
    await page.goto('/dashboard/jobs?demo=1');
    await page.getByRole('button', { name: /add job/i }).click();
    await page.locator('#job-company').fill('Swiggy');
    await page.locator('#job-role').fill('Operations Manager');
    await page.locator('#job-location').fill('Bangalore');
    await page.locator('#job-notes').fill('Round 2 prep');
    await page.getByRole('button', { name: /add to board/i }).click();

    await page.getByTestId(/open-job-demo-/).first().click();
    await expect(page.getByRole('button', { name: /save updates/i })).toBeVisible();
  });
});
