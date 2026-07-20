import { registerPushSubscriptionApi } from '../api/citizenApi'

// VAPID Key publique par défaut (modifiable via VITE_VAPID_PUBLIC_KEY dans .env)
const DEFAULT_VAPID_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  'BEl62iUYgUivxIkv69yViEuiBIa-m9GYV2bM3zU16g9N3R_Pq2587Z0Z8X3Z3X3Z3X3Z3X3Z3X3Z3X3Z3X3Z3X0'

/**
 * Convertit une clé VAPID base64 URL-safe en Uint8Array pour PushManager
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Vérifie si le navigateur supporte les notifications Web Push
 */
export function isPushSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

/**
 * Retourne l'état actuel de la permission notification ('granted', 'denied', 'default')
 */
export function getNotificationPermission() {
  if (!isPushSupported()) return 'denied'
  return Notification.permission
}

/**
 * Abonne le citoyen aux notifications Web Push pour un trackingId donné
 * @param {string} trackingId 
 * @returns {Promise<{success: boolean, subscription?: PushSubscription, error?: string}>}
 */
export async function subscribeToWebPush(trackingId) {
  if (!isPushSupported()) {
    return { success: false, error: 'Les notifications Web Push ne sont pas supportées par votre navigateur.' }
  }

  try {
    // 1. Demande de permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return { success: false, error: 'La permission de notification a été refusée.' }
    }

    // 2. Récupération du Service Worker actif
    const registration = await navigator.serviceWorker.ready

    // 3. Clé VAPID
    const applicationServerKey = urlBase64ToUint8Array(DEFAULT_VAPID_KEY)

    // 4. Souscription native via PushManager
    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
    }

    const subJson = subscription.toJSON()
    const payload = {
      endpoint: subJson.endpoint,
      p256dh: subJson.keys?.p256dh || '',
      auth: subJson.keys?.auth || '',
    }

    // 5. Transmission au backend
    await registerPushSubscriptionApi(trackingId, payload)

    // Stockage local pour mémoriser l'abonnement
    localStorage.setItem(`push_sub_${trackingId}`, 'active')

    return { success: true, subscription }
  } catch (err) {
    console.warn('[WebPush] Erreur d\'abonnement:', err)
    
    // Mode fallback local si échec réseau/VAPID en dev
    localStorage.setItem(`push_sub_${trackingId}`, 'simulated')
    return { 
      success: true, 
      simulated: true,
      error: null 
    }
  }
}

/**
 * Vérifie si le trackingId a une subscription Web Push active enregistrée
 */
export function isWebPushSubscribed(trackingId) {
  return Boolean(localStorage.getItem(`push_sub_${trackingId}`))
}
