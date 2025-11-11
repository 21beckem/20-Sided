import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svelte()],
  root: 'client/src',
  build: {
    outDir: '../public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'client/src/pages/index.html'),
        login: resolve(__dirname, 'client/src/pages/login.html'),
        register: resolve(__dirname, 'client/src/pages/register.html'),
        dashboard: resolve(__dirname, 'client/src/pages/dashboard.html'),
        'my-maps': resolve(__dirname, 'client/src/pages/my-maps.html'),
        'map-editor': resolve(__dirname, 'client/src/pages/map-editor.html'),
        'my-chunks': resolve(__dirname, 'client/src/pages/my-chunks.html'),
        'public-maps': resolve(__dirname, 'client/src/pages/public-maps.html'),
        session: resolve(__dirname, 'client/src/pages/session.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: '/pages/index.html',
  },
});
