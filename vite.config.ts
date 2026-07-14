import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite';

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
        target: 'http://localhost:3000', // fallback target
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\//, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const rawUrl = req.url || '';
            const match = rawUrl.match(/^(https?:\/+(.*))/);
            if (match) {
              try {
                const targetUrlStr = decodeURIComponent(match[1]).replace(/^(https?):\/+/, '$1://');
                const parsedUrl = new URL(targetUrlStr);
                // Update the path to match the target's path and search query
                proxyReq.path = parsedUrl.pathname + parsedUrl.search;
                proxyReq.setHeader('host', parsedUrl.host);
              } catch (e) {
                console.error('Proxy URL parsing error:', e);
              }
            }
          });
        },
        // @ts-expect-error router exists in http-proxy but might not be typed in Vite's ProxyOptions
        router: (req) => {
          const rawUrl = req.url || '';
          const match = rawUrl.match(/^(https?:\/+(.*))/);
          if (match) {
            try {
              const targetUrlStr = decodeURIComponent(match[1]).replace(/^(https?):\/+/, '$1://');
              const parsedUrl = new URL(targetUrlStr);
              return parsedUrl.origin;
            } catch (e) {
              console.error('Proxy Router parsing error:', e);
            }
          }
          return 'http://localhost:3000';
        },
      },
    },
  },
});
