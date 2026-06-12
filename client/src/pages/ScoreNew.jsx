// Wizard de aplicacao do score.
// Conforme Ina: cada sessao pode ser respondida por uma pessoa diferente
// (profissional, mae, professora por telefone, etc) — o respondente eh registrado.

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import api from '../api/client.js';
import Card, { CardHeader } from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';
import ScoreMeter from '../components/ScoreMeter.jsx';

const RESPONDENT_TYPES = [
  { value: 'profissional', label: 'Eu, profissional' },
  { value: 'familiar_cadastrado', label: 'Familiar cadastrado' },
  { value: 'familiar_telefone', label: 'Ligação com a familia (telefone)' },
  { value: 'outro', label: 'Outro' },
];

const CATEGORY_LABELS = {
  fisica: 'Características físicas',
  cognitiva: 'Aspectos cognitivos',
  comportamental: 'Comportamento social',
};

export default function EscoreNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState({}); // key -> bool
  const [threshold, setThreshold] = useState(10);
  const [respondent, setRespondent] = useState({ type: 'profissional', family_member_id: '', name: '', relation: '' });
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: p } = await api.get(`/patients/${id}`);
      setPatient(p);
      const { data: s } = await api.get('/symptoms', { params: { sex: p.sex } });
      setSymptoms(s);
      const { data: settings } = await api.get('/settings').catch(() => ({ data: {} }));
      if (settings.escore_threshold) setThreshold(parseFloat(settings.escore_threshold));
    })();
  }, [id]);

  // calculo do preview em tempo real
  const preview = useMemo(() => {
    if (!patient || !symptoms.length) return { total: 0, max: 0 };
    let total = 0, max = 0;
    for (const s of symptoms) {
      let w = s.base_weight;
      if (patient.sex === 'F' && s.category !== 'fisica') w *= 0.7;
      max += w;
      if (selected[s.key]) total += w;
    }
    return { total: Math.round(total * 10) / 10, max: Math.round(max * 10) / 10 };
  }, [patient, symptoms, selected]);

  if (!patient) return <div className="text-ink-400">Carregando...</div>;

  function toggle(key) { setSelected((m) => ({ ...m, [key]: !m[key] })); }

  async function submit() {
    setSaving(true);
    try {
      const payload = {
        symptom_keys: Object.keys(selected).filter((k) => selected[k]),
        respondent_type: respondent.type,
        family_member_id: respondent.type === 'familiar_cadastrado' ? respondent.family_member_id : null,
        respondent_name: ['familiar_telefone', 'outro'].includes(respondent.type) ? respondent.name : null,
        respondent_relation: ['familiar_telefone', 'outro'].includes(respondent.type) ? respondent.relation : null,
        session_notes: notes,
      };
      const { data } = await api.post(`/patients/${id}/escores`, payload);
      setResult(data);
    } finally {
      setSaving(false);
    }
  }

  // Agrupa sintomas por categoria
  const grouped = symptoms.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Card className="text-center py-12">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 items-center justify-center mb-6">
            <Check size={32}/>
          </div>
          <h1 className="font-display text-4xl tracking-tight">Score registrado</h1>
          <p className="text-ink-400 mt-2">Resumo da avaliação:</p>

          <div className="mt-8 flex justify-center">
            <ScoreMeter value={result.total} max={result.max} threshold={result.threshold} />
          </div>

          {result.refer ? (
            <div className="mt-8 bg-coral-50 border border-coral-100 rounded-2xl p-5 text-left">
              <div className="font-medium text-coral-600 flex items-center gap-2"><Sparkles size={16}/> Recomendação</div>
              <p className="text-sm text-ink-600 mt-2">
                O score está acima do limiar configurado. <strong>Considere encaminhar o paciente para o teste genético confirmatório</strong>.
                Antes disso, ajude o Instituto a anexar fotos/videos e talvez aplicar um segundo score com outro acompanhante.
              </p>
            </div>
          ) : (
            <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-left">
              <div className="font-medium text-emerald-700 flex items-center gap-2"><Sparkles size={16}/> Resultado</div>
              <p className="text-sm text-ink-600 mt-2">
                O score está abaixo do limiar. Considere acompanhar o paciente e aplicar novos scores no futuro,
                principalmente com outros familiares — o comportamento pode mudar conforme o acompanhante.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button variant="ghost" onClick={() => { setResult(null); setSelected({}); }}>Aplicar outro</Button>
            <Button onClick={() => navigate(`/pacientes/${id}`)}>Voltar ao prontuário</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-400 hover:text-ink-900 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Voltar
      </button>

      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink-400">Nova avaliação</div>
        <h1 className="font-display text-5xl tracking-tight mt-1">Score — {patient.full_name}</h1>
        <p className="text-ink-400 mt-2">Marque as características observadas. O resultado é calculado em tempo real.</p>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Quem esta respondendo?" subtitle="Cada respondente pode dar um score diferente — esse contexto é importante." />
            <Select label="Tipo de respondente" options={RESPONDENT_TYPES} value={respondent.type} onChange={(e) => setRespondent({ ...respondent, type: e.target.value })} />

            {respondent.type === 'familiar_cadastrado' && (
              <Select className="mt-4"
                label="Familiar"
                options={[{ value: '', label: 'Selecione...' }, ...patient.family.map((f) => ({ value: f.id, label: `${f.name} (${f.relation})` }))]}
                value={respondent.family_member_id}
                onChange={(e) => setRespondent({ ...respondent, family_member_id: e.target.value })}
              />
            )}
            {(respondent.type === 'familiar_telefone' || respondent.type === 'outro') && (
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Input label="Nome" value={respondent.name} onChange={(e) => setRespondent({ ...respondent, name: e.target.value })} />
                <Input label="Vinculo / Funcao" placeholder="ex: mae, professora" value={respondent.relation} onChange={(e) => setRespondent({ ...respondent, relation: e.target.value })} />
              </div>
            )}
          </Card>

          {Object.entries(grouped).map(([cat, items]) => (
            <Card key={cat}>
              <CardHeader
                title={CATEGORY_LABELS[cat] || cat}
                subtitle={cat === 'fisica' ? 'Tracos morfologicos observaveis no exame.' :
                          cat === 'cognitiva' ? 'Funcoes cognitivas e desenvolvimento.' :
                          'Comportamento social e atencional (alta sobreposicao com TEA).'}
              />
              <div className="grid sm:grid-cols-2 gap-2">
                {items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggle(s.key)}
                    className={`group text-left rounded-2xl border px-4 py-3 transition-all ${
                      selected[s.key]
                        ? 'bg-violet2-600 border-violet2-600 text-white'
                        : 'bg-white border-ink-100 hover:border-violet2-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className={`text-xs mt-1 ${selected[s.key] ? 'text-violet2-100' : 'text-ink-400'}`}>
                          peso {s.base_weight}{patient.sex === 'F' && s.category !== 'fisica' ? ' × 0,7 (F)' : ''}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected[s.key] ? 'bg-white border-white text-violet2-600' : 'border-ink-200'
                      }`}>
                        {selected[s.key] && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          ))}

          <Card>
            <CardHeader title="Anotações da sessão" subtitle="Contextos relevantes — o que o respondente contou, observações do dia, etc." />
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
          </Card>
        </div>

        {/* Painel lateral: preview do score */}
        <div className="lg:sticky lg:top-6 self-start">
          <Card>
            <CardHeader title="Preview" subtitle="Resultado em tempo real" />
            <div className="flex justify-center">
              <ScoreMeter value={preview.total} max={preview.max} threshold={threshold} />
            </div>

            <Button onClick={submit} loading={saving} className="w-full mt-6" size="lg">
              Salvar score
            </Button>

            <p className="text-xs text-ink-400 mt-3 text-center">
              O score é salvo no prontuário do paciente.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
