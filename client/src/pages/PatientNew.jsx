// Cadastro de paciente. Tem busca por CPF: se ja existe, redireciona para o
// detalhe (em vez de duplicar).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api/client.js';
import Card, { CardHeader } from '../components/Card.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';
import Button from '../components/Button.jsx';

const SEXOS = [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }];

const RELACOES = [
  { value: '', label: 'Selecione...' },
  { value: 'mae', label: 'Mae' },
  { value: 'pai', label: 'Pai' },
  { value: 'avo_materna', label: 'Avo materna' },
  { value: 'avo_paterna', label: 'Avo paterna' },
  { value: 'tutor', label: 'Tutor(a) legal' },
  { value: 'irma', label: 'Irma' },
  { value: 'outro', label: 'Outro' },
];

function maskCpf(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export default function PatientNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '', cpf: '', birth_date: '', sex: 'M',
    primary_caregiver_name: '', primary_caregiver_relation: '',
    primary_caregiver_phone: '', city: '', state: '', notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  // verifica em tempo real se ja existe paciente com aquele CPF
  async function onCpfBlur() {
    const digits = form.cpf.replace(/\D/g, '');
    if (digits.length !== 11) return;
    try {
      const r = await api.get(`/patients/by-cpf/${digits}`);
      setCheckResult(r.data);
    } catch {
      setCheckResult(null);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/patients', form);
      navigate(`/pacientes/${data.id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.existing_id) {
        navigate(`/pacientes/${data.existing_id}`);
      } else {
        setError(data?.error || 'Erro ao salvar');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-400 hover:text-ink-900 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Voltar
      </button>
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink-400">Novo paciente</div>
        <h1 className="font-display text-5xl tracking-tight mt-1">Cadastro</h1>
      </div>

      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader title="Dados do paciente" subtitle="Comece pelo CPF — se ja existir cadastro, voce sera levado para o prontuario." />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="CPF"
              value={form.cpf}
              onChange={(e) => update('cpf', maskCpf(e.target.value))}
              onBlur={onCpfBlur}
              placeholder="000.000.000-00"
              hint="Opcional para criancas pequenas"
            />
            <Input label="Nome completo" required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
            <Input label="Data de nascimento" type="date" value={form.birth_date} onChange={(e) => update('birth_date', e.target.value)} />
            <Select label="Sexo" options={SEXOS} value={form.sex} onChange={(e) => update('sex', e.target.value)} />
          </div>

          {checkResult && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-800">
              Ja existe um paciente cadastrado com esse CPF: <strong>{checkResult.full_name}</strong>.
              Ao salvar voce sera redirecionado para o prontuario dele.
            </div>
          )}
        </Card>

        <Card className="mt-5">
          <CardHeader
            title="Responsavel principal"
            subtitle="Quem normalmente acompanha o paciente. Em cada score voce pode indicar um responsavel diferente."
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Nome do responsavel" value={form.primary_caregiver_name} onChange={(e) => update('primary_caregiver_name', e.target.value)} />
            <Select label="Vinculo" options={RELACOES} value={form.primary_caregiver_relation} onChange={(e) => update('primary_caregiver_relation', e.target.value)} />
            <Input label="Telefone do responsavel" value={form.primary_caregiver_phone} onChange={(e) => update('primary_caregiver_phone', e.target.value)} />
          </div>
        </Card>

        <Card className="mt-5">
          <CardHeader title="Localizacao e observacoes" subtitle="Tudo opcional." />
          <div className="grid sm:grid-cols-[1fr_120px] gap-4">
            <Input label="Cidade" value={form.city} onChange={(e) => update('city', e.target.value)} />
            <Input label="UF" value={form.state} onChange={(e) => update('state', e.target.value)} maxLength={2} />
          </div>
          <Textarea label="Observacoes" className="mt-4" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Algum contexto relevante sobre o paciente..." />
        </Card>

        {error && <div className="mt-4 text-sm text-coral-600 bg-coral-50 border border-coral-100 rounded-xl px-3 py-2">{error}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" loading={loading} size="lg">Salvar paciente</Button>
        </div>
      </form>
    </div>
  );
}
