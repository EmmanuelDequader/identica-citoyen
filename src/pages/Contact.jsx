import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BrandBar from '../components/BrandBar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const SUBJECTS = [
  'Statut de mon acte introuvable',
  'Acte prêt mais non disponible à la mairie',
  'Erreur sur mon acte d\'état civil',
  'Demande d\'information générale',
  'Problème technique avec le portail',
  'Autre',
]

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.nom.trim())     errs.nom     = 'Votre nom est requis'
    if (!form.email.trim())   errs.email   = 'Votre email est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email invalide'
    if (!form.sujet)          errs.sujet   = 'Veuillez choisir un sujet'
    if (!form.message.trim()) errs.message = 'Votre message est requis'
    else if (form.message.trim().length < 20) errs.message = 'Merci d\'écrire au moins 20 caractères'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

    if (accessKey) {
      setIsSubmitting(true)
      setSubmitError('')
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: form.nom,
            email: form.email,
            subject: `[IDENTICA Citoyen] ${form.sujet} — ${form.nom}`,
            message: form.message,
            from_name: 'Portail Citoyen IDENTICA',
          }),
        })

        const result = await response.json()
        if (result.success) {
          setSent(true)
        } else {
          setSubmitError(result.message || "Une erreur est survenue lors de l'envoi.")
        }
      } catch (err) {
        setSubmitError("Impossible de contacter le serveur d'envoi. Veuillez réessayer ou utiliser l'email ci-contre.")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Fallback to mailto link
      const subject = encodeURIComponent(`[IDENTICA Citoyen] ${form.sujet} — ${form.nom}`)
      const body = encodeURIComponent(
        `Nom : ${form.nom}\nEmail : ${form.email}\nSujet : ${form.sujet}\n\nMessage :\n${form.message}\n\n---\nEnvoyé depuis le Portail Citoyen IDENTICA`
      )
      window.location.href = `mailto:emmanueljuniordequa2@gmail.com?subject=${subject}&body=${body}`
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-mist-50">
      <BrandBar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <button
            onClick={() => navigate('/accueil')}
            className="mb-5 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Retour à l'accueil
          </button>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-teal-500/15 px-2.5 py-1 text-[10px] font-bold text-teal-300 uppercase tracking-wider ring-1 ring-teal-500/20">
              Assistance
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Contactez-nous
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/55">
            Une question sur votre acte ? Un problème technique ? Notre équipe vous répond sous 48h ouvrées.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 -mt-10 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Info cards (left column) ── */}
          <div className="space-y-4 lg:col-span-1">

            {/* Contact info */}
            <div className="rounded-2xl border border-mist-100 bg-white p-6 shadow-sm animate-slide-in-left">
              <h2 className="font-display text-base font-bold text-navy-900 mb-4">Informations de contact</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10">
                    <Mail className="h-4 w-4 text-teal-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-400">Email</p>
                    <a href="mailto:emmanueljuniordequa2@gmail.com" className="text-sm font-semibold text-navy-900 hover:text-teal-600 transition-colors">
                      emmanueljuniordequa2@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/10">
                    <Clock className="h-4 w-4 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-400">Heures de réponse</p>
                    <p className="text-sm font-semibold text-navy-900">Lun – Ven : 8h – 16h</p>
                    <p className="text-xs text-ink-400">Délai de réponse : 48h ouvrées</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-100">
                    <MapPin className="h-4 w-4 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-400">Organisme responsable</p>
                    <p className="text-sm font-semibold text-navy-900">BUNEC · MINAT</p>
                    <p className="text-xs text-ink-400">Yaoundé, Cameroun</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ shortcut */}
            <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5 animate-slide-in-left delay-100">
              <MessageSquare className="h-5 w-5 text-gold-500 mb-2" />
              <h3 className="text-sm font-bold text-navy-900 mb-1">Consultez d'abord la FAQ</h3>
              <p className="text-xs text-ink-600 leading-relaxed mb-3">
                La plupart des questions sont répondues dans notre guide légal complet.
              </p>
              <button
                onClick={() => navigate('/faq')}
                className="text-xs font-bold text-gold-600 hover:underline"
              >
                Voir le guide →
              </button>
            </div>
          </div>

          {/* ── Contact form (right column) ── */}
          <div className="lg:col-span-2 animate-slide-in-right">
            {sent ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-teal-500/20 bg-white py-16 px-6 shadow-sm text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 mb-5">
                  <CheckCircle2 className="h-8 w-8 text-teal-500" />
                </div>
                <h2 className="font-display text-xl font-bold text-navy-900 mb-2">Message envoyé !</h2>
                <p className="text-sm text-ink-600 max-w-xs mb-6">
                  {import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
                    ? "Votre message a bien été envoyé et transmis à l'équipe IDENTICA."
                    : "Votre messagerie s'est ouverte avec votre message pré-rempli. Envoyez-le pour contacter l'équipe IDENTICA."}
                </p>
                <div className="flex gap-3">
                  <Button variant="teal" onClick={() => setSent(false)}>
                    Nouveau message
                  </Button>
                  <Button variant="ghost" noShadow onClick={() => navigate('/accueil')}>
                    Accueil
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-mist-100 bg-white shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="border-b border-mist-100 px-6 py-5 sm:px-8">
                  <h2 className="font-display text-lg font-bold text-navy-900">Envoyez-nous un message</h2>
                  <p className="mt-0.5 text-sm text-ink-400">
                    Remplissez le formulaire ci-dessous. Un email sera ouvert dans votre messagerie.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      id="contact-nom"
                      label="Votre nom complet"
                      name="nom"
                      required
                      placeholder="Ex : Marie Kamga"
                      value={form.nom}
                      onChange={handleChange}
                      error={errors.nom}
                      autoFocus
                    />
                    <Input
                      id="contact-email"
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

                  {/* Subject select */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-600">
                      Sujet <span className="text-coral-500">*</span>
                    </label>
                    <select
                      name="sujet"
                      value={form.sujet}
                      onChange={handleChange}
                      className={[
                        'w-full rounded-xl border px-4 py-3 text-sm text-ink-900',
                        'bg-mist-100 border-transparent transition-colors cursor-pointer',
                        'focus:bg-white focus:border-navy-700 focus:outline-none',
                        errors.sujet ? 'border-coral-500 bg-white' : '',
                      ].join(' ')}
                    >
                      <option value="">— Choisissez un sujet —</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.sujet && <p className="mt-1 text-xs text-coral-600">{errors.sujet}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-600">
                      Votre message <span className="text-coral-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez votre situation en détail : numéro d'acte, nom concerné, nature du problème…"
                      className={[
                        'w-full rounded-xl border px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400',
                        'bg-mist-100 border-transparent transition-colors resize-none',
                        'focus:bg-white focus:border-navy-700 focus:outline-none',
                        errors.message ? 'border-coral-500 bg-white' : '',
                      ].join(' ')}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {errors.message
                        ? <p className="text-xs text-coral-600">{errors.message}</p>
                        : <span />}
                      <span className="text-xs text-ink-400">{form.message.length} car.</span>
                    </div>
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-2.5 rounded-xl bg-navy-50 px-4 py-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" />
                    <p className="text-xs text-navy-700 leading-relaxed">
                      {import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
                        ? "Votre message sera envoyé directement à l'équipe de support."
                        : "En cliquant sur \"Envoyer\", votre messagerie s'ouvrira avec le message pré-rempli. Vérifiez et envoyez depuis votre client email."}
                    </p>
                  </div>

                  {submitError && (
                    <div className="rounded-xl bg-coral-50 border border-coral-200 p-4 text-xs text-coral-700 animate-fade-in">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="teal"
                    size="lg"
                    className="w-full font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 inline-block align-middle" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-mist-100 bg-white py-6 text-center">
        <p className="text-xs text-ink-400">
          IDENTICA Citoyen · BUNEC · MINAT · 🇨🇲 République du Cameroun
        </p>
      </footer>
    </div>
  )
}
