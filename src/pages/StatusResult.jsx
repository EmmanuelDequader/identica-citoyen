import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, CheckCircle2, Clock, XCircle, AlertCircle,
  Baby, HeartCrack, Calendar, MapPin, Hash, User, FileText,
  QrCode, List, Building2, Phone, ChevronDown, ChevronUp,
  ArrowRight, Info, Printer, Share2, BookOpen, Bell, Zap, X
} from 'lucide-react'
import BrandBar from '../components/BrandBar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import NotificationChannelsWidget from '../components/NotificationChannelsWidget'
import { subscribeToRequestStatus } from '../services/websocketService'


// ── Status configuration ──────────────────────────────────────────────────────

function resolveStatus(act) {
  const raw = (act?.statut ?? act?.status ?? act?.etat ?? '').toString().toUpperCase()
  if (['CONFIRME', 'CONFIRMÉ', 'CONFIRMED', 'VALIDE', 'VALIDÉ'].includes(raw)) return 'confirmed'
  if (['EN_ATTENTE', 'PENDING', 'EN ATTENTE', 'ATTENTE'].includes(raw))         return 'pending'
  if (['REJETE', 'REJETÉ', 'REJECTED', 'REFUSE', 'REFUSÉ'].includes(raw))       return 'rejected'
  if (raw) return 'unknown'
  if (act?.numeroActe) return 'confirmed'
  return 'pending'
}

const STATUS_CONFIG = {
  confirmed: {
    icon: CheckCircle2,
    color: 'text-teal-500',
    heroBg: 'bg-teal-500/10 border border-teal-500/20',
    textColor: 'text-teal-900',
    lightBg: 'bg-teal-500/8',
    border: 'border-teal-500/20',
    tone: 'success',
    label: 'Acte établi et confirmé ✓',
    desc: 'L\'acte a été signé par l\'officier d\'état civil. Il est disponible au centre d\'état civil.',
    timelineStep: 3,
  },
  pending: {
    icon: Clock,
    color: 'text-gold-500',
    heroBg: 'bg-gold-500/10 border border-gold-500/20',
    textColor: 'text-gold-900',
    lightBg: 'bg-gold-500/8',
    border: 'border-gold-500/20',
    tone: 'warning',
    label: 'En cours de traitement',
    desc: 'Votre déclaration a été enregistrée. Le dossier est en attente de validation par le Maire.',
    timelineStep: 2,
  },
  rejected: {
    icon: XCircle,
    color: 'text-coral-500',
    heroBg: 'bg-coral-500/10 border border-coral-500/20',
    textColor: 'text-coral-900',
    lightBg: 'bg-coral-500/8',
    border: 'border-coral-500/20',
    tone: 'danger',
    label: 'Dossier rejeté',
    desc: 'Votre dossier n\'a pas pu être traité. Une intervention est nécessaire.',
    timelineStep: 1,
  },
  unknown: {
    icon: AlertCircle,
    color: 'text-ink-400',
    heroBg: 'bg-mist-100 border border-mist-100',
    textColor: 'text-ink-900',
    lightBg: 'bg-mist-100',
    border: 'border-mist-100',
    tone: 'neutral',
    label: 'Statut en attente',
    desc: 'Le statut de cet acte est en cours de mise à jour.',
    timelineStep: 1,
  },
}

// ── Pickup instruction generator ──────────────────────────────────────────────

function getPickupInfo(act, status) {
  const lieu = act?.centreEtatCivil ?? act?.arrondissement ?? 'la mairie compétente'
  const numero = act?.numeroActe ?? act?.numero ?? 'votre numéro d\'acte'

  if (status === 'confirmed') {
    return {
      color: 'teal',
      icon: '🏛️',
      title: 'Votre acte est prêt à être retiré',
      location: `Mairie de ${lieu}`,
      message: `Rendez-vous à la **Mairie de ${lieu}**, muni(e) de votre CNI et du numéro d'acte **${numero}**. L'acte vous sera remis aux heures d'ouverture.`,
      horaires: 'Lundi – Vendredi : 7h30 – 15h30',
      pieces: [
        'Carte Nationale d\'Identité (CNI) originale',
        `Numéro de l'acte : ${numero}`,
        'Droit de timbre si applicable (selon le CEC)',
      ],
      urgency: null,
    }
  }
  if (status === 'pending') {
    return {
      color: 'gold',
      icon: '⏳',
      title: 'Dossier en cours — revenez bientôt',
      location: `Mairie de ${lieu}`,
      message: `Votre dossier est en cours de traitement. Revenez consulter ce portail dans **5 à 10 jours ouvrables**. Vous pouvez aussi contacter directement la Mairie de ${lieu}.`,
      horaires: 'Lundi – Vendredi : 7h30 – 15h30',
      pieces: [
        'Certificat d\'accouchement original (si naissance)',
        'CNI des deux parents (originaux)',
        'Acte de mariage si applicable',
      ],
      urgency: 'Conseil : Conservez précieusement votre reçu de déclaration pour tout suivi ultérieur.',
    }
  }
  if (status === 'rejected') {
    return {
      color: 'coral',
      icon: '⚠️',
      title: 'Intervention requise à la mairie',
      location: `Mairie de ${lieu}`,
      message: `Votre dossier a été rejeté. Rendez-vous **dès que possible** à la Mairie de ${lieu} avec vos pièces originales pour connaître le motif et régulariser la situation.`,
      horaires: 'Lundi – Vendredi : 7h30 – 15h30',
      pieces: [
        'CNI originaux des deux parents',
        'Certificat d\'accouchement ou de décès',
        'Toutes pièces relatives à la déclaration initiale',
      ],
      urgency: 'Important : Le délai légal de déclaration court toujours. Une action rapide est recommandée.',
    }
  }
  return null
}

// ── Progress timeline ─────────────────────────────────────────────────────────

function ProgressTimeline({ step }) {
  const steps = [
    { num: 1, label: 'Déclaration reçue',       done: step >= 1 },
    { num: 2, label: 'Validation en cours',      done: step >= 2, active: step === 2 },
    { num: 3, label: 'Acte établi & disponible', done: step >= 3 },
  ]
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.num} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <div className={[
              'h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
              s.done ? 'bg-white border-white text-navy-900' : 'bg-white/10 border-white/30 text-white/40',
              s.active && !s.done ? 'border-gold-400 bg-gold-400/20 text-gold-300' : '',
            ].join(' ')}>
              {s.done && step > s.num ? '✓' : s.num}
            </div>
            <span className={`mt-1.5 text-[10px] font-medium text-center leading-tight max-w-[72px] ${s.done ? 'text-white/90' : 'text-white/30'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-5 rounded-full transition-all ${step > i + 1 ? 'bg-white/70' : 'bg-white/15'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, highlight }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist-100">
        <Icon className="h-3.5 w-3.5 text-ink-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-ink-400">{label}</p>
        <p className={`mt-0.5 text-sm font-semibold break-words ${highlight ? 'text-teal-600' : 'text-navy-900'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

function fmt(d) {
  if (!d) return null
  try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return d }
}

function boldify(text) {
  // Convert **text** to <strong>
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// ── Pickup card ────────────────────────────────────────────────────────────────

function PickupCard({ pickup }) {
  const colorMap = {
    teal:  { bg: 'bg-teal-500/5',  border: 'border-teal-500/20', title: 'text-teal-700',  iconBg: 'bg-teal-500/10', pieceDot: 'bg-teal-500', btn: 'outline-teal' },
    gold:  { bg: 'bg-gold-500/5',  border: 'border-gold-500/20', title: 'text-gold-700',  iconBg: 'bg-gold-500/10', pieceDot: 'bg-gold-500', btn: 'ghost' },
    coral: { bg: 'bg-coral-500/5', border: 'border-coral-500/20', title: 'text-coral-700', iconBg: 'bg-coral-500/10', pieceDot: 'bg-coral-500', btn: 'ghost' },
  }
  const c = colorMap[pickup.color] ?? colorMap.teal

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-6`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg} text-lg`}>
          {pickup.icon}
        </div>
        <div>
          <p className={`font-display text-sm font-bold ${c.title}`}>{pickup.title}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Building2 className="h-3 w-3 text-ink-400" />
            <span className="text-xs text-ink-500 font-medium">{pickup.location}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed text-ink-600 mb-4">
        {boldify(pickup.message)}
      </p>

      {/* Horaires */}
      <div className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 mb-4">
        <Clock className="h-3.5 w-3.5 shrink-0 text-ink-400" />
        <span className="text-xs text-ink-600">{pickup.horaires}</span>
      </div>

      {/* Pieces */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
          Pièces à apporter
        </p>
        <ul className="space-y-1.5">
          {pickup.pieces.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${c.pieceDot}`} />
              <span className="text-xs text-ink-600">{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Urgency note */}
      {pickup.urgency && (
        <div className="flex items-start gap-2 rounded-lg bg-white/70 p-3 mt-3">
          <Info className="h-3.5 w-3.5 shrink-0 text-ink-400 mt-0.5" />
          <p className="text-xs text-ink-600 italic">{pickup.urgency}</p>
        </div>
      )}

      {/* CTA */}
      <Link to="/faq" className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-navy-700 hover:underline no-underline">
        <BookOpen className="h-3.5 w-3.5" />
        Consulter le guide des procédures
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

// ── Search recap ──────────────────────────────────────────────────────────────

function SearchRecap({ state }) {
  const [open, setOpen] = useState(false)
  const fields = [
    { label: 'Nom recherché', value: state.searchedNom },
    { label: 'Prénom', value: state.searchedPrenom },
    { label: 'Numéro d\'acte', value: state.searchedNumero },
    { label: 'Arrondissement', value: state.searchedArrondissement },
    { label: 'Email', value: state.searchedEmail },
  ].filter(f => f.value)

  if (!fields.length) return null

  return (
    <div className="rounded-2xl border border-mist-100 bg-white">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex w-full items-center justify-between px-5 py-4 cursor-pointer hover:bg-mist-50 rounded-2xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-ink-400" />
          <span className="text-sm font-semibold text-navy-900">Récapitulatif de votre recherche</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-ink-400" /> : <ChevronDown className="h-4 w-4 text-ink-400" />}
      </button>
      {open && (
        <div className="border-t border-mist-100 px-5 pb-5 pt-3 grid gap-3 sm:grid-cols-2 animate-slide-up">
          {fields.map(f => (
            <div key={f.label}>
              <p className="text-xs text-ink-400">{f.label}</p>
              <p className="text-sm font-semibold text-navy-900">{f.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Single result ─────────────────────────────────────────────────────────────

function SingleResult({ act, actType, locationState }) {
  const status = resolveStatus(act)
  const cfg = STATUS_CONFIG[status]
  const pickup = getPickupInfo(act, status)
  const StatusIcon = cfg.icon

  const name = actType === 'naissance'
    ? [act?.nomEnfant, act?.prenomEnfant].filter(Boolean).join(' ')
    : act?.nameDefunt ?? act?.nomDefunt ?? ''

  const lieu = act?.centreEtatCivil ?? act?.arrondissement ?? null

  return (
    <div className="space-y-5">
      {/* ── Zone 1 : Status hero ── */}
      <div className={`rounded-2xl p-6 ${cfg.heroBg} shadow-sm animate-scale-in`}>
        {/* Icon + badge */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ${cfg.border}`}>
            {status === 'pending' && (
              <div className="absolute inset-0 rounded-2xl bg-gold-500/20 animate-ping-slow" />
            )}
            <StatusIcon className={`relative h-7 w-7 ${cfg.color}`} strokeWidth={2} />
          </div>
          <div>
            <Badge tone={cfg.tone} className="mb-1.5 font-bold">{cfg.label}</Badge>
            <p className={`text-sm ${cfg.color.replace('text-', 'text-').replace('-500', '-800')}`}>{cfg.desc}</p>
          </div>
        </div>

        {/* Progress timeline */}
        <div className="border-t border-white/15 pt-5 mt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-3">
            Progression du dossier
          </p>
          <ProgressTimeline step={cfg.timelineStep} />
        </div>
      </div>

      {/* ── Zone 2 : Details + Pickup ── */}
      <div className="grid gap-5 lg:grid-cols-2 animate-slide-up delay-100">
        {/* Act details card */}
        <div className="rounded-2xl border border-mist-100 bg-white shadow-sm overflow-hidden">
          <div className="bg-navy-50 border-b border-mist-100 px-5 py-3.5 flex items-center gap-2">
            {actType === 'naissance'
              ? <Baby className="h-4 w-4 text-teal-500" />
              : <HeartCrack className="h-4 w-4 text-coral-500" />}
            <h2 className="font-display text-sm font-bold text-navy-900">
              {actType === 'naissance' ? 'Acte de naissance' : 'Acte de décès'}
            </h2>
          </div>
          <div className="divide-y divide-mist-100 px-5">
            <InfoRow icon={User}      label="Nom complet"             value={name || '—'} />
            <InfoRow icon={Hash}      label="Numéro de l'acte"        value={act?.numeroActe ?? act?.numero} highlight />
            <InfoRow icon={FileText}  label="Type d'acte"             value={act?.acteType ?? act?.typeActe} />
            <InfoRow icon={Calendar}  label="Date de naissance / décès"
              value={fmt(act?.dateNaissance ?? act?.deathDate ?? act?.dateDeces)} />
            <InfoRow icon={MapPin}    label="Lieu"
              value={act?.lieuNaissance ?? act?.deathPlace ?? act?.lieuDeces} />
            <InfoRow icon={Building2} label="Mairie ayant établi l'acte"
              value={lieu ? `Mairie de ${lieu}` : null} />
            <InfoRow icon={Calendar}  label="Date d'établissement de l'acte"
              value={fmt(act?.dateEtablissement ?? act?.createdAt)} highlight />
          </div>
        </div>

        {/* Pickup instruction card */}
        {pickup && <PickupCard pickup={pickup} />}
      </div>

      {/* ── Zone 3 : Actions ── */}
      <div className="space-y-4 animate-slide-up delay-200">
        {/* QR verification */}
        {act?.qrCodeUrl && (
          <a
            href={act.qrCodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-teal-500/25 bg-teal-500/5 p-5 hover:bg-teal-500/10 transition-colors no-underline group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/15">
              <QrCode className="h-6 w-6 text-teal-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-teal-700">Vérifier l'authenticité via QR Code</p>
              <p className="text-xs text-teal-600/70 mt-0.5">Cliquez pour certifier l'authenticité de cet acte sur la plateforme IDENTICA</p>
            </div>
            <ArrowRight className="h-4 w-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </a>
        )}

        {/* Search recap */}
        <SearchRecap state={locationState} />
      </div>
    </div>
  )
}

// ── Multiple results ──────────────────────────────────────────────────────────

function MultipleResults({ results, actType }) {
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-3 rounded-2xl bg-gold-500/10 border border-gold-500/20 px-5 py-4">
        <List className="h-5 w-5 shrink-0 text-gold-500" />
        <div>
          <p className="text-sm font-bold text-gold-700">
            {results.length} acte{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gold-600 mt-0.5">
            Précisez le numéro d'acte ou les informations complémentaires pour un résultat unique.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {results.map((act, i) => {
          const name = actType === 'naissance'
            ? [act?.nomEnfant, act?.prenomEnfant].filter(Boolean).join(' ')
            : act?.nameDefunt ?? ''
          const status = resolveStatus(act)
          const cfg = STATUS_CONFIG[status]
          const lieu = act?.centreEtatCivil ?? act?.arrondissement
          return (
            <div key={act?.id ?? i} className="rounded-2xl border border-mist-100 bg-white shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-navy-900">{name || '—'}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{act?.numeroActe ?? act?.numero ?? 'Numéro non disponible'}</p>
                  {lieu && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-ink-400">
                      <MapPin className="h-3 w-3" />
                      {lieu}
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <Badge tone={cfg.tone}>{cfg.label}</Badge>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StatusResult() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [currentResult, setCurrentResult] = useState(state?.result || null)
  const [toastNotice, setToastNotice] = useState(null)

  const isArray = Array.isArray(currentResult)
  const singleAct = !isArray ? currentResult : null

  // Extraction du trackingId pour le WebSocket et Web Push
  const trackingId = singleAct?.numeroActe || singleAct?.numero || singleAct?.trackingId || state?.searchedNumero || ''

  // ── Abonnement WebSocket STOMP (Partie 4) ──
  useEffect(() => {
    if (!trackingId) return

    const unsubscribe = subscribeToRequestStatus(trackingId, (data) => {
      // Notification Toast In-App
      setToastNotice({
        message: data.message || `Mise à jour du statut : ${data.status}`,
        status: data.status,
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        isSimulated: data.isSimulated,
      })

      // Mettre à jour l'acte en direct
      if (singleAct) {
        setCurrentResult((prev) => ({
          ...prev,
          statut: data.status,
          status: data.status,
        }))
      }
    })

    return () => {
      unsubscribe()
    }
  }, [trackingId, singleAct])

  const handleStatusSimulated = (data) => {
    setToastNotice({
      message: data.message,
      status: data.status,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      isSimulated: true,
    })
    if (singleAct) {
      setCurrentResult((prev) => ({
        ...prev,
        statut: data.status,
        status: data.status,
      }))
    }
  }

  if (!currentResult) {
    return (
      <div className="min-h-screen bg-mist-50">
        <BrandBar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <AlertCircle className="h-12 w-12 text-ink-400 mb-4" />
          <p className="text-ink-600 font-medium">Aucun résultat à afficher.</p>
          <p className="text-sm text-ink-400 mt-1">Effectuez une nouvelle recherche pour consulter un statut.</p>
          <Button className="mt-6" variant="teal" onClick={() => navigate('/statut')}>
            Nouvelle recherche
          </Button>
        </div>
      </div>
    )
  }

  const { actType, searchedNom } = state || {}

  return (
    <div className="min-h-screen bg-mist-50 relative">
      <BrandBar />

      {/* Toast Notification STOMP en direct (In-App) */}
      {toastNotice && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-bounce-short">
          <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">
                  Mise à jour en direct {toastNotice.isSimulated ? '(Simulée)' : ''}
                </span>
                <span className="text-[10px] text-slate-400">{toastNotice.timestamp}</span>
              </div>
              <p className="text-xs font-semibold text-slate-100 mt-1">{toastNotice.message}</p>
            </div>
            <button
              onClick={() => setToastNotice(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero header */}
      <div className="relative bg-navy-900 pb-16 pt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 right-0 h-64 w-64 rounded-full bg-teal-500/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <button
            onClick={() => navigate('/statut')}
            className="mb-5 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Nouvelle recherche
          </button>
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-teal-500/15 px-2.5 py-1 text-[10px] font-bold text-teal-300 uppercase tracking-wider ring-1 ring-teal-500/20">
              Résultat
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {isArray
              ? `${currentResult.length} résultat(s) pour « ${searchedNom} »`
              : 'Statut de l\'acte'}
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {isArray
              ? 'Affinez votre recherche avec le numéro d\'acte pour un résultat précis.'
              : 'Voici le statut actuel de l\'acte et les instructions pour le retirer.'}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 -mt-8 pb-16 space-y-6">
        {isArray
          ? <MultipleResults results={currentResult} actType={actType} />
          : <SingleResult act={currentResult} actType={actType} locationState={state} />}

        {/* Widget des canaux de notification Web Push et SMS */}
        {!isArray && trackingId && (
          <NotificationChannelsWidget
            trackingId={trackingId}
            currentStatus={singleAct?.statut || singleAct?.status || 'pending'}
            onStatusSimulated={handleStatusSimulated}
          />
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => navigate('/statut')} noShadow>
            <ChevronLeft className="h-4 w-4" />
            Nouvelle recherche
          </Button>
          <Button variant="ghost" onClick={() => navigate('/accueil')} noShadow>
            Accueil
          </Button>
          <Link to="/faq">
            <Button variant="ghost" noShadow>
              <BookOpen className="h-4 w-4" />
              Guide légal
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

