// Indicador visual do escore — arco semi-circular que vai do baixo (verde) ao alto (coral).
// A linha tracejada marca o limiar configurado pelo admin.

import { motion } from 'framer-motion';

export default function ScoreMeter({ value = 0, max = 30, threshold = 10, size = 220 }) {
  const radius = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI; // 180deg
  const endAngle = 2 * Math.PI; // 360deg
  const arcLen = Math.PI * radius;
  const valuePct = Math.max(0, Math.min(1, value / max));
  const thresholdPct = Math.max(0, Math.min(1, threshold / max));

  function pointOnArc(t) {
    const angle = startAngle + (endAngle - startAngle) * t;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }
  const thresholdPt = pointOnArc(thresholdPct);
  const refer = value >= threshold;

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <defs>
          <linearGradient id="meter" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#10b981" />
            <stop offset="0.55" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#fb7185" />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          stroke="#e9e3d6"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          stroke="url(#meter)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={arcLen}
          initial={{ strokeDashoffset: arcLen }}
          animate={{ strokeDashoffset: arcLen * (1 - valuePct) }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
        {/* marcador do limiar */}
        <circle cx={thresholdPt.x} cy={thresholdPt.y} r="6" fill="white" stroke="#0e0c1d" strokeWidth="2.5" />
        <text x={thresholdPt.x} y={thresholdPt.y + 22} textAnchor="middle" fontSize="10" fill="#6b6862" fontWeight="500">
          limiar {threshold}
        </text>
      </svg>
      <div className="-mt-12 text-center">
        <div className="font-display text-5xl tracking-tight">{value.toFixed(1)}</div>
        <div className="text-xs uppercase tracking-[0.16em] text-ink-400 mt-1">
          de {max.toFixed(0)} pontos
        </div>
        <div className={`mt-2 text-sm font-medium ${refer ? 'text-coral-600' : 'text-emerald-600'}`}>
          {refer ? 'Encaminhar para teste genético' : 'Abaixo do limiar de encaminhamento'}
        </div>
      </div>
    </div>
  );
}
