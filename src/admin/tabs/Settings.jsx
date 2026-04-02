import React, { useState } from 'react';

const STORAGE_KEY_USER = 'syngular_admin_user';
const STORAGE_KEY_PASS = 'syngular_admin_pass';

const DEFAULT_USER = import.meta.env.VITE_ADMIN_USER || 'admin';
const DEFAULT_PASS = import.meta.env.VITE_ADMIN_PASS || 'Syngular2025!';

export default function Settings() {
  const currentUser = localStorage.getItem(STORAGE_KEY_USER) || DEFAULT_USER;
  const [form, setForm] = useState({ user: currentUser, pass: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    if (!form.user.trim()) { setError('El usuario no puede estar vacío.'); return; }
    if (form.pass && form.pass !== form.confirm) { setError('Las contraseñas no coinciden.'); return; }
    localStorage.setItem(STORAGE_KEY_USER, form.user.trim());
    if (form.pass) localStorage.setItem(STORAGE_KEY_PASS, form.pass);
    setSaved(true);
    setForm(f => ({ ...f, pass: '', confirm: '' }));
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearData = (key, label) => {
    if (window.confirm(`¿Seguro que quieres borrar todos los ${label}? Esta acción no se puede deshacer.`)) {
      localStorage.removeItem(key);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-lg space-y-8">
      {/* Credentials */}
      <div className="rounded-2xl p-6 space-y-5"
        style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>
        <h2 className="font-display font-bold text-white">🔐 Credenciales de Acceso</h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: 'rgba(245,245,255,0.7)' }}>Usuario</label>
          <input
            type="text"
            value={form.user}
            onChange={e => setForm(f => ({ ...f, user: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: 'rgba(245,245,255,0.7)' }}>
            Nueva contraseña <span style={{ color: 'rgba(245,245,255,0.35)' }}>(dejar vacío para no cambiar)</span>
          </label>
          <input
            type="password"
            value={form.pass}
            onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: 'rgba(245,245,255,0.7)' }}>Confirmar nueva contraseña</label>
          <input
            type="password"
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
          />
        </div>

        {error && <p className="text-sm text-red-400">⚠️ {error}</p>}

        <button onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: saved ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
          {saved ? '✓ Credenciales guardadas' : 'Guardar cambios'}
        </button>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl p-6 space-y-4"
        style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <h2 className="font-display font-bold text-red-400">⚠️ Zona de Peligro</h2>
        <p className="text-sm" style={{ color: 'rgba(245,245,255,0.5)' }}>
          Estas acciones son irreversibles. Úsalas con cuidado.
        </p>
        <div className="space-y-2">
          <button onClick={() => handleClearData('syngular_leads', 'leads')}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-red-300 text-left hover:bg-red-500/10 transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            🗑️ Borrar todos los leads
          </button>
          <button onClick={() => handleClearData('syngular_chats', 'chats')}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-red-300 text-left hover:bg-red-500/10 transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            🗑️ Borrar historial de chats
          </button>
          <button onClick={() => handleClearData('syngular_content', 'contenido editado')}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-red-300 text-left hover:bg-red-500/10 transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            🔄 Restablecer todo el contenido al original
          </button>
        </div>
      </div>
    </div>
  );
}
