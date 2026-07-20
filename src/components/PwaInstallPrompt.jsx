import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone, ShieldCheck } from 'lucide-react'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Si l'utilisateur a déjà fermé le prompt durant cette session
    if (sessionStorage.getItem('pwa_prompt_dismissed')) {
      return
    }

    const handleBeforeInstallPrompt = (e) => {
      // Empêcher l'affichage automatique natif non-intrusif
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('pwa_prompt_dismissed', 'true')
  }

  if (!showPrompt || installed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-bounce-short">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="IDENTICA Logo" className="w-10 h-10 rounded-xl border border-[#0aab72]/40 shrink-0 shadow-sm" />
            <div>
              <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                Installer l'application IDENTICA
              </h4>
              <p className="text-xs text-slate-300">
                Accédez rapidement à vos suivis d'actes et notifications hors-ligne.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Plus tard
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-1.5 text-xs font-medium bg-[#0aab72] hover:bg-[#089663] text-slate-950 rounded-lg flex items-center gap-1.5 font-semibold transition-all shadow-md hover:shadow-emerald-900/30"
          >
            <Download className="w-3.5 h-3.5" />
            Installer
          </button>
        </div>
      </div>
    </div>
  )
}
