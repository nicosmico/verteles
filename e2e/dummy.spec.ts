import { test, expect } from '@playwright/test';

test('has title and brand text', async ({ page }) => {
  await page.goto('/');

  // Expect the main h1 to contain "Verteves IPTV"
  await expect(page.locator('h1')).toContainText('Verteves IPTV');
});
