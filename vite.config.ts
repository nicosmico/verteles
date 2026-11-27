/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

// Platforms are chosen at build time (ADR-0005): `--mode tizen` bundles only
// the Tizen adapter. Any other mode (development, test, web) uses the web one.
const PLATFORMS = ['web', 'tizen'] as const;
type PlatformName = (typeof PLATFORMS)[number];

function platformFor(mode: string): PlatformName {
  return (PLATFORMS as readonly string[]).includes(mode) ? (mode as PlatformName) : 'web';
}

export default defineConfig(({ mode }) => ({
  // Relative base so the same build works on GitHub Pages sub-paths,
  // PR previews and inside a packaged TV app (file://).
  base: './',
  plugins: [solid()],
  resolve: {
    alias: {
      '@platform': fileURLToPath(new URL(`./src/platform/${platformFor(mode)}/index.ts`, import.meta.url)),
    },
  },
  build: {
    // Compatibility floor: Chromium 85 / ES2020 (ADR-0002).
    target: 'chrome85',
    cssTarget: 'chrome85',
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
  },
}));
