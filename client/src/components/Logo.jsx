// Logo da plataforma — duas formas X estilizadas, evocando os cromossomos
// emparelhados no exame de FISH. Renderizadas como SVG inline pra escalar.

export default function Logo({ size = 36, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
        <defs>
          <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#324db7" />
            <stop offset="1" stopColor="#2a6cd6" />
          </linearGradient>
          <linearGradient id="lg-b" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#d0d0d0" />
            <stop offset="1" stopColor="#adadad" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#lg-a)" />
        <g stroke="white" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M16 14 L28 32 L16 50" />
          <path d="M28 14 L16 32 L28 50" opacity="0.65" />
        </g>
        <g stroke="url(#lg-b)" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M36 14 L48 32 L36 50" />
          <path d="M48 14 L36 32 L48 50" opacity="0.7" />
        </g>
      </svg>
      <div className="leading-none">
        <div className="font-display text-[1.35rem] tracking-tight">X Fragil</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-000">Triagem clinica</div>
      </div>
    </div>
  );
}
