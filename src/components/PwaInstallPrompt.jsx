import React, { useState, useEffect } from 'react'
import { Download, X, Share, PlusSquare } from 'lucide-react'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Si l'utilisateur a déjà fermé la bannière durant cette session
    if (sessionStorage.getItem('pwa_prompt_dismissed')) {
      return
    }

    // Détection si déjà installé en mode Standalone (App lancée depuis l'écran d'accueil)
    const isStandaloneMode = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
    if (isStandaloneMode) {
      setInstalled(true)
      return
    }

    // Détection spécifique iOS / iPhone (ex. iPhone 13 Safari)
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIos(isIosDevice)

    if (isIosDevice) {
      // Sur iPhone/Safari, beforeinstallprompt n'existe pas. On affiche directement le guide iOS.
      setShowPrompt(true)
    }

    const handleBeforeInstallPrompt = (e) => {
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
      <div className="bg-[#09172c]/95 backdrop-blur-md text-white border border-[#1c2f4c] rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="IDENTICA Logo" className="w-11 h-11 rounded-xl border border-[#00e58b]/30 shrink-0 shadow-md" />
            <div>
              <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                Installer IDENTICA sur votre {isIos ? 'iPhone' : 'appareil'}
              </h4>
              <p className="text-xs text-slate-300">
                Accédez rapidement à vos actes d'état civil en 1 clic.
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

        {/* ── Mode Spécifique iPhone 13 (iOS Safari) ── */}
        {isIos ? (
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-xs text-slate-200 space-y-2">
            <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
              Pour installer sur l'écran d'accueil iPhone :
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
              <li className="flex items-center gap-1.5">
                1. Appuyez sur le bouton <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700 font-medium text-white"><Share className="w-3.5 h-3.5 text-emerald-400" /> Partager</span>
              </li>
              <li className="flex items-center gap-1.5">
                2. Faites défiler et choisissez <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700 font-medium text-white"><PlusSquare className="w-3.5 h-3.5 text-emerald-400" /> Sur l'écran d'accueil</span>
              </li>
            </ol>
          </div>
        ) : null}

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Plus tard
          </button>
          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 text-xs font-medium bg-[#00e58b] hover:bg-[#00c778] text-slate-950 rounded-lg flex items-center gap-1.5 font-bold transition-all shadow-md hover:shadow-emerald-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              Installer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
