import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from './Logo.jsx';
import {
  LayoutDashboard, Users, FileBarChart2, Settings, LogOut, ShieldCheck,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Visao geral', icon: LayoutDashboard },
  { to: '/pacientes', label: 'Pacientes', icon: Users },
  { to: '/relatorios', label: 'Relatorios', icon: FileBarChart2 },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white/70 backdrop-blur border-r border-ink-100 flex flex-col">
        <div className="p-6">
          <Link to="/dashboard"><Logo /></Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors ${
                  isActive
                    ? 'bg-violet2-600 text-white shadow-soft'
                    : 'text-ink-600 hover:bg-ink-100/60'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors ${
                  isActive
                    ? 'bg-violet2-600 text-white shadow-soft'
                    : 'text-ink-600 hover:bg-ink-100/60'
                }`
              }
            >
              <ShieldCheck size={18} />
              Administracao
            </NavLink>
          )}
        </nav>

        <div className="p-3 border-t border-ink-100 m-3 mt-0 rounded-2xl bg-cream-100/60">
          <div className="px-2 py-2">
            <div className="text-sm font-medium leading-tight">{user?.name}</div>
            <div className="text-xs text-ink-400 capitalize">{user?.profession || user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-sm text-ink-600 hover:text-ink-900 px-2 py-1.5 rounded-xl hover:bg-white"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-10 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
