import { Fingerprint, Menu, X, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSession } from '../context/SessionContext'

const NAV_LINKS = [
  { to: '/accueil', label: 'Accueil' },
  { to: '/statut',  label: 'Statut d\'un acte' },
  { to: '/faq',     label: 'Guide & FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function BrandBar() {
  const { session, clearSession } = useSession()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleReset() {
    clearSession()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-mist-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">

        {/* Logo — officiel IDENTICA */}
        <Link to="/accueil" className="flex items-center gap-2.5 no-underline">
          <img src="/pwa-192x192.png" alt="IDENTICA Logo" className="h-9 w-9 rounded-xl shadow-sm object-cover" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-bold tracking-tight text-navy-900">
              IDENTICA
            </span>
            <span className="text-[9px] font-semibold text-teal-600 tracking-[0.18em] uppercase">
              Portail Citoyen
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to || (to !== '/accueil' && pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className={[
                  'px-3.5 py-2 rounded-lg text-sm font-semibold transition-all no-underline',
                  active
                    ? 'bg-navy-900 text-white'
                    : 'text-ink-600 hover:text-navy-900 hover:bg-mist-100',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right — session + mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Système actif badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/8 px-3 py-1 text-xs font-semibold text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            En ligne
          </div>

          {/* Session */}
          {session.prenom && (
            <div className="hidden items-center gap-2 border-l border-mist-100 pl-3 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                {session.prenom.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block leading-none">
                <p className="text-sm font-semibold text-navy-900">{session.prenom}</p>
                {session.ville && <p className="text-xs text-ink-400">{session.ville}</p>}
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="hidden rounded-lg border border-mist-100 px-3 py-1.5 text-xs font-semibold text-ink-600
              hover:border-navy-100 hover:bg-mist-50 hover:text-navy-900 transition-all sm:block"
          >
            Changer
          </button>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(p => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-mist-100 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-mist-100 bg-white px-4 py-3 md:hidden animate-slide-up">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname === to || (to !== '/accueil' && pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    'px-4 py-2.5 rounded-lg text-sm font-semibold no-underline transition-all',
                    active ? 'bg-navy-900 text-white' : 'text-ink-600 hover:bg-mist-100 hover:text-navy-900',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-coral-600 hover:bg-coral-500/8 text-left"
            >
              Changer de session
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
