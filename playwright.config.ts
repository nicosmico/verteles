import { defineConfig } from '@playwright/test';

const PORT = 4173;

// A Samsung Tizen 6.5 user agent: the compatibility floor (ADR-0002).
export const TIZEN_USER_AGENT =
  'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.5) AppleWebKit/537.36 (KHTML, like Gecko) 85.0.4183.93/6.5 TV Safari/537.36';

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    viewport: { width: 1920, height: 1080 },
  },
  // No device presets: they fake the user agent, and Diagnóstico must show the real one.
  projects: [
    {
      // The web build, served over HTTP like GitHub Pages.
      name: 'web',
      testIgnore: /tizen\.spec\.ts$/,
      use: { browserName: 'chromium', baseURL: `http://localhost:${PORT}` },
    },
    {
      // The Tizen build, opened from disk like the TV opens an installed .wgt.
      name: 'tizen',
      testMatch: /tizen\.spec\.ts$/,
      use: { browserName: 'chromium', userAgent: TIZEN_USER_AGENT },
    },
  ],
  webServer: {
    command: `npm run build && npm run build:tizen && npm run preview -- --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
