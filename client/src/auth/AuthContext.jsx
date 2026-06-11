import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('xf_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // valida o token na carga (se houver)
    const token = localStorage.getItem('xf_token');
    if (token && !user) {
      api.get('/auth/me').then((r) => {
        setUser(r.data);
        localStorage.setItem('xf_user', JSON.stringify(r.data));
      }).catch(() => {});
    }
  }, []); // eslint-disable-line

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('xf_token', data.token);
      localStorage.setItem('xf_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function signup(payload) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', payload);
      localStorage.setItem('xf_token', data.token);
      localStorage.setItem('xf_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('xf_token');
    localStorage.removeItem('xf_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
