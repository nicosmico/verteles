import { test, expect } from '@playwright/test';

test('has title and brand text', async ({ page }) => {
  await page.goto('/');

  // Expect the main h1 to contain "Verteles IPTV"
  await expect(page.locator('h1')).toContainText('Verteles IPTV');
});
