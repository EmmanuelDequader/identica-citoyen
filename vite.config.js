import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  define: {
    global: 'window',
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        short_name: 'IDENTICA',
        name: 'IDENTICA — Portail Citoyen du Registre Civil',
        description: "Portail numérique citoyen de suivi du registre civil pour le Cameroun. Recevez vos notifications en temps réel.",
        theme_color: '#09172c',
        background_color: '#09172c',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
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
