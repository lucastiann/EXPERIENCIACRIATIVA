export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-ink-200 mb-3">{icon}</div>}
      <h3 className="font-display text-2xl tracking-tight">{title}</h3>
      {description && <p className="text-ink-400 text-sm max-w-md mt-2">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
