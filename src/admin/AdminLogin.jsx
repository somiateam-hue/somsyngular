import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [form, setForm]       = useState({ email: '', pass: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.pass,
    });
    if (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0B0B12' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-2xl font-display font-bold mb-2">
            SOM <span style={{ color: '#A855F7' }}>SYNGULAR</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(245,245,255,0.4)' }}>Panel de Administración</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 space-y-6"
          style={{
            background: 'rgba(17,17,27,0.8)',
            border: '1px solid rgba(168,85,247,0.2)',
            backdropFilter: 'blur(12px)',
          }}>
          <div>
            <h1 className="text-xl font-bold font-display text-white">Acceso al Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(245,245,255,0.5)' }}>Solo personal autorizado.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: 'rgba(245,245,255,0.7)' }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@somsyngular.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: 'rgba(245,245,255,0.7)' }}>
                Contraseña
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={form.pass}
                onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
              />
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm text-red-300"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : 'Entrar al Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(245,245,255,0.2)' }}>
          © {new Date().getFullYear()} SOM SYNGULAR — Acceso restringido
        </p>
      </div>
    </div>
  );
}
