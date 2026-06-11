// Cadastro publico de profissional. Conforme Ina:
// nao sao so medicos — pedagogos, fonoaudiologos, psicologos etc podem se cadastrar.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { Input, Select } from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Logo from '../components/Logo.jsx';

const PROFISSOES = [
  { value: 'medico', label: 'Médico(a) - Clínico Geral' },
  { value: 'pediatra', label: 'Pediatra' },
  { value: 'geneticista', label: 'Geneticista' },
  { value: 'neurologista', label: 'Neurologista' },
  { value: 'pedagogo', label: 'Pedagoga(o)' },
  { value: 'psicologo', label: 'Psicóloga(o)' },
  { value: 'psicopedagogo', label: 'Psicopedagogo(a)' },
  { value: 'fonoaudiologo', label: 'Fonoaudiologa(o)' },
  { value: 'terapeuta_ocupacional', label: 'Terapeuta ocupacional' },
  { value: 'fisioterapeuta', label: 'Fisioterapeuta' },
  { value: 'enfermeiro', label: 'Enfermeira(o)' },
  { value: 'assistente_social', label: 'Assistente social' },
  { value: 'voluntario_ong', label: 'Voluntario(a) da ONG' },
  { value: 'outro', label: 'Outro' },
];

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    profession: 'medico',
    license_type: '', license_number: '',
    phone: '', organization: '',
  });
  const [error, setError] = useState('');

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.2fr]">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-900 text-white">
        <Link to="/"><Logo /></Link>
        <div>
          <h2 className="font-display text-5xl leading-tight tracking-tight">
            Triagem incial feita<br/>por quem convive<br/>com o paciente.
          </h2>
          <p className="text-white/70 mt-6 max-w-md">
            Pedagogos, fonoaudiologos, psicólogos — qualquer profissional vinculado pode cadastrar pacientes
            e responder o score. Quanto mais pessoas observando, mais precisa fica a triagem.
          </p>
        </div>
        <div className="text-xs text-white/50">
          Cadastro sujeito a aprovação da ONG para uso clínico.
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-cream-50">
        <form onSubmit={onSubmit} className="w-full max-w-lg">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="font-display text-4xl tracking-tight">Criar conta profissional</h1>
          <p className="text-ink-400 text-sm mt-2">Preencha seus dados — você poderá começar a triagem em seguida.</p>

          <div className="mt-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nome completo" required value={form.name} onChange={(e) => update('name', e.target.value)} />
              <Input label="Email profissional" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Senha" type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} hint="Minimo 6 caracteres" />
              <Input label="Telefone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(00) 00000-0000" />
            </div>

            <Select label="Área de atuação" options={PROFISSOES} value={form.profession} onChange={(e) => update('profession', e.target.value)} />

            <div className="grid sm:grid-cols-[1fr_1.5fr] gap-4">
              <Input label="Registro" placeholder="CRM, CRP, ..." value={form.license_type} onChange={(e) => update('license_type', e.target.value)} />
              <Input label="Numero do registro" value={form.license_number} onChange={(e) => update('license_number', e.target.value)} />
            </div>

            <Input label="Clínica, escola ou ONG" value={form.organization} onChange={(e) => update('organization', e.target.value)} />

            {error && <div className="text-sm text-coral-600 bg-coral-50 border border-coral-100 rounded-xl px-3 py-2">{error}</div>}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Criar conta
            </Button>
          </div>

          <p className="text-sm text-ink-400 mt-6 text-center">
            Ja tem conta? <Link to="/login" className="text-violet2-700 font-medium">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
