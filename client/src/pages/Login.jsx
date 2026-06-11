import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { Input } from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao entrar');
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-700 to-ink-900 text-white">
        <Link to="/"><Logo /></Link>
        <div>
          <h2 className="font-display text-5xl leading-tight tracking-tight">
            Triagem,<br/>score,<br/>encaminhamento.
          </h2>
          <p className="text-white/60 mt-6 max-w-md">
            Entre para registrar uma nova avaliaçao, anexar evidências e acompanhar a jornada do paciente
            até o teste genético.
          </p>
        </div>
        <div className="text-xs text-white/40">
          Instituto Buko Kaesemodel · Plataforma multiprofissional
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-cream-50">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="font-display text-4xl tracking-tight">Entrar</h1>
          <p className="text-ink-400 text-sm mt-2">Use suas credenciais profissionais.</p>

          <div className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@clinica.org"
              required
            />
            <Input
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="text-sm text-blue-600 bg-vle-50 border border-blue-100 rounded-xl px-3 py-2">{error}</div>}

            <Button type="submit" loading={loading} className="w-full">
              Entrar
            </Button>
          </div>

          <p className="text-sm text-ink-400 mt-6 text-center">
            Ainda nao tem conta? <Link to="/cadastro" className="text-violet2-700 font-medium">Cadastre-se</Link>
          </p>

          <div className="mt-10 p-4 rounded-2xl bg-violet2-50 border border-violet2-100 text-xs text-violet2-700">
            <strong>Para testar:</strong>
            <div>admin@xfragil.local / admin123  (admin)</div>
            <div>ina@xfragil.local / ina123  (profissional)</div>
          </div>
        </form>
      </div>
    </div>
  );
}
