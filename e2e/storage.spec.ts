import { expect, test } from '@playwright/test';

test('Diagnóstico counts app launches across restarts', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('row', { name: /Aperturas/ })).toHaveText(/Aperturas\s*1$/);

  await page.reload();
  await expect(page.getByRole('row', { name: /Aperturas/ })).toHaveText(/Aperturas\s*2$/);
});

test('without IndexedDB the app still works and says it cannot persist', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'indexedDB', { value: undefined }));

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();
  await expect(page.getByRole('row', { name: /Aperturas/ })).toContainText('Sin persistencia');
});
