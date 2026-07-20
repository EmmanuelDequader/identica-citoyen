import React, { useState, useEffect } from 'react'
import { Bell, Smartphone, Check, Send, AlertCircle, RefreshCw } from 'lucide-react'
import { subscribeToWebPush, isWebPushSubscribed, isPushSupported } from '../services/pushNotificationService'
import { updateCitizenPhoneApi } from '../api/citizenApi'
import { simulateStatusChange } from '../services/websocketService'

export default function NotificationChannelsWidget({ trackingId, currentStatus, onStatusSimulated }) {
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [loadingPush, setLoadingPush] = useState(false)
  const [pushError, setPushError] = useState(null)
  
  const [phone, setPhone] = useState('')
  const [phoneSaved, setPhoneSaved] = useState(false)
  const [loadingPhone, setLoadingPhone] = useState(false)
  const [phoneError, setPhoneError] = useState(null)

  const pushSupported = isPushSupported()

  useEffect(() => {
    if (trackingId) {
      setPushSubscribed(isWebPushSubscribed(trackingId))
      const savedPhone = localStorage.getItem(`phone_${trackingId}`)
      if (savedPhone) {
        setPhone(savedPhone)
        setPhoneSaved(true)
      }
    }
  }, [trackingId])

  const handleSubscribePush = async () => {
    if (!trackingId) return
    setLoadingPush(true)
    setPushError(null)

    const res = await subscribeToWebPush(trackingId)
    setLoadingPush(false)

    if (res.success) {
      setPushSubscribed(true)
    } else {
      setPushError(res.error || 'Impossible d\'activer le canal Web Push.')
    }
  }

  const handleSavePhone = async (e) => {
    e.preventDefault()
    if (!trackingId || !phone.trim()) return

    // Validation simple numéro Cameroun (+237 ou 6XXXXXXXX)
    const cleanPhone = phone.replace(/\s+/g, '')
    const isCameroon = /^((\+?237)?6[5-9]\d{7})$/.test(cleanPhone)

    if (!isCameroon) {
      setPhoneError('Veuillez entrer un numéro camerounais valide (ex. 699123456 ou +237699123456).')
      return
    }

    setLoadingPhone(true)
    setPhoneError(null)

    const fullPhone = cleanPhone.startsWith('+237') ? cleanPhone : `+237${cleanPhone.replace(/^237/, '')}`
    const res = await updateCitizenPhoneApi(trackingId, fullPhone)
    setLoadingPhone(false)

    if (res.success) {
      setPhoneSaved(true)
      localStorage.setItem(`phone_${trackingId}`, fullPhone)
    } else {
      setPhoneError('Erreur lors de l\'enregistrement du numéro SMS.')
    }
  }

  return (
    <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-[#0c2551]/95 to-slate-900 text-white p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0aab72]/15 text-[#0aab72] border border-[#0aab72]/30">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-slate-100">Notifications du suivi citoyen</h3>
            <p className="text-xs text-slate-400">Restez informé de l'avancement de votre requête en temps réel.</p>
          </div>
        </div>
        
        {/* Simulation démo test */}
        {onStatusSimulated && (
          <button
            onClick={() => {
              const nextStatus = currentStatus === 'pending' ? 'confirmed' : 'pending'
              simulateStatusChange(trackingId, nextStatus, onStatusSimulated)
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700 transition-colors"
            title="Simuler la réception d'un événement WebSocket"
          >
            <RefreshCw className="w-3 h-3" />
            Test Live STOMP
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* ── Canal 1 : Web Push ── */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/80 p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Canal Web Push
              </span>
              {pushSubscribed && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Check className="w-3 h-3" /> Actif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recevez des notifications système même lorsque l'application ou votre navigateur est fermé.
            </p>
            {pushError && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {pushError}
              </p>
            )}
          </div>

          <div>
            {!pushSupported ? (
              <p className="text-[11px] text-slate-400 italic">Non supporté sur ce navigateur</p>
            ) : pushSubscribed ? (
              <button
                disabled
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Web Push activé sur cet appareil
              </button>
            ) : (
              <button
                onClick={handleSubscribePush}
                disabled={loadingPush}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#0aab72] hover:bg-[#089663] text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                {loadingPush ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" /> Activer Web Push (Navigateur)
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Canal 2 : SMS (Fallback) ── */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/80 p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Canal SMS (Fallback)
              </span>
              {phoneSaved && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Check className="w-3 h-3" /> Enregistré
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              En cas d'absence de Web Push active, recevez un SMS court au changement de statut de votre demande.
            </p>
            {phoneError && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {phoneError}
              </p>
            )}
          </div>

          <form onSubmit={handleSavePhone} className="flex gap-2">
            <input
              type="tel"
              placeholder="Ex: 699123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loadingPhone || !phone.trim()}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
            >
              {loadingPhone ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              OK
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
