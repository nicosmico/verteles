import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

const tizenIndex = pathToFileURL(`${process.cwd()}/dist-tizen/index.html`).href;

// Keep these tests offline: Diagnóstico downloads the Lista de Chile on start.
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\//, (route) => route.fulfill({ status: 503 }));
});

test('the Tizen build boots from local files and identifies itself as Tizen', async ({ page }) => {
  await page.goto(tizenIndex);

  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();
  await expect(page.getByRole('row', { name: /Plataforma/ })).toContainText('Tizen (Samsung)');
  await expect(page.getByRole('row', { name: /Chromium/ })).toContainText('85.0.4183.93');
});

test("on a TV, Diagnóstico shows the model, firmware and Tizen version reported by Samsung's APIs", async ({ page }) => {
  // Stand-ins for the globals a Samsung TV provides to installed apps.
  await page.addInitScript(() => {
    Object.assign(window, {
      webapis: {
        productinfo: {
          getRealModel: () => 'QN50QEF1AGXZS',
          getFirmware: () => 'T-PTMDEUC-1300.0',
        },
      },
      tizen: {
        systeminfo: {
          getCapability: (key: string) =>
            key === 'http://tizen.org/feature/platform.version' ? '9.0' : undefined,
        },
      },
    });
  });

  await page.goto(tizenIndex);

  await expect(page.getByRole('row', { name: /Modelo/ })).toContainText('QN50QEF1AGXZS');
  await expect(page.getByRole('row', { name: /Firmware/ })).toContainText('T-PTMDEUC-1300.0');
  // The platform API wins over the user agent, which here claims 6.5.
  await expect(page.getByRole('row', { name: /^Tizen/ })).toContainText('9.0');
});

test('on a TV, the app registers the remote keys, reads Samsung key codes and exits on Back twice', async ({ page }) => {
  await page.addInitScript(() => {
    const calls = { registered: [] as string[], exited: 0 };
    Object.assign(window, {
      __samsung: calls,
      tizen: {
        tvinputdevice: { registerKey: (name: string) => calls.registered.push(name) },
        application: { getCurrentApplication: () => ({ exit: () => calls.exited++ }) },
      },
    });
  });
  const pressKeyCode = (keyCode: number) =>
    page.evaluate((code) => {
      // Samsung remotes only report keyCode, which KeyboardEvent's constructor cannot set.
      const event = new KeyboardEvent('keydown', { bubbles: true });
      Object.defineProperty(event, 'keyCode', { value: code });
      window.dispatchEvent(event);
    }, keyCode);
  const samsung = () => page.evaluate(() => (window as unknown as { __samsung: { registered: string[]; exited: number } }).__samsung);

  await page.goto(tizenIndex);
  await expect(page.getByRole('heading', { name: 'Diagnóstico' })).toBeVisible();

  expect((await samsung()).registered).toEqual(
    expect.arrayContaining(['ChannelUp', 'ChannelDown', 'MediaPlayPause', 'ColorF0Red', '0', '9']),
  );

  await pressKeyCode(427);
  await expect(page.getByRole('row', { name: /Última tecla/ })).toContainText('ChannelUp (427)');

  await pressKeyCode(10009);
  await expect(page.getByRole('status')).toHaveText('Presiona Back otra vez para salir');
  expect((await samsung()).exited).toBe(0);

  await pressKeyCode(10009);
  await expect.poll(async () => (await samsung()).exited).toBe(1);
});
