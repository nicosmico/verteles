import { expect, test } from '@playwright/test';

test('the color keys switch between the spike screens', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();

  await page.keyboard.press('F2');
  await expect(page.getByRole('heading', { name: 'Reproducción' })).toBeVisible();

  await page.keyboard.press('F3');
  await expect(page.getByRole('heading', { name: 'Lista 2000' })).toBeVisible();

  await page.keyboard.press('F1');
  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();
});

test('Diagnóstico shows the last remote key and what the platform reported', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('PageUp');
  await expect(page.getByRole('row', { name: /Última tecla/ })).toContainText('ChannelUp (PageUp)');

  await page.keyboard.press('q');
  await expect(page.getByRole('row', { name: /Última tecla/ })).toContainText('Desconocida (q)');
});

test('the first Back asks to press it again to exit', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Escape');

  await expect(page.getByRole('status')).toHaveText('Presiona Back otra vez para salir');
});
