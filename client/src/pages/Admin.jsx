// Painel administrativo. Apenas usuarios com role=admin acessam.

import { useEffect, useState } from 'react';
import { Settings, Users, History, Save } from 'lucide-react';
import api from '../api/client.js';
import Card, { CardHeader } from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import Badge from '../components/Badge.jsx';

export default function Admin() {
  const [tab, setTab] = useState('settings');
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink-400">Administração</div>
        <h1 className="font-display text-5xl tracking-tight mt-1">Painel da Instituto Buko Kaesemodel</h1>
      </div>

      <div className="flex gap-2 border-b border-ink-100">
        {[
          { id: 'settings', label: 'Configurações', icon: Settings },
          { id: 'professionals', label: 'Profissionais', icon: Users },
          { id: 'audit', label: 'Auditoria', icon: History },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              tab === t.id ? 'border-violet2-600 text-violet2-700' : 'border-transparent text-ink-400 hover:text-ink-900'
            }`}
          >
            <t.icon size={14}/> {t.label}
          </button>
        ))}
      </div>

      {tab === 'settings' && <SettingsTab />}
      {tab === 'professionals' && <ProfessionalsTab />}
      {tab === 'audit' && <AuditTab />}
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/admin/settings').then((r) => setSettings(r.data)); }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    await api.patch('/admin/settings', settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function update(k, v) { setSettings((s) => ({ ...s, [k]: v })); }

  return (
    <form onSubmit={save} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader title="Cálculo do score" subtitle="Limiar a partir do qual o paciente é marcado como candidato ao teste genético." />
        <Input
          label="Score mínimo para encaminhamento"
          type="number"
          step="0.1"
          value={settings.score_threshold || ''}
          onChange={(e) => update('score_threshold', e.target.value)}
          hint="Em pontos. Valor de referência: 10."
        />
      </Card>

      <Card>
        <CardHeader title="Contato do Instituto Buko Kaesemodel" subtitle="(aparece nos relatórios e na página inicial)" />
        <div className="space-y-4">
          <Input label="Nome da plataforma" value={settings.platform_name || ''} onChange={(e) => update('platform_name', e.target.value)} />
          <Input label="Email de contato" type="email" value={settings.ong_contact_email || ''} onChange={(e) => update('ong_contact_email', e.target.value)} />
          <Input label="Telefone" value={settings.ong_contact_phone || ''} onChange={(e) => update('ong_contact_phone', e.target.value)} />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={saving}><Save size={14}/> Salvar</Button>
        {saved && <span className="text-sm text-emerald-700">Salvo!</span>}
      </div>
    </form>
  );
}

function ProfessionalsTab() {
  const [pros, setPros] = useState([]);
  useEffect(() => { api.get('/admin/professionals').then((r) => setPros(r.data)); }, []);

  async function toggle(p) {
    await api.patch(`/admin/professionals/${p.id}`, { active: !p.active });
    setPros((cur) => cur.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
  }

  return (
    <Card className="p-0 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-[0.14em] text-ink-400 border-b border-ink-100">
            <th className="text-left font-medium px-6 py-3">Nome</th>
            <th className="text-left font-medium px-6 py-3">Email</th>
            <th className="text-left font-medium px-6 py-3">Profissao</th>
            <th className="text-left font-medium px-6 py-3">Registro</th>
            <th className="text-left font-medium px-6 py-3">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pros.map((p) => (
            <tr key={p.id} className="border-b border-ink-100 last:border-0">
              <td className="px-6 py-3 font-medium">{p.name}</td>
              <td className="px-6 py-3 text-ink-600">{p.email}</td>
              <td className="px-6 py-3 capitalize">{p.profession?.replace('_', ' ')}</td>
              <td className="px-6 py-3 font-mono text-xs">{p.license_type} {p.license_number}</td>
              <td className="px-6 py-3">
                {p.active ? <Badge tone="green">ativo</Badge> : <Badge tone="coral">desativado</Badge>}
              </td>
              <td className="px-6 py-3 text-right">
                <Button size="sm" variant={p.active ? 'ghost' : 'secondary'} onClick={() => toggle(p)}>
                  {p.active ? 'Desativar' : 'Reativar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AuditTab() {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get('/admin/audit').then((r) => setRows(r.data)); }, []);

  return (
    <Card className="p-0 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-[0.14em] text-ink-400 border-b border-ink-100">
            <th className="text-left font-medium px-6 py-3">Quando</th>
            <th className="text-left font-medium px-6 py-3">Usuario</th>
            <th className="text-left font-medium px-6 py-3">Acao</th>
            <th className="text-left font-medium px-6 py-3">Entidade</th>
            <th className="text-left font-medium px-6 py-3">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-ink-100 last:border-0 align-top">
              <td className="px-6 py-3 text-ink-600 whitespace-nowrap">{new Date(r.created_at).toLocaleString('pt-BR')}</td>
              <td className="px-6 py-3">{r.user_name || '—'}<div className="text-xs text-ink-400">{r.user_email}</div></td>
              <td className="px-6 py-3"><Badge tone={r.action === 'delete' ? 'coral' : r.action === 'create' ? 'green' : 'violet'}>{r.action}</Badge></td>
              <td className="px-6 py-3">{r.entity} <span className="text-xs text-ink-400">#{r.entity_id || '-'}</span></td>
              <td className="px-6 py-3 font-mono text-[11px] text-ink-600 break-all max-w-md">{r.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
