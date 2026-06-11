import clsx from 'clsx';

const variants = {
  primary:
    'bg-violet2-600 text-white hover:bg-violet2-700 active:bg-violet2-800 shadow-soft',
  secondary:
    'bg-white text-ink-900 border border-ink-100 hover:bg-cream-50 active:bg-cream-100',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100/60',
  danger:
    'bg-coral-500 text-white hover:bg-coral-600',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-xl',
  md: 'text-sm px-4 py-2.5 rounded-2xl',
  lg: 'text-base px-5 py-3 rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-violet2-200/60',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
