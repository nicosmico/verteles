import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const fixture = readFileSync('src/domain/playlist/fixtures/alplox-2026-11-26.m3u', 'utf8');

/**
 * Serves the Lista de Chile from the fixture and fails every stream. The test
 * browser cannot decode H.264 anyway: actual video is verified on the TV (H3).
 */
async function offlineStreams(page: Page) {
  await page.route(/raw\.githubusercontent\.com/, (route) =>
    route.fulfill({ body: fixture, headers: { 'access-control-allow-origin': '*' } }),
  );
  await page.route(/\.m3u8|\/live\/|\/hls\//, (route) => route.fulfill({ status: 404 }));
}

test.beforeEach(async ({ page }) => offlineStreams(page));

test('Reproducción tunes Channel 1 and, when no Source plays, says the Channel is unavailable', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('F2');

  await expect(page.getByTestId('now-playing')).toContainText('1 · 24 horas');
  await expect(page.getByTestId('tuner-status')).toHaveText('Canal no disponible', { timeout: 20_000 });
});

test('CH+ and CH− zap between Channels, wrapping around the Lista', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('F2');
  await expect(page.getByTestId('now-playing')).toContainText('1 · 24 horas');

  await page.keyboard.press('PageUp');
  await expect(page.getByTestId('now-playing')).toContainText('2 · Radio ADN');

  await page.keyboard.press('PageDown');
  await page.keyboard.press('PageDown');
  await expect(page.getByTestId('now-playing')).toContainText('106 ·');
});

test('the app reopens on the last Channel tuned', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('F2');
  await expect(page.getByTestId('now-playing')).toContainText('1 · 24 horas');
  await page.keyboard.press('PageUp');
  await expect(page.getByTestId('now-playing')).toContainText('2 · Radio ADN');
  await expect.poll(() => storedLastChannel(page)).toBe('radio adn [cl]');

  await page.reload();
  await page.keyboard.press('F2');

  await expect(page.getByTestId('now-playing')).toContainText('2 · Radio ADN');
});

test('a slow startup never overrides a Channel the viewer already chose', async ({ page }) => {
  // Make every IndexedDB read take 1.5 s, so the app is still looking up the last Channel.
  await page.addInitScript(() => {
    const get = IDBObjectStore.prototype.get;
    IDBObjectStore.prototype.get = function (this: IDBObjectStore, key: IDBValidKey | IDBKeyRange) {
      const request = get.call(this, key);
      let handler: ((event: Event) => void) | null = null;
      request.addEventListener('success', (event) => setTimeout(() => handler?.call(request, event), 1500));
      Object.defineProperty(request, 'onsuccess', { set: (next) => (handler = next), get: () => handler });
      return request;
    };
  });
  await page.goto('/');
  await page.keyboard.press('F2');
  // Reproducción is on screen (its buttons render at once) but has not tuned anything yet.
  await expect(page.getByRole('button', { name: 'Canal siguiente' })).toBeVisible();
  await expect(page.getByTestId('now-playing')).toHaveCount(0);

  await page.keyboard.press('PageUp');
  await expect(page.getByTestId('now-playing')).toContainText('2 · Radio ADN');
  await page.waitForTimeout(2000); // The delayed lookup finishes in here.

  await expect(page.getByTestId('now-playing')).toContainText('2 · Radio ADN');
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('Channels can be changed by tapping', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Reproducción' }).tap();
    await expect(page.getByTestId('now-playing')).toContainText('1 · 24 horas');

    await page.getByRole('button', { name: 'Canal siguiente' }).tap();

    await expect(page.getByTestId('now-playing')).toContainText('2 · Radio ADN');
  });
});

/** Reads the persisted last Channel straight from IndexedDB, to wait for the write before reloading. */
function storedLastChannel(page: Page) {
  return page.evaluate(
    () =>
      new Promise<unknown>((resolve, reject) => {
        const open = indexedDB.open('verteles');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const get = open.result.transaction('kv').objectStore('kv').get('lastChannel');
          get.onsuccess = () => {
            open.result.close();
            resolve(get.result);
          };
          get.onerror = () => reject(get.error);
        };
      }),
  );
}
