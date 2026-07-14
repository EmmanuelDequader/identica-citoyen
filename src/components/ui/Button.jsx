const variants = {
  primary: {
    base: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950',
    shadow: 'shadow-[0_4px_14px_rgba(12,37,81,0.35)] hover:shadow-[0_6px_20px_rgba(12,37,81,0.45)]',
  },
  teal: {
    base: 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-600',
    shadow: 'shadow-[0_4px_14px_rgba(10,171,114,0.35)] hover:shadow-[0_6px_20px_rgba(10,171,114,0.45)]',
  },
  gold: {
    base: 'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-600',
    shadow: 'shadow-[0_4px_14px_rgba(211,165,45,0.35)] hover:shadow-[0_6px_20px_rgba(211,165,45,0.45)]',
  },
  coral: {
    base: 'bg-coral-500 text-white hover:bg-coral-600',
    shadow: 'shadow-[0_4px_14px_rgba(234,75,71,0.30)] hover:shadow-[0_6px_20px_rgba(234,75,71,0.40)]',
  },
  ghost: {
    base: 'bg-white text-navy-900 hover:bg-navy-50 border border-mist-100 hover:border-navy-100',
    shadow: 'shadow-sm hover:shadow-md',
  },
  outline: {
    base: 'bg-transparent text-navy-700 hover:bg-navy-50 border-2 border-navy-700',
    shadow: '',
  },
  'outline-teal': {
    base: 'bg-transparent text-teal-600 hover:bg-teal-500/10 border-2 border-teal-500',
    shadow: '',
  },
  'white-ghost': {
    base: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
    shadow: '',
  },
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-base gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  size = 'md',
  noShadow = false,
  ...props
}) {
  const v = variants[variant] ?? variants.primary
  const s = sizes[size] ?? sizes.md

  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'transition-all duration-200 cursor-pointer',
        'disabled:cursor-not-allowed disabled:opacity-50',
        s,
        v.base,
        !noShadow && v.shadow,
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  )
}
