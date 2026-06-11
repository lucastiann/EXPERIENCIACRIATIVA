import clsx from 'clsx';

const tones = {
  neutral: 'bg-ink-100 text-ink-600',
  violet: 'bg-violet2-100 text-violet2-700',
  coral: 'bg-coral-100 text-coral-600',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-emerald-100 text-emerald-700',
};

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={clsx('chip', tones[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    em_triagem: { tone: 'violet', label: 'Em triagem' },
    encaminhado: { tone: 'amber', label: 'Encaminhado p/ teste' },
    diagnosticado: { tone: 'green', label: 'Diagnosticado' },
    descartado: { tone: 'neutral', label: 'Descartado' },
  };
  const cfg = map[status] || { tone: 'neutral', label: status };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
