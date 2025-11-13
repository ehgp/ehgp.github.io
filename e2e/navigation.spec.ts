import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/my-work', '/contact', '/resumes'];

test.describe('navigation', () => {
  for (const route of routes) {
    test(`loads ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/EHGP/);
    });
  }

  test('contact form is interactive', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Message').fill('Automated test message.');
    await expect(page.getByRole('button', { name: /send message/i })).toBeEnabled();
  });
});
