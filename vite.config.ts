/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import solid from 'vite-plugin-solid';

// Platforms are chosen at build time (ADR-0005): `--mode tizen` bundles only
// the Tizen adapter. Any other mode (development, test, web) uses the web one.
const PLATFORMS = ['web', 'tizen'] as const;
type PlatformName = (typeof PLATFORMS)[number];

function platformFor(mode: string): PlatformName {
  return (PLATFORMS as readonly string[]).includes(mode) ? (mode as PlatformName) : 'web';
}

/**
 * A packaged Tizen app is loaded from local files, where Chromium refuses ES
 * module scripts. The Tizen build is a single classic script (IIFE), so the
 * HTML must load it without `type="module"` or `crossorigin`. It also loads
 * Samsung's WebAPIs (product info, AVPlay), which the TV serves at $WEBAPIS.
 */
function tizenHtml(): Plugin {
  return {
    name: 'verteles:tizen-html',
    transformIndexHtml: {
      order: 'post',
      handler: (html) =>
        html
          .replace(/<script type="module" crossorigin/g, '<script defer')
          .replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"')
          .replace('</head>', '  <script src="$WEBAPIS/webapis/webapis.js"></script>\n  </head>'),
    },
  };
}

export default defineConfig(({ mode }) => {
  const platform = platformFor(mode);
  const isTizen = platform === 'tizen';

  return {
    // Relative base so the same build works on GitHub Pages sub-paths,
    // PR previews and inside a packaged TV app (file://).
    base: './',
    // Tizen ships its own static files: config.xml and the app icon.
    publicDir: isTizen ? 'src/platform/tizen/public' : 'public',
    plugins: [solid(), ...(isTizen ? [tizenHtml()] : [])],
    resolve: {
      alias: {
        '@platform': fileURLToPath(new URL(`./src/platform/${platform}/index.ts`, import.meta.url)),
      },
    },
    build: {
      outDir: isTizen ? 'dist-tizen' : 'dist',
      // Compatibility floor: Chromium 85 / ES2020 (ADR-0002).
      target: 'chrome85',
      cssTarget: 'chrome85',
      ...(isTizen && {
        modulePreload: false,
        rollupOptions: { output: { format: 'iife' as const, inlineDynamicImports: true } },
      }),
    },
    test: {
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'node',
    },
  };
});
