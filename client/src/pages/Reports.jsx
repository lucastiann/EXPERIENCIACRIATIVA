import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download } from 'lucide-react';
import api from '../api/client.js';
import Card, { CardHeader } from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import EmptyState from '../components/EmptyState.jsx';

function formatCpf(cpf) {
  if (!cpf) return '—';
  const d = cpf.replace(/\D/g, '').padStart(11, '0');
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
}

function toCsv(rows) {
  const headers = ['paciente', 'cpf', 'sexo', 'score', 'limiar', 'data', 'profissional'];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push([
      JSON.stringify(r.patient_name || ''),
      formatCpf(r.patient_cpf),
      r.patient_sex,
      r.total_score,
      r.threshold_used,
      new Date(r.created_at).toLocaleString('pt-BR'),
      JSON.stringify(r.professional_name || ''),
    ].join(','));
  }
  return lines.join('\n');
}

export default function Reports() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await api.get('/reports/referrals', { params: { from, to } });
    setRows(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  function downloadCsv() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encaminhamentos-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink-400">Relatorios</div>
        <h1 className="font-display text-5xl tracking-tight mt-1">Encaminhamentos</h1>
        <p className="text-ink-400 mt-2">Pacientes que ultrapassaram o limiar no score — candidatos ao teste genetico.</p>
      </div>

      <Card>
        <div className="grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
          <Input label="De" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="Ate" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <Button onClick={load} loading={loading}><Calendar size={16}/> Filtrar</Button>
          <Button variant="secondary" onClick={downloadCsv} disabled={!rows.length}><Download size={16}/> CSV</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Nenhum encaminhamento no periodo" description="Ajuste os filtros ou aguarde novos scores." />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.14em] text-ink-400 border-b border-ink-100">
                <th className="text-left font-medium px-6 py-3">Paciente</th>
                <th className="text-left font-medium px-6 py-3">CPF</th>
                <th className="text-left font-medium px-6 py-3">Score</th>
                <th className="text-left font-medium px-6 py-3">Profissional</th>
                <th className="text-left font-medium px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.score_id} className="border-b border-ink-100 last:border-0 hover:bg-cream-50">
                  <td className="px-6 py-3"><Link to={`/pacientes/${r.patient_id}`} className="font-medium hover:text-violet2-700">{r.patient_name}</Link></td>
                  <td className="px-6 py-3 font-mono text-xs">{formatCpf(r.patient_cpf)}</td>
                  <td className="px-6 py-3"><span className="font-display text-lg">{r.total_score}</span> <span className="text-xs text-ink-400">/ {r.threshold_used}</span></td>
                  <td className="px-6 py-3">{r.professional_name} <span className="text-xs text-ink-400 capitalize">({r.professional_profession})</span></td>
                  <td className="px-6 py-3 text-ink-600">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
