import { expect, test } from '@playwright/test';

test('the Diagnóstico screen shows the Chromium version the app is running on', async ({ page, browser }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();
  await expect(page.getByRole('row', { name: /Chromium/ })).toContainText(browser.version());
});
