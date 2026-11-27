import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const fixture = readFileSync('src/domain/playlist/fixtures/alplox-2026-11-26.m3u', 'utf8');
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

async function offline(page: Page) {
  await page.route(/raw\.githubusercontent\.com/, (route) =>
    route.fulfill({ body: fixture, headers: { 'access-control-allow-origin': '*' } }),
  );
  await page.route(/\.(png|jpe?g|webp|svg)|graph\.facebook\.com|picture/, (route) =>
    route.fulfill({ body: PIXEL, contentType: 'image/png' }),
  );
}

test.beforeEach(async ({ page }) => offline(page));

const list = (page: Page) => page.getByRole('listbox', { name: 'Canales' });
const focused = (page: Page) => list(page).locator('[aria-selected="true"]');

test('Down moves focus through 2,000 Channels while the DOM keeps only a few rows', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('F3');
  await expect(page.getByRole('heading', { name: 'Lista 2000' })).toBeVisible();
  await expect(focused(page)).toContainText('1 ·');

  for (let i = 0; i < 25; i++) await page.keyboard.press('ArrowDown');

  await expect(focused(page)).toContainText('26 ·');
  await expect(focused(page)).toBeInViewport({ ratio: 1 });
  expect(await list(page).getByRole('option').count()).toBeLessThanOrEqual(30);
});

test('the list shows frame-rate stats for the last 10 seconds', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('F3');

  await expect(page.getByTestId('frame-stats')).toContainText(/\d+ FPS · peor cuadro \d+ ms/);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('a tap selects a Channel and a drag scrolls the list', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Lista 2000' }).tap();

    await list(page).getByRole('option', { name: /^3 ·/ }).tap();
    await expect(focused(page)).toContainText('3 ·');

    const box = (await list(page).boundingBox())!;
    const x = box.x + box.width / 2;
    await page.mouse.move(x, box.y + box.height - 20);
    await page.mouse.down();
    await page.mouse.move(x, box.y + 20, { steps: 8 });
    await page.mouse.up();

    await expect(list(page).getByRole('option', { name: /^1 ·/ })).toHaveCount(0);
  });
});
