import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite';

// ─── Proxy helper ─────────────────────────────────────────────────────────────
// Extracts the target URL from a proxy path of the form:
//   /proxy/https://example.com/path  (before rewrite)
//   https://example.com/path         (after rewrite, in proxyReq event)
function extractTargetUrl(reqUrl: string): URL | null {
  // Strip the leading /proxy/ prefix if still present (proxyReq fires before rewrite)
  const stripped = reqUrl.replace(/^\/proxy\//, '');
  // Normalise double slashes after the scheme: https:// or https:/
  const normalised = stripped.replace(/^(https?):\/+/, '$1://');
  if (!/^https?:\/\//.test(normalised)) return null;
  try {
    return new URL(decodeURIComponent(normalised));
  } catch {
    return null;
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['chrome >= 47'],
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/proxy': {
        target: 'http://localhost:3000', // overridden per-request by `router`
        changeOrigin: true,
        // Keep the rewrite as a safety net for any code that relies on req.url
        rewrite: (path) => path.replace(/^\/proxy\//, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // req.url here still has the /proxy/ prefix (fires before rewrite)
            const parsed = extractTargetUrl(req.url || '');
            if (parsed) {
              proxyReq.path = parsed.pathname + parsed.search;
              proxyReq.setHeader('host', parsed.host);
            }
            // Some hosts (e.g. GitHub raw) reject requests without a User-Agent
            proxyReq.setHeader(
              'User-Agent',
              'Mozilla/5.0 (compatible; Verteles/1.0)'
            );
            // Remove headers that can cause issues with cross-origin requests
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
        // @ts-expect-error router exists in http-proxy but might not be typed in Vite's ProxyOptions
        router: (req) => {
          const parsed = extractTargetUrl(req.url || '');
          return parsed ? parsed.origin : 'http://localhost:3000';
        },
      },
    },
  },
});
