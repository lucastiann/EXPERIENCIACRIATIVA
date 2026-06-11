// Landing page publica. O coracao visual da plataforma.
// O hero exibe o logo do Instituto Buko Kaesemodel.

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Microscope, FileSearch, Users2, ShieldCheck, ImagePlus, Network } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: 'easeOut' },
};

const steps = [
  { icon: Users2, title: 'Cadastre o paciente', body: 'Busca por CPF, dados básicos, responsável atual. Funciona para novos pacientes ou acompanhamentos.' },
  { icon: FileSearch, title: 'Responda o score', body: 'Marque sintomas observados. O cálculo já pondera pelo gênero e mostra o resultado na hora.' },
  { icon: ImagePlus, title: 'Anexe fotos e videos', body: 'Hiperelasticidade nos dedos, face, comportamento — evidencias visuais para a ONG.' },
  { icon: Network, title: 'Rastreamento genético da familia', body: 'Quando o teste confirma, a mutacao corre pela linha materna ou paterna. Voce mapeia.' },
  { icon: Microscope, title: 'Encaminhe com critérios', body: 'O teste genetico custa caro. A plataforma ajuda a ONG a acolher quem mais precisa.' },
  { icon: ShieldCheck, title: 'Tudo auditado!', body: 'Senhas com hash, log de alterações, controle por perfil. Sigilo dos dados em primeiro lugar.' },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo />
        <nav className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard" className="text-sm font-medium text-ink-600 hover:text-ink-900 px-3 py-2 rounded-xl">
              Ir para o painel <ArrowRight className="inline w-4 h-4 ml-0.5" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900 px-3 py-2 rounded-xl">
                Entrar
              </Link>
              <Link to="/cadastro" className="text-sm font-medium bg-blue-600 text-white hover:lightblue2-700 px-4 py-2 rounded-2xl shadow-soft">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 pt-10 pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-blue2-700 bg-white-100 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue2-500" />
            Triagem para Síndrome do X Frágil
          </div>

          <h1 className="mt-6 font-display text-[3.5rem] sm:text-[4.5rem] leading-[0.98] tracking-tight">
            A triagem<br/>
            que <span className="italic text-blue-700">organiza</span> o<br/>
            caminho até o<br/>
            <span className="italic text-blue-500">teste genético</span>.
          </h1>

          <p className="mt-7 text-ink-600 text-lg leading-relaxed max-w-xl">
            Uma plataforma colaborativa do Instituto Buko Kaesemodel para médicas, pedagogas, psicólogos e profissionais de saúde 
            a avaliarem características clínicas, analisar fotos e vídeos de pacientes,
            e decidirem juntos o melhor momento de encaminhar para o teste genético confirmatório.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/cadastro')}
              className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3.5 rounded-2xl font-medium hover:bg-2-700 transition-colors shadow-soft"
            >
              {user ? 'Abrir o painel' : 'Quero me cadastrar agora'}
              <ArrowRight size={18} />
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-medium border border-ink-100 hover:bg-white"
            >
              Já tenho conta!
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-ink-400">
            <span>Open source · GitHub</span>
            <span>·</span>
            <span>Para uso de profissionais autorizados</span>
          </div>
        </motion.div>

        {/* Logo do Instituto Buko Kaesemodel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-to-br from-sky-200/40 to-blue-200/30 rounded-[2.5rem] blur-3xl" />
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-white" style={{ aspectRatio: '1192 / 851' }}>
            <img
              src="/buko-kaesemodel.jpg"
              alt="Instituto Buko Kaesemodel"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-[11px] text-ink-400 mt-3 text-center">
            Instituto Buko Kaesemodel
          </div>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <motion.div {...fade} className="mb-12 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.18em] text--400 mb-3">Como funciona</div>
          <h2 className="font-display text-5xl tracking-tight">Um fluxo claro, da suspeita ao encaminhamento.</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.05 }}
              className="surface p-7 hover:shadow-glow hover:border-blue-200 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-blue2-100 text-blue-700 flex items-center justify-center">
                <s.icon size={20} />
              </div>
              <h3 className="font-display text-2xl tracking-tight mt-4">{s.title}</h3>
              <p className="text-ink-400 text-sm mt-2 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About the syndrome */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <motion.div {...fade} className="surface bg-gradient-to-br from-blue-700 to-ink-900 text-white border-violet2-700 px-10 py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-violet2-200 mb-3">Sobre a sindrome</div>
            <h2 className="font-display text-4xl tracking-tight leading-tight">
              Estudos indicam ser a causa hereditária mais comum de deficiência intelectual e muitas vezes pode estar associada com o autismo.
            </h2>
            <p className="text-white/70 mt-5 leading-relaxed">
              É causada por uma mutação em um gene (FMR1) que inibe ou reduz a produção de uma 
              proteína (FMRP) essencial para o desenvolvimento 
              do sistema nervoso e de várias funções cerebrais.
              A Síndrome do X Frágil é uma condição genética ainda pouco conhecida e difundida, 
              que afeta o desenvolvimento intelectual, o comportamento e provoca atrasos na fala.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat number="1 em 4 mil" label="meninos afetados" />
            <Stat number="1 em 8 mil" label="meninas afetadas" />
            <Stat number="~50%" label="dos casos são confundidos com autismo" />
            <Stat number="R$ 1000+" label="custo médio do teste genético" />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 mt-10">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <span className="text-xs text-ink-400 ml-3">Construído com cuidado para o Instituto Buko Kaesemodel</span>
          </div>
          <div className="text-xs text-ink-400">
            Os dados desta plataforma são sensíveis. Acesso restrito a profissionais autorizados.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="font-display text-3xl tracking-tight">{number}</div>
      <div className="text-xs text-white/55 mt-1">{label}</div>
    </div>
  );
}
