import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: '0.0.0.0',
    allowedHosts: [
      '.sandbox.novita.ai',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api': {
        target: 'https://api.balldontlie.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
