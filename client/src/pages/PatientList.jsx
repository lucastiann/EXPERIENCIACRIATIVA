import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Users } from 'lucide-react';
import api from '../api/client.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { StatusBadge } from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';

function formatCpf(cpf) {
  if (!cpf) return '';
  const d = cpf.replace(/\D/g, '').padStart(11, '0');
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
}

export default function PatientList() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api.get('/patients', { params: { search } }).then((r) => {
        setList(r.data);
        setLoading(false);
      });
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-ink-400">Pacientes</div>
          <h1 className="font-display text-5xl tracking-tight mt-1">Acompanhamentos</h1>
        </div>
        <Link to="/pacientes/novo">
          <Button size="lg"><Plus size={16} /> Novo paciente</Button>
        </Link>
      </div>

      <div className="surface p-4">
        <div className="flex items-center gap-3">
          <Search size={18} className="text-ink-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou CPF..."
            className="flex-1 bg-transparent border-0 outline-none text-sm py-2"
          />
        </div>
      </div>

      {loading ? (
        <Card><div className="text-ink-400 text-sm">Carregando...</div></Card>
      ) : list.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users size={36} />}
            title="Nenhum paciente encontrado"
            description={search ? 'Tente outra busca.' : 'Comece cadastrando o primeiro paciente.'}
            action={<Link to="/pacientes/novo"><Button>Cadastrar paciente</Button></Link>}
          />
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.14em] text-ink-400 border-b border-ink-100">
                <th className="text-left font-medium px-6 py-3">Paciente</th>
                <th className="text-left font-medium px-6 py-3">CPF</th>
                <th className="text-left font-medium px-6 py-3">Sexo</th>
                <th className="text-left font-medium px-6 py-3">Ultimo score</th>
                <th className="text-left font-medium px-6 py-3">Situacao</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-ink-100 last:border-0 hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-3">
                    <Link to={`/pacientes/${p.id}`} className="font-medium hover:text-violet2-700">
                      {p.full_name}
                    </Link>
                    <div className="text-xs text-ink-400">
                      {p.primary_caregiver_name ? `Resp.: ${p.primary_caregiver_name}` : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-ink-600">{formatCpf(p.cpf)}</td>
                  <td className="px-6 py-3">{p.sex === 'M' ? 'M' : 'F'}</td>
                  <td className="px-6 py-3">
                    {p.last_score ? (
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg">{p.last_score.total_score}</span>
                        <span className="text-xs text-ink-400">/ limiar {p.last_score.threshold_used}</span>
                      </div>
                    ) : <span className="text-xs text-ink-400">sem score</span>}
                  </td>
                  <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
