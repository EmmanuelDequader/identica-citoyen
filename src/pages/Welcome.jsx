import { Fingerprint, ShieldCheck, FileText, Users, Clock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import Button from '../components/ui/Button'

// Animated statistic counter
function AnimatedStat({ value, label, icon: Icon, color }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon className={`h-5 w-5 ${color} mb-1`} />
      <span className="font-display text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/50 leading-tight">{label}</span>
    </div>
  )
}

export default function Welcome() {
  const { updateSession } = useSession()
  const navigate = useNavigate()
  const [form, setForm] = useState({ prenom: '', ville: '' })

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    updateSession({ prenom: form.prenom.trim(), ville: form.ville.trim() })
    navigate('/accueil')
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy-950">

      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-orb-pulse absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-teal-500/12 blur-[80px]" />
        <div className="animate-orb-pulse delay-2000 absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full bg-navy-700/50 blur-[80px]" />
        <div className="animate-orb-pulse delay-1000 absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/6 blur-[60px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Decorative rings ── */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[700px] w-[700px] rounded-full border border-white/[0.025]" />
        <div className="absolute inset-[80px] rounded-full border border-white/[0.04]" />
        <div className="absolute inset-[160px] rounded-full border border-teal-500/[0.08]" />
        <div className="absolute inset-[240px] rounded-full border border-teal-500/[0.12]" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16">

        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-5 animate-slide-up">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-3 rounded-3xl bg-teal-500/10 blur-xl animate-orb-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/[0.06] ring-1 ring-white/15 backdrop-blur-sm">
              <Fingerprint className="h-12 w-12 text-teal-400 animate-float" strokeWidth={1.4} />
            </div>
            {/* Status dot */}
            <div className="absolute -top-1 -right-1">
              <div className="relative h-4 w-4">
                <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping-slow" />
                <div className="relative h-4 w-4 rounded-full bg-teal-400 border-2 border-navy-950" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-400/70 mb-2">
              République du Cameroun · BUNEC · MINAT
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              IDENTICA
            </h1>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-semibold text-teal-300 tracking-wider uppercase">
                Portail Citoyen · En ligne
              </span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-10 text-center animate-slide-up delay-100">
          <p className="text-xl font-medium text-white/80 sm:text-2xl">
            Chaque acte compte.{' '}
            <span className="gradient-text-teal font-bold">Chaque famille mérite de savoir.</span>
          </p>
          <p className="mt-2 text-sm text-white/40 max-w-sm mx-auto">
            Consultez le statut de l'acte d'état civil de votre enfant, sans inscription.
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md animate-slide-up delay-200">
          <div className="rounded-2xl bg-white/[0.06] p-8 ring-1 ring-white/10 backdrop-blur-xl">
            <h2 className="font-display text-lg font-bold text-white mb-1">
              Personnalisez votre session
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Ces informations restent sur votre appareil.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/65">
                  Votre prénom <span className="text-white/25">(optionnel)</span>
                </label>
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Ex : Aminatou"
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3
                    text-sm text-white placeholder:text-white/25 transition-all
                    focus:border-teal-500/50 focus:bg-white/12 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/65">
                  Votre ville <span className="text-white/25">(optionnel)</span>
                </label>
                <input
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  placeholder="Ex : Yaoundé, Douala, Bafoussam…"
                  className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3
                    text-sm text-white placeholder:text-white/25 transition-all
                    focus:border-teal-500/50 focus:bg-white/12 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <Button type="submit" variant="teal" size="lg" className="mt-2 w-full text-base font-bold">
                Accéder au portail →
              </Button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-white/30" />
              <p className="text-center text-xs text-white/30">
                Données locales uniquement · Aucune transmission serveur
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 w-full max-w-md animate-slide-up delay-400">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] px-6 py-5">
            <div className="grid grid-cols-3 gap-4 divide-x divide-white/[0.08]">
              <AnimatedStat icon={FileText}   color="text-teal-400" value="12 000+" label="Actes traités" />
              <div className="pl-4">
                <AnimatedStat icon={Users}    color="text-gold-400" value="8 régions" label="Couverture" />
              </div>
              <div className="pl-4">
                <AnimatedStat icon={Clock}    color="text-navy-100" value="24h/24" label="Disponible" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/[0.05] py-4 text-center">
        <p className="text-xs text-white/20">
          IDENTICA · Système National Digitalisé d'État Civil · Cameroun 🇨🇲
        </p>
      </div>
    </div>
  )
}
