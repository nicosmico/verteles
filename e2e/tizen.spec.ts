import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

const tizenIndex = pathToFileURL(`${process.cwd()}/dist-tizen/index.html`).href;

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
