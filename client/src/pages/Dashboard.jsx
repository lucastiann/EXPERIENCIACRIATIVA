import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, ClipboardList, ImageIcon, ArrowUpRight, Stethoscope } from 'lucide-react';
import api from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Card, { CardHeader } from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/reports/summary').then((r) => setSummary(r.data));
  }, []);

  const cards = [
    { key: 'patients', label: 'Pacientes cadastrados', icon: Users, tone: 'violet' },
    { key: 'referred', label: 'Encaminhados ao teste', icon: AlertTriangle, tone: 'coral' },
    { key: 'scores', label: 'Scores aplicados', icon: ClipboardList, tone: 'amber' },
    { key: 'attachments', label: 'Anexos (foto/vídeo)', icon: ImageIcon, tone: 'emerald' },
  ];

  const toneStyles = {
    violet: 'bg-violet2-100 text-violet2-700',
    coral: 'bg-coral-100 text-coral-600',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-ink-400">Bem-vindo(a)</div>
          <h1 className="font-display text-5xl tracking-tight mt-1">Ola, {user?.name?.split(' ')[0]}.</h1>
          <p className="text-ink-400 mt-2">Sua visão geral da triagem hoje.</p>
        </div>
        <Link to="/pacientes/novo">
          <Button size="lg">+ Novo paciente</Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="surface p-6"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneStyles[c.tone]}`}>
              <c.icon size={18} />
            </div>
            <div className="mt-4 font-display text-4xl tracking-tight">
              {summary ? summary[c.key] : <span className="opacity-30">--</span>}
            </div>
            <div className="text-xs text-ink-400 uppercase tracking-[0.14em] mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Encaminhamentos recentes */}
      <Card>
        <CardHeader
          title="Encaminhamentos recentes"
          subtitle="Pacientes com score acima do corte — prioridade para o teste genético"
          action={<Link to="/relatorios" className="text-sm text-violet2-700 inline-flex items-center gap-1 hover:underline">Ver relatorio completo <ArrowUpRight size={14}/></Link>}
        />

        {summary?.recentReferrals?.length ? (
          <ul className="divide-y divide-ink-100">
            {summary.recentReferrals.map((r) => (
              <li key={r.patient_id + '-' + r.created_at} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-coral-100 text-coral-600 rounded-xl flex items-center justify-center">
                    <Stethoscope size={16} />
                  </div>
                  <div>
                    <Link to={`/pacientes/${r.patient_id}`} className="font-medium hover:text-violet2-700">{r.full_name}</Link>
                    <div className="text-xs text-ink-400">{new Date(r.created_at).toLocaleString('pt-BR')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl tracking-tight">{r.total_score}</div>
                  <div className="text-[10px] text-ink-400 uppercase tracking-[0.14em]">limiar {r.threshold_used}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Stethoscope size={36} />}
            title="Nenhum encaminhamento por enquanto."
            description="Quando um score passar da nota de corte, ele aparece aqui."
          />
        )}
      </Card>
    </div>
  );
}
