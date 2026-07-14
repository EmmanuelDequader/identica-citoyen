export default function Input({ label, required, error, className = '', type = 'text', ...props }) {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink-600">
          {label}
          {required && <span className="ml-0.5 text-coral-500">*</span>}
        </span>
      )}
      <input
        type={type}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400
          bg-mist-100 border-transparent transition-colors
          focus:bg-white focus:border-navy-700 focus:outline-none
          ${error ? 'border-coral-500 bg-white' : ''} ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-coral-600">{error}</span>}
    </label>
  )
}
