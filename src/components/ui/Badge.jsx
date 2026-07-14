const tones = {
  success: 'bg-teal-500/15 text-teal-600 border border-teal-500/30',
  warning: 'bg-gold-500/15 text-gold-600 border border-gold-500/30',
  danger:  'bg-coral-500/15 text-coral-600 border border-coral-500/30',
  info:    'bg-navy-700/10 text-navy-700 border border-navy-700/20',
  neutral: 'bg-ink-400/10 text-ink-600 border border-ink-400/20',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
      ${tones[tone] ?? tones.neutral} ${className}`}>
      {children}
    </span>
  )
}
