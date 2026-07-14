import {
  FileSearch, BookOpen, ShieldCheck, Clock, ArrowRight,
  Baby, CheckCircle2, Scale, Fingerprint
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import BrandBar from '../components/BrandBar'

const HOW_STEPS = [
  {
    num: '01', icon: Baby, color: 'teal',
    title: 'Sélectionnez le type d\'acte',
    desc: 'Acte de naissance ou de décès — choisissez selon votre situation.',
  },
  {
    num: '02', icon: FileSearch, color: 'gold',
    title: 'Renseignez les informations',
    desc: 'Nom, numéro de l\'acte et votre email. Le numéro figure sur le reçu de déclaration.',
  },
  {
    num: '03', icon: CheckCircle2, color: 'navy',
    title: 'Consultez le statut & le lieu de retrait',
    desc: 'Sachez si votre acte est prêt et où vous rendre pour le récupérer.',
  },
]

function ActionCard({ icon: Icon, title, description, accent, onClick, id, tag }) {
  const map = {
    teal: {
      iconBg: 'bg-teal-500/10', iconColor: 'text-teal-500',
      topLine: 'from-teal-500/0 via-teal-500 to-teal-500/0',
      arrow: 'text-teal-600', hoverShadow: 'hover:shadow-[0_8px_32px_rgba(10,171,114,0.15)]',
      hoverBorder: 'hover:border-teal-500/40', tagCls: 'bg-teal-500/10 text-teal-600',
    },
    gold: {
      iconBg: 'bg-gold-500/10', iconColor: 'text-gold-500',
      topLine: 'from-gold-500/0 via-gold-500 to-gold-500/0',
      arrow: 'text-gold-600', hoverShadow: 'hover:shadow-[0_8px_32px_rgba(211,165,45,0.15)]',
      hoverBorder: 'hover:border-gold-500/40', tagCls: 'bg-gold-500/10 text-gold-600',
    },
  }
  const c = map[accent]
  return (
    <button
      id={id} onClick={onClick}
      className={[
        'group relative w-full text-left rounded-2xl bg-white border-2 border-mist-100',
        'transition-all duration-200 shadow-sm overflow-hidden cursor-pointer',
        c.hoverBorder, c.hoverShadow,
      ].join(' ')}
    >
      <div className={`h-[3px] w-full bg-gradient-to-r ${c.topLine} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="p-7 sm:p-8">
        {tag && <span className={`mb-4 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${c.tagCls}`}>{tag}</span>}
        <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${c.iconBg} transition-transform duration-200 group-hover:scale-110`}>
          <Icon className={`h-7 w-7 ${c.iconColor}`} strokeWidth={1.7} />
        </div>
        <h2 className="font-display text-xl font-bold text-navy-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
        <div className={`mt-6 flex items-center gap-2 text-sm font-bold ${c.arrow}`}>
          Accéder
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </div>
      </div>
    </button>
  )
}

export default function Home() {
  const { session } = useSession()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="min-h-screen bg-mist-50">
      <BrandBar />

      {/* ── Hero — identica-front style: navy-900 bg ── */}
      <section className="relative overflow-hidden bg-navy-900 pb-24 pt-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-navy-800/60 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-teal-500/15 px-3 py-1 ring-1 ring-teal-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">IDENTICA · Portail Citoyen</span>
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {greeting}{session.prenom ? <span className="text-teal-400">, {session.prenom}</span> : ''} 👋
          </h1>
          <p className="mt-3 max-w-lg text-base text-white/60">
            Que souhaitez-vous faire aujourd'hui ?{session.ville ? <span className="text-white/40"> · {session.ville}</span> : ''}
          </p>
        </div>
      </section>

      {/* ── Action cards (overlap hero) ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-12">
        <div className="grid gap-5 sm:grid-cols-2">
          <ActionCard
            id="btn-statut-acte" icon={FileSearch}
            title="Statut de l'acte"
            description="Vérifiez si l'acte de naissance ou de décès de votre enfant est prêt et découvrez où le retirer."
            accent="teal" tag="Suivi en temps réel" onClick={() => navigate('/statut')}
          />
          <ActionCard
            id="btn-guide-faq" icon={BookOpen}
            title="Guide & Procédures"
            description="Consultez les textes de loi, délais légaux, pièces à fournir et procédures d'état civil au Cameroun."
            accent="gold" tag="Guide légal complet" onClick={() => navigate('/faq')}
          />
        </div>
      </section>

      {/* ── How it works — white card ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10">
        <div className="rounded-2xl border border-mist-100 bg-navy-900 p-8 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-400/80 mb-1">Mode d'emploi</p>
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Comment ça fonctionne ?</h2>
            </div>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <Fingerprint className="h-5 w-5 text-teal-400" />
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_STEPS.map((step, i) => {
              const colorMap = {
                teal: { iconBg: 'bg-teal-500/15', icon: 'text-teal-400', num: 'text-teal-400' },
                gold: { iconBg: 'bg-gold-500/15', icon: 'text-gold-400', num: 'text-gold-400' },
                navy: { iconBg: 'bg-navy-100/10', icon: 'text-navy-100', num: 'text-navy-100' },
              }
              const c = colorMap[step.color]
              const StepIcon = step.icon
              return (
                <div key={step.num} className="relative">
                  {i < HOW_STEPS.length - 1 && (
                    <div className="hidden sm:block absolute top-6 left-full w-full h-px bg-white/10 -translate-y-1/2" />
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.iconBg} ring-1 ring-white/10`}>
                      <StepIcon className={`h-5 w-5 ${c.icon}`} />
                    </div>
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${c.num}`}>{step.num}</span>
                      <h3 className="mt-0.5 text-sm font-bold text-white/90">{step.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-white/50">{step.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-6 mb-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, color: 'text-teal-500', bg: 'bg-teal-500/8', label: 'Données chiffrées HTTPS', sub: 'Connexion sécurisée' },
            { icon: Scale,       color: 'text-gold-500', bg: 'bg-gold-500/8', label: 'Conforme Ord. 81/002',   sub: 'Base légale reconnue' },
            { icon: Clock,       color: 'text-navy-700', bg: 'bg-navy-100',   label: 'Disponible 24h/24',      sub: 'Service permanent' },
          ].map(({ icon: Icon, color, bg, label, sub }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl bg-white border border-mist-100 px-5 py-4 shadow-sm">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-900">{label}</p>
                <p className="text-xs text-ink-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-mist-100 bg-white py-6 text-center">
        <p className="text-xs text-ink-400">
          Portail IDENTICA · BUNEC · MINAT · 🇨🇲 République du Cameroun<br />
          Ord. n° 81/002 du 29 juin 1981 · Loi n° 2011/011 du 6 mai 2011
        </p>
      </footer>
    </div>
  )
}
