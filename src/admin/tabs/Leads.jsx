import React, { useState, useMemo, useEffect } from 'react';
import { subscribeLeads, toggleLeadDone, deleteLead } from '../../lib/firestoreDB';

export default function Leads() {
  const [leads,  setLeads]  = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const unsub = subscribeLeads(setLeads);
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    return [...leads]
      .reverse()
      .filter(l => {
        const q = search.toLowerCase();
        const matchSearch = !q || l.nombre?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.empresa?.toLowerCase().includes(q);
        const matchFilter = filter === 'all' || (filter === 'done' ? l.done : !l.done);
        return matchSearch && matchFilter;
      });
  }, [leads, search, filter]);

  const handleToggleDone = (id, current) => toggleLeadDone(id, current);
  const handleDelete     = (id)           => deleteLead(id);

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(email);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o empresa..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
        />
        <div className="flex gap-2">
          {['all', 'pending', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                border: filter === f ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: filter === f ? '#A855F7' : 'rgba(245,245,255,0.5)',
              }}>
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : 'Atendidos'}
            </button>
          ))}
        </div>
      </div>

      {/* Badge count */}
      <p className="text-sm" style={{ color: 'rgba(245,245,255,0.4)' }}>
        {filtered.length} lead{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.1)' }}>
          <p className="text-4xl mb-3">📭</p>
          <p className="text-white font-medium">No hay leads todavía</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(245,245,255,0.4)' }}>
            Cuando alguien rellene el formulario de contacto, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id}
              className="rounded-2xl p-5 transition-all duration-200"
              style={{
                background: lead.done ? 'rgba(17,17,27,0.5)' : 'rgba(17,17,27,0.8)',
                border: lead.done ? '1px solid rgba(52,211,153,0.15)' : '1px solid rgba(168,85,247,0.15)',
                opacity: lead.done ? 0.7 : 1,
              }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white">{lead.nombre}</h3>
                    {lead.empresa && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(108,59,255,0.2)', color: '#A855F7' }}>
                        {lead.empresa}
                      </span>
                    )}
                    {lead.done && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                        ✓ Atendido
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(245,245,255,0.6)' }}>{lead.email}</p>
                  {lead.proceso && (
                    <p className="text-sm mt-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,245,255,0.7)' }}>
                      💡 {lead.proceso}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: 'rgba(245,245,255,0.3)' }}>
                    {lead.timestamp ? new Date(lead.timestamp).toLocaleString('es-ES') : ''}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => copyEmail(lead.email)} title="Copiar email"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 text-sm"
                    style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}>
                    {copied === lead.email ? '✅' : '📋'}
                  </button>
                  <button onClick={() => handleToggleDone(lead.id, lead.done)} title={lead.done ? 'Marcar pendiente' : 'Marcar atendido'}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 text-sm"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                    {lead.done ? '↩️' : '✓'}
                  </button>
                  <button onClick={() => handleDelete(lead.id)} title="Eliminar"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 text-sm"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
