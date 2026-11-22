import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false
      },
      // nanobot gateway HTTP API (hosted micro-frontend). Rewrites the
      // same-origin prefix back to the gateway's literal paths.
      '/nanobot-api': {
        target: 'http://127.0.0.1:8765',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/nanobot-api/, '')
      },
      // nanobot gateway WebSocket. The WS path (e.g. '/') is preserved by
      // the rewrite so the gateway handshake dispatch matches.
      '/nanobot-ws': {
        target: 'ws://127.0.0.1:8765',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (p) => p.replace(/^\/nanobot-ws/, '') || '/'
      }
    }
  }
});
