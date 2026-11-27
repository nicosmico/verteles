import { expect, test } from '@playwright/test';

// A phone held upright: 390×844 CSS px, touch only.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test('on a phone held upright the text is readable', async ({ page }) => {
  await page.goto('/');

  // Rendered size of body text in CSS px: font size times the stage's scale. Mobile browsers settle
  // their viewport (and fire resize) just after load, so wait for the stable value.
  const renderedFontPx = () =>
    page.evaluate(() => {
      const stage = document.querySelector('[data-stage]') as HTMLElement;
      const cell = document.querySelector('td') as HTMLElement;
      const scale = stage.getBoundingClientRect().width / stage.offsetWidth;
      return parseFloat(getComputedStyle(cell).fontSize) * scale;
    });
  await expect.poll(renderedFontPx).toBeGreaterThanOrEqual(14);
  await expect(page.locator('[data-stage]')).toHaveAttribute('data-orientation', 'portrait');
});

test('on a phone the screens switch by tapping the legend', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Reproducción' }).tap();
  await expect(page.getByRole('heading', { name: 'Reproducción' })).toBeVisible();

  await page.getByRole('button', { name: 'Diagnóstico' }).tap();
  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();
});
