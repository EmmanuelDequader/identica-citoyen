import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Search, ChevronRight, BookOpen, Send, Sparkles } from 'lucide-react'
import { searchFAQ } from '../data/faqData'
import { Link, useNavigate } from 'react-router-dom'

export default function QuestionWidget() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [wobble, setWobble] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Auto-focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Wobble animation on first load
  useEffect(() => {
    const t = setTimeout(() => setWobble(true), 3000)
    const t2 = setTimeout(() => setWobble(false), 3600)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    const found = searchFAQ(query)
    setResults(found)
    setSearched(true)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function handleQuickSearch(q) {
    setQuery(q)
    const found = searchFAQ(q)
    setResults(found)
    setSearched(true)
  }

  function goToFAQ() {
    navigate('/faq')
    setOpen(false)
  }

  const QUICK_QUESTIONS = [
    'Délai de déclaration de naissance',
    'Pièces à fournir pour déclarer',
    'Enfant non déclaré après 90 jours',
    'Où retirer mon acte ?',
  ]

  return (
    <>
      {/* ── Floating button ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        {!open && (
          <div className="absolute -top-10 right-0 whitespace-nowrap rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-fade-in opacity-0 group-hover:opacity-100 pointer-events-none">
            Une question ?
          </div>
        )}

        <button
          id="question-widget-btn"
          onClick={() => setOpen(p => !p)}
          className={[
            'group relative flex h-14 w-14 items-center justify-center rounded-2xl',
            'bg-navy-900 text-white shadow-[0_8px_24px_rgba(12,37,81,0.45)]',
            'transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_32px_rgba(12,37,81,0.55)] cursor-pointer',
            wobble ? 'animate-wobble' : '',
          ].join(' ')}
          aria-label="Poser une question"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-teal-500/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
          {open
            ? <X className="relative h-5 w-5 transition-transform duration-200" />
            : (
              <>
                <MessageCircle className="relative h-5 w-5" />
                {/* Notification dot */}
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-teal-400 border-2 border-white animate-pulse" />
              </>
            )}
        </button>
      </div>

      {/* ── Slide-in panel ── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-navy-950/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] animate-slide-panel">
            <div className="flex h-[520px] max-h-[75vh] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(12,37,81,0.25)] ring-1 ring-navy-100">

              {/* Header */}
              <div className="bg-navy-900 px-5 py-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20">
                  <Sparkles className="h-4 w-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Posez votre question</p>
                  <p className="text-xs text-white/50">Recherche dans le guide légal IDENTICA</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">

                {/* Search bar */}
                <div className="p-4 border-b border-mist-100">
                  <div className="flex items-center gap-2 rounded-xl border border-mist-100 bg-mist-50 px-3.5 py-2.5 focus-within:border-navy-700 focus-within:bg-white transition-all">
                    <Search className="h-4 w-4 shrink-0 text-ink-400" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ex : délai naissance, pièces à fournir…"
                      className="flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                    />
                    {query && (
                      <button
                        onClick={() => { setQuery(''); setResults([]); setSearched(false) }}
                        className="text-ink-400 hover:text-navy-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={!query.trim()}
                    className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white
                      hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Rechercher une réponse
                  </button>
                </div>

                {/* Quick questions */}
                {!searched && (
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3">
                      Questions fréquentes
                    </p>
                    <div className="space-y-2">
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQuickSearch(q)}
                          className="w-full flex items-center gap-3 rounded-xl border border-mist-100 bg-mist-50 px-3.5 py-3 text-left hover:bg-navy-50 hover:border-navy-100 transition-all cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4 shrink-0 text-teal-500" />
                          <span className="text-sm text-navy-900">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results */}
                {searched && (
                  <div className="p-4 animate-slide-up">
                    {results.length > 0 ? (
                      <>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3">
                          {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                        </p>
                        <div className="space-y-3">
                          {results.map((article) => (
                            <div key={article.id} className="rounded-xl border border-mist-100 bg-white p-4">
                              <p className="text-xs font-bold text-teal-600 mb-1">{article.sectionTitle}</p>
                              <p className="text-sm font-semibold text-navy-900 mb-2">{article.question}</p>
                              <p className="text-xs leading-relaxed text-ink-600 line-clamp-3">
                                {article.answer.replace(/[📌⚠•]/g, '').replace(/\n/g, ' ').slice(0, 160)}…
                              </p>
                              <Link
                                to={`/faq#${article.id}`}
                                onClick={() => setOpen(false)}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
                              >
                                Lire la réponse complète <ChevronRight className="h-3 w-3" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="py-6 text-center">
                        <Search className="mx-auto h-8 w-8 text-ink-300 mb-3" />
                        <p className="text-sm font-semibold text-navy-900">Aucune réponse trouvée</p>
                        <p className="text-xs text-ink-400 mt-1">Essayez d'autres mots-clés ou consultez le guide complet.</p>
                        <button
                          onClick={goToFAQ}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-navy-800 transition-colors cursor-pointer"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Voir le guide complet
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-mist-100 bg-mist-50 px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-ink-400">Guide · Ord. 81/002 · Loi 2011/011</p>
                <button
                  onClick={goToFAQ}
                  className="flex items-center gap-1 text-xs font-semibold text-navy-700 hover:underline cursor-pointer"
                >
                  Guide complet <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
