import axios from 'axios'
import { SERVICE_EMAIL, SERVICE_PASSWORD, API_BASE } from '../config/serviceAccount'

// Client Axios pointant directement sur le backend IDENTICA
const http = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Token cache ─────────────────────────────────────────────────────────────
let _token = null
let _expiresAt = 0 // timestamp ms

async function getServiceToken() {
  const now = Date.now()
  // Renouveler si le token est absent ou expiré (marge de 60 s)
  if (_token && now < _expiresAt - 60_000) return _token

  const { data } = await http.post('/api/auth/login', {
    email: SERVICE_EMAIL,
    motDePasse: SERVICE_PASSWORD,
  })

  _token = data.accessToken
  _expiresAt = now + (data.expiresIn ?? 900) * 1000
  return _token
}

// ── Recherche d'acte de naissance ────────────────────────────────────────────
/**
 * Recherche un acte de naissance par son numéro (ex. ACT-2026-00001)
 * @param {string} numeroActe
 * @returns {Promise<object>} données de l'acte
 */
export async function searchBirthByNumber(numeroActe) {
  const token = await getServiceToken()
  const { data } = await http.get(`/api/births/numero/${encodeURIComponent(numeroActe)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

/**
 * Recherche des actes de naissance (liste) — filtrage côté client par nom
 * @param {string} nom  Nom à rechercher (comparaison insensible à la casse)
 * @returns {Promise<Array>}
 */
export async function searchBirthsByName(nom) {
  const token = await getServiceToken()
  const { data } = await http.get('/api/births', {
    headers: { Authorization: `Bearer ${token}` },
  })
  // L'API retourne soit un tableau soit { content: [] }
  const list = Array.isArray(data) ? data : (data?.content ?? [])
  if (!nom) return list
  const q = nom.trim().toLowerCase()
  return list.filter((a) => {
    const fullName = `${a.nomEnfant ?? ''} ${a.prenomEnfant ?? ''}`.toLowerCase()
    return fullName.includes(q)
  })
}

// ── Recherche d'acte de décès ─────────────────────────────────────────────
/**
 * Récupère tous les actes de décès et filtre par nom/numéro
 * @param {string} nom
 * @param {string} [numeroActe]
 * @returns {Promise<Array>}
 */
export async function searchDeathActs({ nom, numeroActe }) {
  const token = await getServiceToken()
  const { data } = await http.get('/api/deaths', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const list = Array.isArray(data) ? data : (data?.content ?? [])

  return list.filter((a) => {
    const matchNom = !nom || (a.nameDefunt ?? '').toLowerCase().includes(nom.trim().toLowerCase())
    const matchNum = !numeroActe || (a.numeroActe ?? '').toLowerCase() === numeroActe.trim().toLowerCase()
    return matchNom && matchNum
  })
}

// ── Vérification QR publique ─────────────────────────────────────────────────
/**
 * Vérifie l'authenticité d'un acte via son ID de vérification QR (endpoint public)
 * @param {string} verificationId
 */
export async function verifyQR(verificationId) {
  const { data } = await http.get(`/api/verify/${encodeURIComponent(verificationId)}`)
  return data
}
