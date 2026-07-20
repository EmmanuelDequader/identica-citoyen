// Service Worker pour IDENTICA (PWA + Web Push)
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// Nettoyage et pré-caching géré par vite-plugin-pwa (injectManifest)
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// ── Gestion de la réception des notifications Web Push (Onglet fermé ou ouvert) ──
self.addEventListener('push', (event) => {
  let data = {}
  try {
    if (event.data) {
      data = event.data.json()
    }
  } catch (err) {
    data = {
      title: 'IDENTICA — Mise à jour',
      body: event.data ? event.data.text() : 'Le statut de votre demande a évolué.',
    }
  }

  const title = data.title || 'IDENTICA — Registre Civil'
  const trackingId = data.trackingId || ''
  const targetUrl = data.url || (trackingId ? `/statut/resultat` : '/')

  const options = {
    body: data.body || data.message || "Le statut de votre requête d'acte a été mis à jour.",
    icon: '/pwa-192x192.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    tag: trackingId ? `identica-request-${trackingId}` : 'identica-notice',
    renotify: true,
    data: {
      url: targetUrl,
      trackingId: trackingId,
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// ── Clic sur une notification Web Push ──────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
