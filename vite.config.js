import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 3001,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://identica.duckdns.org',
        changeOrigin: true,
        secure: true,
      },
      '/verify': {
        target: 'https://identica.duckdns.org',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
