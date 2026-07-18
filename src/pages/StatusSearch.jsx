import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Baby, HeartCrack, ChevronLeft, ChevronDown, ChevronUp, Calendar, MapPin, Building2, User } from 'lucide-react'
import BrandBar from '../components/BrandBar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { searchBirthByNumber, searchBirthsByName, searchDeathActs } from '../api/citizenApi'

const ACT_TYPES = [
  {
    value: 'naissance',
    label: 'Acte de naissance',
    sub: 'Pour un enfant né dans un établissement de santé ou à domicile',
    icon: Baby,
    color: 'teal',
  },
  {
    value: 'deces',
    label: 'Acte de décès',
    sub: 'Pour une déclaration de décès d\'un proche',
    icon: HeartCrack,
    color: 'coral',
  },
]

export default function StatusSearch() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [actType, setActType] = useState('')
  const [form, setForm] = useState({
    nom: '', prenom: '', numeroActe: '', email: '',
    dateNaissance: '', arrondissement: '', etablissement: '', prenomPere: '',
  })
  const [showExtra, setShowExtra] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.nom.trim()) errs.nom = 'Le nom est requis'
    if (!form.email.trim()) errs.email = "L'email est requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Adresse email invalide'
    return errs
  }

  async function handleSearch(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setIsLoading(true)
    setApiError('')

    try {
      let result = null
      if (actType === 'naissance') {
        if (form.numeroActe.trim()) {
          result = await searchBirthByNumber(form.numeroActe.trim())
        } else {
          const list = await searchBirthsByName(form.nom.trim())
          // Further filter by prenom/arrondissement if provided
          const filtered = list.filter((a) => {
            if (form.prenom && !(a.prenomEnfant ?? '').toLowerCase().includes(form.prenom.toLowerCase())) return false
            if (form.arrondissement && !(a.arrondissement ?? '').toLowerCase().includes(form.arrondissement.toLowerCase())) return false
            return true
          })
          result = filtered.length === 1 ? filtered[0] : (filtered.length > 0 ? filtered : list)
          if (Array.isArray(result) && result.length === 1) result = result[0]
        }
      } else {
        const list = await searchDeathActs({ nom: form.nom.trim(), numeroActe: form.numeroActe.trim() || undefined })
        result = list.length === 1 ? list[0] : list
      }

      navigate('/statut/resultat', {
        state: {
          result,
          actType,
          searchedEmail: form.email,
          searchedNom: form.nom,
          searchedPrenom: form.prenom,
          searchedNumero: form.numeroActe,
          searchedArrondissement: form.arrondissement,
        },
      })
    } catch (err) {
      const status = err?.response?.status
      if (status === 404) setApiError("Aucun acte trouvé. Vérifiez le numéro ou le nom saisi.")
      else if (status === 403) setApiError("Accès temporairement indisponible. Réessayez dans quelques instants.")
      else setApiError("Une erreur est survenue lors de la recherche. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mist-50">
      <BrandBar />

      {/* Hero band */}
      <div className="relative bg-navy-900 pb-16 pt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 right-0 h-64 w-64 rounded-full bg-teal-500/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-navy-700/30 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
          <button
            onClick={() => step === 2 ? setStep(1) : navigate('/accueil')}
            className="mb-5 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 2 ? 'Changer le type d\'acte' : 'Retour à l\'accueil'}
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-teal-500/15 px-2.5 py-1 text-[10px] font-bold text-teal-300 uppercase tracking-wider ring-1 ring-teal-500/20">
              Étape {step} / 2
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {step === 1 ? 'Quel type d\'acte souhaitez-vous consulter ?' : 'Informations de recherche'}
          </h1>
          <p className="mt-2 text-sm text-white/45">
            {step === 1
              ? 'Sélectionnez le type d\'acte concerné.'
              : 'Plus vous renseignez d\'informations, plus la recherche sera précise.'}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 -mt-8 pb-16">
        {/* Step 1 — type selection */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            {ACT_TYPES.map(({ value, label, sub, icon: Icon, color }) => {
              const colorMap = {
                teal: {
                  border: 'border-teal-500 ring-4 ring-teal-500/20',
                  hoverBorder: 'hover:border-teal-500/50 hover:shadow-[0_8px_24px_rgba(10,171,114,0.12)]',
                  iconBg: 'bg-teal-500/10', icon: 'text-teal-500',
                },
                coral: {
                  border: 'border-coral-500 ring-4 ring-coral-500/20',
                  hoverBorder: 'hover:border-coral-500/50 hover:shadow-[0_8px_24px_rgba(234,75,71,0.12)]',
                  iconBg: 'bg-coral-500/10', icon: 'text-coral-500',
                },
              }
              const c = colorMap[color]
              return (
                <button
                  key={value}
                  id={`type-${value}`}
                  onClick={() => { setActType(value); setStep(2) }}
                  className={[
                    'group w-full flex items-center gap-5 rounded-2xl border-2 bg-white p-6',
                    'transition-all duration-200 shadow-sm cursor-pointer text-left',
                    actType === value ? c.border : `border-mist-100 ${c.hoverBorder}`,
                  ].join(' ')}
                >
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${c.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${c.icon}`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-navy-900">{label}</p>
                    <p className="mt-0.5 text-sm text-ink-400">{sub}</p>
                  </div>
                  <ChevronLeft className="ml-auto h-5 w-5 rotate-180 text-ink-200 group-hover:text-navy-700 transition-colors" />
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2 — form */}
        {step === 2 && (
          <div className="animate-slide-up">
            {/* Type badge */}
            <div className="mb-5 flex items-center gap-2">
              {actType === 'naissance'
                ? <Baby className="h-4 w-4 text-teal-500" />
                : <HeartCrack className="h-4 w-4 text-coral-500" />}
              <span className="text-sm font-semibold text-ink-600">
                {actType === 'naissance' ? 'Acte de naissance' : 'Acte de décès'}
              </span>
            </div>

            <div className="rounded-2xl border border-mist-100 bg-white shadow-sm overflow-hidden">
              {/* Primary fields */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-mist-100">
                  <div className="h-4 w-1 rounded-full bg-teal-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                    Informations principales
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    id="search-nom"
                    label={actType === 'naissance' ? "Nom de l'enfant" : "Nom du défunt"}
                    name="nom"
                    required
                    placeholder={actType === 'naissance' ? "Ex : Kamga" : "Ex : Kamga"}
                    value={form.nom}
                    onChange={handleChange}
                    error={errors.nom}
                    autoFocus
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-600">
                      Prénom <span className="text-ink-300">(optionnel)</span>
                    </label>
                    <input
                      name="prenom"
                      value={form.prenom}
                      onChange={handleChange}
                      placeholder={actType === 'naissance' ? "Ex : Jean-Paul" : "Ex : Paul"}
                      className="w-full rounded-xl border border-transparent bg-mist-100 px-4 py-3 text-sm text-ink-900
                        placeholder:text-ink-400 transition-colors focus:bg-white focus:border-navy-700 focus:outline-none"
                    />
                  </div>
                </div>

                <Input
                  id="search-numero"
                  label="Numéro de l'acte"
                  name="numeroActe"
                  placeholder={actType === 'naissance' ? "Ex : ACT-2026-00001" : "Ex : DCE-2026-00001"}
                  value={form.numeroActe}
                  onChange={handleChange}
                />

                <Input
                  id="search-email"
                  label="Votre adresse email"
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.cm"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              {/* Additional fields toggle */}
              <div className="border-t border-mist-100">
                <button
                  type="button"
                  onClick={() => setShowExtra((p) => !p)}
                  className="flex w-full items-center justify-between px-6 sm:px-8 py-4 text-left hover:bg-mist-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-gold-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                      Affiner la recherche
                    </span>
                    <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-[10px] font-bold text-gold-600">
                      optionnel
                    </span>
                  </div>
                  {showExtra
                    ? <ChevronUp className="h-4 w-4 text-ink-400" />
                    : <ChevronDown className="h-4 w-4 text-ink-400" />}
                </button>

                {showExtra && (
                  <div className="px-6 sm:px-8 pb-6 space-y-4 border-t border-mist-100 pt-5 animate-slide-up">
                    <p className="text-xs text-ink-400 leading-relaxed">
                      Ces informations permettent d'affiner la recherche si plusieurs résultats correspondent à votre nom.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                          <Calendar className="h-3.5 w-3.5 text-ink-400" />
                          {actType === 'naissance' ? 'Mois/Année de naissance' : 'Mois/Année du décès'}
                        </label>
                        <input
                          name="dateNaissance"
                          type="month"
                          value={form.dateNaissance}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-transparent bg-mist-100 px-4 py-3 text-sm text-ink-900
                            transition-colors focus:bg-white focus:border-navy-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                          <MapPin className="h-3.5 w-3.5 text-ink-400" />
                          Arrondissement / commune
                        </label>
                        <input
                          name="arrondissement"
                          value={form.arrondissement}
                          onChange={handleChange}
                          placeholder="Ex : Yaoundé 1er"
                          className="w-full rounded-xl border border-transparent bg-mist-100 px-4 py-3 text-sm text-ink-900
                            placeholder:text-ink-400 transition-colors focus:bg-white focus:border-navy-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                          <Building2 className="h-3.5 w-3.5 text-ink-400" />
                          Établissement de naissance
                        </label>
                        <input
                          name="etablissement"
                          value={form.etablissement}
                          onChange={handleChange}
                          placeholder="Ex : Hôpital Central"
                          className="w-full rounded-xl border border-transparent bg-mist-100 px-4 py-3 text-sm text-ink-900
                            placeholder:text-ink-400 transition-colors focus:bg-white focus:border-navy-700 focus:outline-none"
                        />
                      </div>
                      {actType === 'naissance' && (
                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                            <User className="h-3.5 w-3.5 text-ink-400" />
                            Prénom du père
                          </label>
                          <input
                            name="prenomPere"
                            value={form.prenomPere}
                            onChange={handleChange}
                            placeholder="Ex : Jean"
                            className="w-full rounded-xl border border-transparent bg-mist-100 px-4 py-3 text-sm text-ink-900
                              placeholder:text-ink-400 transition-colors focus:bg-white focus:border-navy-700 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Hint + submit */}
              <div className="bg-mist-50 border-t border-mist-100 px-6 sm:px-8 py-5 space-y-4">

                {apiError && (
                  <div className="rounded-xl bg-coral-500/10 px-4 py-3 text-sm text-coral-600 flex items-start gap-2">
                    <span className="shrink-0">⚠</span>
                    {apiError}
                  </div>
                )}

                <Button
                  id="btn-lancer-recherche"
                  onClick={handleSearch}
                  variant="teal"
                  size="lg"
                  className="w-full font-bold"
                  isLoading={isLoading}
                >
                  <Search className="h-4 w-4" />
                  Rechercher l'acte
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
