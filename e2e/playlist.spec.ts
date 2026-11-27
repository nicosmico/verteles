import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const ALPLOX_URL = 'https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/channels.m3u';
const fixture = readFileSync('src/domain/playlist/fixtures/alplox-2026-11-26.m3u', 'utf8');

test('Diagnóstico downloads the Lista de Chile and summarizes its Channels and Sources', async ({ page }) => {
  await page.route(ALPLOX_URL, (route) =>
    route.fulfill({ body: fixture, headers: { 'access-control-allow-origin': '*' } }),
  );

  await page.goto('/');

  const row = page.getByRole('row', { name: /Lista de Chile/ });
  await expect(row).toContainText('106 Canales');
  await expect(row).toContainText('188 Fuentes');
  await expect(row).toContainText(/descarga \d+ ms/);
  await expect(row).toContainText(/procesamiento \d+ ms/);
});

test('Diagnóstico reports when the Lista de Chile cannot be downloaded', async ({ page }) => {
  await page.route(ALPLOX_URL, (route) => route.fulfill({ status: 503, headers: { 'access-control-allow-origin': '*' } }));

  await page.goto('/');

  await expect(page.getByRole('row', { name: /Lista de Chile/ })).toContainText('No se pudo descargar (HTTP 503)');
});
