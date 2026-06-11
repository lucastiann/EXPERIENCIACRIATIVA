import clsx from 'clsx';

export default function Card({ children, className = '', as = 'div', ...rest }) {
  const Tag = as;
  return (
    <Tag className={clsx('surface p-6', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
