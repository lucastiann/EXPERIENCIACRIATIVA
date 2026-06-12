// Prontuario completo do paciente. Tres blocos:
//  1. Dados + acoes
//  2. Familia (rastreamento genetico)
//  3. Historico de scores
//  4. Anexos (foto/video)

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, FileText, ImageIcon, Video, ClipboardList, Network } from 'lucide-react';
import api from '../api/client.js';
import Card, { CardHeader } from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';
import { StatusBadge } from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';

function formatCpf(cpf) {
  if (!cpf) return '—';
  const d = cpf.replace(/\D/g, '').padStart(11, '0');
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
}

const RELATIONS = ['mae', 'pai', 'irmao', 'irma', 'tio', 'tia', 'avo_materno', 'avo_materna', 'avo_paterno', 'avo_paterna', 'primo', 'prima', 'outro'];

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const fileInputRef = useRef(null);

  async function load() {
    const { data } = await api.get(`/patients/${id}`);
    setPatient(data);
  }
  useEffect(() => { load(); }, [id]); // eslint-disable-line

  async function uploadFiles(files) {
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      await api.post(`/patients/${id}/attachments`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    load();
  }

  async function deletePatient() {
    if (!confirm('Apagar paciente? Essa acao nao pode ser desfeita.')) return;
    await api.delete(`/patients/${id}`);
    navigate('/pacientes');
  }

  if (!patient) {
    return <div className="text-ink-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-400 hover:text-ink-900 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-ink-400">Paciente</div>
          <h1 className="font-display text-5xl tracking-tight mt-1">{patient.full_name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <StatusBadge status={patient.status} />
            <span className="text-sm text-ink-400">CPF {formatCpf(patient.cpf)}</span>
            <span className="text-sm text-ink-400">·</span>
            <span className="text-sm text-ink-400">{patient.sex === 'M' ? 'Masculino' : 'Feminino'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/pacientes/${id}/escore`}>
            <Button size="lg"><ClipboardList size={16}/> Novo score</Button>
          </Link>
          <Button variant="ghost" onClick={deletePatient}><Trash2 size={14}/> Excluir</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Coluna esquerda */}
        <div className="space-y-6">
          {/* Scores */}
          <ScoresCard patient={patient} />
          {/* Anexos */}
          <AttachmentsCard patient={patient} onUpload={(files) => uploadFiles(files)} onReload={load} inputRef={fileInputRef} />
        </div>

        {/* Coluna direita */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Dados de contato" />
            <dl className="text-sm space-y-2">
              <Row label="Responsavel" value={patient.primary_caregiver_name} />
              <Row label="Vinculo" value={patient.primary_caregiver_relation} />
              <Row label="Telefone" value={patient.primary_caregiver_phone} />
              <Row label="Nascimento" value={patient.birth_date} />
              <Row label="Cidade/UF" value={[patient.city, patient.state].filter(Boolean).join('/')} />
            </dl>
            {patient.notes && (
              <div className="mt-4 text-sm bg-cream-100 rounded-2xl p-3 text-ink-600">
                <div className="text-xs text-ink-400 uppercase tracking-[0.14em] mb-1">Observacoes</div>
                {patient.notes}
              </div>
            )}
          </Card>

          <FamilyCard patient={patient} onReload={load} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="text-xs uppercase tracking-[0.14em] text-ink-400 w-28">{label}</dt>
      <dd className="text-ink-900">{value || '—'}</dd>
    </div>
  );
}

function ScoresCard({ patient }) {
  return (
    <Card>
      <CardHeader
        title="Historico de scores"
        subtitle="Cada sessao de avaliacao gera um score — pelo profissional, pelo Instituto Buko Kaesemodel, por familiares diferentes."
        action={<Link to={`/pacientes/${patient.id}/escore`}><Button size="sm"><Plus size={14}/> Novo</Button></Link>}
      />
      {patient.scores.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={32} />}
          title="Nenhum score aplicado"
          description="Comece a triagem aplicando o primeiro score. Voce pode aplicar varios ao longo do tempo."
          action={<Link to={`/pacientes/${patient.id}/escore`}><Button>Aplicar score</Button></Link>}
        />
      ) : (
        <ul className="divide-y divide-ink-100">
          {patient.scores.map((s) => (
            <li key={s.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  score {s.total_score} <span className="text-ink-400 text-sm font-normal">/ limiar {s.threshold_used}</span>
                </div>
                <div className="text-xs text-ink-400">
                  {s.respondent_type === 'profissional' && `Por ${s.professional_name}`}
                  {s.respondent_type === 'familiar_cadastrado' && `Familiar (${s.respondent_relation || ''})`}
                  {s.respondent_type === 'familiar_telefone' && `Ligação c/ ${s.respondent_name}`}
                  {s.respondent_type === 'outro' && (s.respondent_name || 'Outro')}
                  {' · '}
                  {new Date(s.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="text-right">
                {s.refer_to_genetic_test ? (
                  <span className="chip bg-coral-100 text-coral-600">Encaminhar</span>
                ) : (
                  <span className="chip bg-emerald-100 text-emerald-700">Abaixo do limiar</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function AttachmentsCard({ patient, onUpload, onReload, inputRef }) {
  async function del(att) {
    if (!confirm('Remover esse anexo?')) return;
    await api.delete(`/attachments/${att.id}`);
    onReload();
  }
  return (
    <Card>
      <CardHeader
        title="Fotos e videos"
        subtitle="Evidencias visuais — hiperelasticidade nos dedos, face, comportamento — para o Instituto Buko Kaesemodel avaliar."
        action={
          <Button size="sm" onClick={() => inputRef.current?.click()}>
            <Upload size={14}/> Enviar
          </Button>
        }
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => onUpload(Array.from(e.target.files || []))}
      />
      {patient.attachments.length === 0 ? (
        <EmptyState
          icon={<ImageIcon size={32}/>}
          title="Sem anexos"
          description="Voce pode enviar fotos das maos, face, ou videos curtos do comportamento."
          action={<Button onClick={() => inputRef.current?.click()}><Upload size={14}/> Enviar arquivos</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {patient.attachments.map((a) => (
            <div key={a.id} className="group relative aspect-square bg-cream-100 rounded-2xl overflow-hidden border border-ink-100">
              {a.kind === 'image' && (
                <img src={`/uploads/${a.file_name}`} alt={a.original_name} className="w-full h-full object-cover" />
              )}
              {a.kind === 'video' && (
                <video src={`/uploads/${a.file_name}`} className="w-full h-full object-cover" controls={false} />
              )}
              {a.kind === 'document' && (
                <div className="w-full h-full flex flex-col items-center justify-center text-ink-400">
                  <FileText size={28} />
                  <span className="text-[10px] mt-1 px-2 text-center truncate w-full">{a.original_name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2">
                <div className="text-white text-[10px] truncate">{a.original_name}</div>
                <button onClick={() => del(a)} className="self-start text-[10px] mt-1 bg-white/20 hover:bg-coral-500 text-white rounded px-1.5 py-0.5">
                  Remover
                </button>
              </div>
              <span className="absolute top-2 left-2 chip bg-white/90 text-ink-600">
                {a.kind === 'video' ? <Video size={10}/> : <ImageIcon size={10}/>} {a.kind}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function FamilyCard({ patient, onReload }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', relation: 'mae', side: 'materna', sex: 'F', has_diagnosis: 'desconhecido', symptoms_observed: '' });

  async function add(e) {
    e.preventDefault();
    await api.post(`/patients/${patient.id}/family`, form);
    setAdding(false);
    setForm({ name: '', relation: 'mae', side: 'materna', sex: 'F', has_diagnosis: 'desconhecido', symptoms_observed: '' });
    onReload();
  }

  async function remove(fm) {
    if (!confirm('Remover esse familiar?')) return;
    await api.delete(`/patients/family/${fm.id}`);
    onReload();
  }

  return (
    <Card>
      <CardHeader
        title="Familiares"
        subtitle="X Fragil eh hereditario. Mapeie a familia pra rastrear quem pode ter."
        action={<Button size="sm" onClick={() => setAdding((v) => !v)}><Network size={14}/> {adding ? 'Cancelar' : 'Adicionar'}</Button>}
      />

      {adding && (
        <form onSubmit={add} className="bg-cream-100 rounded-2xl p-4 space-y-3 mb-4">
          <Input label="Nome" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Vinculo" options={RELATIONS.map((r) => ({ value: r, label: r.replace('_', ' ') }))} value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} />
            <Select label="Linha" options={[{value:'materna',label:'Materna'},{value:'paterna',label:'Paterna'}]} value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value })} />
            <Select label="Sexo" options={[{value:'M',label:'Masculino'},{value:'F',label:'Feminino'}]} value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} />
            <Select label="Diagnostico" options={[{value:'desconhecido',label:'Desconhecido'},{value:'sim',label:'Sim'},{value:'nao',label:'Nao'}]} value={form.has_diagnosis} onChange={(e) => setForm({ ...form, has_diagnosis: e.target.value })} />
          </div>
          <Textarea label="Sintomas observados" value={form.symptoms_observed} onChange={(e) => setForm({ ...form, symptoms_observed: e.target.value })} placeholder="ex: dificuldade escolar, atraso de fala..." />
          <Button type="submit" size="sm">Adicionar familiar</Button>
        </form>
      )}

      {patient.family.length === 0 ? (
        <p className="text-sm text-ink-400">Nenhum familiar registrado.</p>
      ) : (
        <ul className="space-y-2">
          {patient.family.map((f) => (
            <li key={f.id} className="bg-cream-50 border border-ink-100 rounded-2xl p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{f.name} <span className="text-ink-400 text-xs font-normal capitalize">· {f.relation.replace('_',' ')}</span></div>
                  <div className="text-xs text-ink-400">
                    Linha {f.side || '—'} · Diagnostico: {f.has_diagnosis}
                  </div>
                  {f.symptoms_observed && <div className="text-xs text-ink-600 mt-1">{f.symptoms_observed}</div>}
                </div>
                <button onClick={() => remove(f)} className="text-ink-400 hover:text-coral-600">
                  <Trash2 size={14}/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
