import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Search, BookOpen, Scale, AlertTriangle, Bookmark, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BrandBar from '../components/BrandBar'
import { FAQ_SECTIONS } from '../data/faqData'

// Helper color map
const colorMap = {
  navy:  { dot: 'bg-navy-700', header: 'text-navy-800', border: 'border-navy-100', icon: Scale },
  teal:  { dot: 'bg-teal-500', header: 'text-teal-700', border: 'border-teal-100', icon: BookOpen },
  coral: { dot: 'bg-coral-500', header: 'text-coral-700', border: 'border-coral-100', icon: Bookmark },
  gold:  { dot: 'bg-gold-500', header: 'text-gold-700', border: 'border-gold-500/30', icon: AlertTriangle },
}

function TableBlock({ text }) {
  const lines = text.split('\n').filter((l) => l.trim().startsWith('|'))
  if (lines.length < 2) return <p className="whitespace-pre-line text-sm text-ink-600">{text}</p>

  const rows = lines.map((l) =>
    l.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map((c) => c.trim())
  )
  const header = rows[0]
  const body = rows.slice(2)

  return (
    <div className="overflow-x-auto rounded-xl border border-mist-100">
      <table className="w-full text-sm">
        <thead className="bg-navy-50">
          <tr>
            {header.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-navy-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-mist-100 bg-white">
          {body.map((row, ri) => (
            <tr key={ri} className="hover:bg-mist-50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-ink-600">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AnswerContent({ text, isTable }) {
  if (isTable) {
    const parts = text.split(/(\|.*\|)/s)
    const tableText = parts.find((p) => p.trim().startsWith('|')) ?? ''
    const before = text.slice(0, text.indexOf(tableText)).trim()
    const after = text.slice(text.indexOf(tableText) + tableText.length).trim()
    return (
      <div className="space-y-3">
        {before && <p className="whitespace-pre-line text-sm text-ink-600">{before}</p>}
        <TableBlock text={tableText} />
        {after && <p className="whitespace-pre-line text-sm text-ink-600">{after}</p>}
      </div>
    )
  }
  const lines = text.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('📌')) {
          return (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-navy-50 px-3 py-2">
              <span className="shrink-0">📌</span>
              <span className="text-xs text-navy-700">{line.slice(1).trim()}</span>
            </div>
          )
        }
        if (line.startsWith('⚠')) {
          return (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-gold-500/10 px-3 py-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
              <span className="text-xs text-gold-700">{line.slice(1).trim()}</span>
            </div>
          )
        }
        if (!line.trim()) return <div key={i} className="h-2" />
        return <p key={i} className="text-sm leading-relaxed text-ink-600">{line}</p>
      })}
    </div>
  )
}

function AccordionItem({ article, isOpen, onToggle }) {
  return (
    <div className={`rounded-xl border transition-all ${isOpen ? 'border-navy-100 shadow-sm' : 'border-mist-100'} bg-white`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <span className="font-semibold text-sm text-navy-900">{article.question}</span>
        {isOpen
          ? <ChevronDown className="h-4 w-4 shrink-0 text-navy-700" />
          : <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />}
      </button>
      {isOpen && (
        <div className="border-t border-mist-100 px-5 py-4">
          <AnswerContent text={article.answer} isTable={article.isTable} />
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState({})
  const [openSections, setOpenSections] = useState({ S1: true })

  const filtered = useMemo(() => {
    if (!search.trim()) return FAQ_SECTIONS
    const q = search.toLowerCase()
    return FAQ_SECTIONS.map((s) => ({
      ...s,
      articles: s.articles.filter(
        (a) =>
          a.question.toLowerCase().includes(q) ||
          a.answer.toLowerCase().includes(q)
      ),
    })).filter((s) => s.articles.length > 0)
  }, [search])

  function toggleItem(id) {
    setOpenItems((p) => ({ ...p, [id]: !p[id] }))
  }

  function toggleSection(id) {
    setOpenSections((p) => ({ ...p, [id]: !p[id] }))
  }

  return (
    <div className="min-h-screen bg-mist-50">
      <BrandBar />

      {/* Hero band */}
      <div className="relative bg-navy-900 pb-16 pt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 right-0 h-64 w-64 rounded-full bg-teal-500/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <button
            onClick={() => navigate('/accueil')}
            className="mb-5 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour à l'accueil
          </button>
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-teal-500/15 px-2.5 py-1 text-[10px] font-bold text-teal-300 uppercase tracking-wider ring-1 ring-teal-500/20">
              Assistance
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Procédures d'état civil au Cameroun
          </h1>
          <p className="mt-2 text-sm text-white/45">
            Textes réglementaires, délais légaux et apports du système IDENTICA.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 -mt-8 pb-16">
        {/* Search */}
        <div className="relative mb-6 animate-slide-up">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans le guide (ex: délai, mariage, tribunal…)"
            className="w-full rounded-xl border border-mist-100 bg-white py-3.5 pl-11 pr-4 text-sm text-ink-900
              shadow-sm placeholder:text-ink-400 focus:border-navy-700 focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-400 hover:text-navy-900"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-4 animate-slide-up delay-100">
          {filtered.map((section) => {
            const c = colorMap[section.color] ?? colorMap.navy
            const SectionIcon = c.icon
            const isSectionOpen = openSections[section.id] ?? search.trim().length > 0

            return (
              <div key={section.id} className={`rounded-2xl border bg-white shadow-sm ${c.border}`}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left cursor-pointer"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist-100`}>
                    <SectionIcon className={`h-4 w-4 ${c.header}`} />
                  </div>
                  <span className={`font-display text-sm font-bold sm:text-base ${c.header} flex-1`}>
                    {section.title}
                  </span>
                  <span className="shrink-0 rounded-full bg-mist-100 px-2 py-0.5 text-xs text-ink-400">
                    {section.articles.length} article{section.articles.length > 1 ? 's' : ''}
                  </span>
                  {isSectionOpen
                    ? <ChevronDown className="h-4 w-4 shrink-0 text-ink-400" />
                    : <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />}
                </button>

                {/* Section articles */}
                {isSectionOpen && (
                  <div className="border-t border-mist-100 p-3 space-y-2">
                    {section.articles.map((article) => (
                      <AccordionItem
                        key={article.id}
                        article={article}
                        isOpen={openItems[article.id] ?? search.trim().length > 0}
                        onToggle={() => toggleItem(article.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-ink-400 mb-3" />
              <p className="text-ink-600">Aucun résultat pour « {search} »</p>
              <button onClick={() => setSearch('')} className="mt-3 text-sm text-teal-600 hover:underline">
                Effacer la recherche
              </button>
            </div>
          )}
        </div>

        {/* Legal sources */}
        <div className="mt-8 rounded-2xl border border-mist-100 bg-white p-5 text-xs text-ink-400">
          <p className="font-semibold text-ink-600 mb-2">Sources juridiques</p>
          <ul className="space-y-1">
            <li>• Ordonnance n° 81/002 du 29 juin 1981 — Organisation de l'état civil</li>
            <li>• Loi n° 2011/011 du 6 mai 2011 — Modification de l'Ordonnance 81/002</li>
            <li>• Article 370, Code pénal camerounais</li>
            <li>• Article 151, Code pénal camerounais</li>
            <li>• BUNEC — Bureau National de l'État Civil</li>
            <li>• MINAT — Ministère de l'Administration Territoriale</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
