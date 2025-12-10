import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  appType: 'mpa', // show error message (404) instead of home page if route not found
  plugins: [svelte()],
  root: 'src/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: ["two0-sided.onrender.com"],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
