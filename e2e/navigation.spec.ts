import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/my-work', '/contact', '/resumes'];

test.describe('navigation', () => {
  for (const route of routes) {
    test(`loads ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/EHGP/);
    });
  }

  test('contact page lists ways to reach out', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('Reach out')).toBeVisible();
    await expect(
      page.locator('a[href^="mailto:"]').first()
    ).toBeVisible();
  });
});
