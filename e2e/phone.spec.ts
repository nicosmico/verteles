import { expect, test } from '@playwright/test';

// A phone held upright: 390×844 CSS px, touch only.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test('on a phone held upright the text is readable', async ({ page }) => {
  await page.goto('/');

  const cell = page.getByRole('row', { name: /Plataforma/ }).getByRole('cell');
  const box = await cell.boundingBox();
  // Rendered height of one line of body text, in CSS px: at least ~14 px to be legible.
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(14);
  const fontSize = await cell.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const scale = await page.evaluate(() => {
    const stage = document.querySelector('[data-stage]') as HTMLElement;
    return stage.getBoundingClientRect().width / stage.offsetWidth;
  });
  expect(fontSize * scale).toBeGreaterThanOrEqual(14);
});

test('on a phone the screens switch by tapping the legend', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Reproducción' }).tap();
  await expect(page.getByRole('heading', { name: 'Reproducción' })).toBeVisible();

  await page.getByRole('button', { name: 'Diagnóstico' }).tap();
  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();
});
