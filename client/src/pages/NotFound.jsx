import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <div className="font-display text-9xl tracking-tight">404</div>
        <p className="text-ink-400 mt-3">Esta página não existe.</p>
        <Link to="/" className="inline-block mt-6 text-violet2-700 font-medium hover:underline">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
