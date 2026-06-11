import clsx from 'clsx';

export function Input({ label, hint, error, className = '', as = 'input', children, ...rest }) {
  const Tag = as;
  return (
    <label className={clsx('block', className)}>
      {label && <span className="block text-sm font-medium text-ink-600 mb-1.5">{label}</span>}
      <Tag
        className={clsx(
          'w-full bg-white border rounded-2xl px-4 py-2.5 text-sm transition-all',
          'placeholder:text-ink-200',
          'focus:outline-none focus:ring-4 focus:ring-violet2-200/60 focus:border-violet2-400',
          error ? 'border-coral-300' : 'border-ink-100'
        )}
        {...rest}
      >
        {children}
      </Tag>
      {hint && !error && <span className="block text-xs text-ink-400 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-coral-600 mt-1">{error}</span>}
    </label>
  );
}

export function Select({ label, hint, error, options = [], className = '', ...rest }) {
  return (
    <label className={clsx('block', className)}>
      {label && <span className="block text-sm font-medium text-ink-600 mb-1.5">{label}</span>}
      <div className="relative">
        <select
          className={clsx(
            'w-full appearance-none bg-white border rounded-2xl px-4 py-2.5 pr-10 text-sm transition-all cursor-pointer',
            'focus:outline-none focus:ring-4 focus:ring-violet2-200/60 focus:border-violet2-400',
            error ? 'border-coral-300' : 'border-ink-100'
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {hint && !error && <span className="block text-xs text-ink-400 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-coral-600 mt-1">{error}</span>}
    </label>
  );
}

export function Textarea(props) {
  return <Input as="textarea" rows={3} {...props} />;
}
