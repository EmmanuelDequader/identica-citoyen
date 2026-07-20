import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// Fallback du service WS si variable d'environnement absente
const WS_ENDPOINT = import.meta.env.VITE_WS_URL || 'https://identica.duckdns.org/ws-notify'

/**
 * Se connecte au broker WebSocket STOMP et s'abonne aux mises à jour du trackingId citoyen
 * @param {string} trackingId 
 * @param {(data: {trackingId: string, status: string, message: string, timestamp?: string}) => void} onMessage 
 * @returns {() => void} Fonction d'annulation d'abonnement / déconnexion propre
 */
export function subscribeToRequestStatus(trackingId, onMessage) {
  if (!trackingId) return () => {}

  let stompClient = null
  let isConnected = false

  try {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000, // Reconnexion automatique toutes les 5s si coupure
      debug: (msg) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP Citoyen]', msg)
        }
      },
      onConnect: () => {
        isConnected = true
        console.log(`[WebSocket] Connecté au serveur STOMP. Abonnement à /topic/requests/${trackingId}`)
        
        stompClient.subscribe(`/topic/requests/${trackingId}`, (message) => {
          try {
            const payload = JSON.parse(message.body)
            onMessage(payload)
          } catch (err) {
            console.error('[WebSocket] Erreur de parsing du message reçu:', err)
          }
        })
      },
      onStompError: (frame) => {
        console.warn('[WebSocket] Erreur STOMP:', frame.headers['message'])
      },
      onWebSocketClose: () => {
        if (isConnected) {
          console.log('[WebSocket] Connexion fermée. Reconnexion automatique en cours...')
          isConnected = false
        }
      },
    })

    stompClient.activate()
  } catch (err) {
    console.warn('[WebSocket] Erreur lors de l\'initialisation STOMP:', err)
  }

  // Fonction de nettoyage
  return () => {
    if (stompClient) {
      try {
        stompClient.deactivate()
      } catch (err) {
        // Ignore lors du démontage
      }
    }
  }
}

/**
 * Déclenche une mise à jour de statut simulée (Mode démo/mock)
 */
export function simulateStatusChange(trackingId, newStatus, onMessage) {
  const statusMessages = {
    'EN_TRAITEMENT': 'Votre dossier est en cours d\'examen par l\'officier d\'état civil.',
    'VALIDE': 'Votre acte a été validé et est en cours de signature numérique.',
    'PRET': 'Votre document officiel est prêt et téléchargeable !',
    'REJETE': 'Des informations complémentaires sont requises pour valider votre dossier.',
  }

  setTimeout(() => {
    onMessage({
      trackingId,
      status: newStatus,
      message: statusMessages[newStatus] || 'Le statut de votre demande a été mis à jour.',
      timestamp: new Date().toISOString(),
      isSimulated: true,
    })
  }, 1000)
}
