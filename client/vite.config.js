import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  appType: 'mpa', // show error message (404) instead of home page if route not found
  plugins: [svelte()],
  root: 'src/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        browse: resolve(__dirname, 'src/browse/index.html'),
        builder: resolve(__dirname, 'src/builder/index.html'),
        details: resolve(__dirname, 'src/details/index.html'),
        profile: resolve(__dirname, 'src/profile/index.html')
      }
    }
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
