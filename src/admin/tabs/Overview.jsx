import React, { useMemo } from 'react';
import { useLocalStore } from '../../hooks/useLocalStore';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="rounded-2xl p-6 flex items-start gap-4"
      style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${color}18` }}>
        {icon}
      </div>
      <div>
        <p className="text-sm" style={{ color: 'rgba(245,245,255,0.5)' }}>{label}</p>
        <p className="text-3xl font-display font-bold text-white mt-1">{value}</p>
        {sub && <p className="text-xs mt-1" style={{ color: 'rgba(245,245,255,0.4)' }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function Overview() {
  const [leads] = useLocalStore('syngular_leads', []);
  const [chatSessions] = useLocalStore('syngular_chats', []);

  const totalMessages = useMemo(() =>
    chatSessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0),
    [chatSessions]);

  const lastLead = leads[leads.length - 1];
  const lastLeadDate = lastLead
    ? new Date(lastLead.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';

  // Activity: last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    return {
      label: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      leads: leads.filter(l => new Date(l.timestamp).toDateString() === dateStr).length,
      chats: chatSessions.filter(s => new Date(s.startTime).toDateString() === dateStr).length,
    };
  });

  const maxVal = Math.max(1, ...days.map(d => d.leads + d.chats));

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="📋" label="Total Leads" value={leads.length} sub="Formularios enviados" color="#A855F7" />
        <StatCard icon="💬" label="Sesiones de Chat" value={chatSessions.length} sub="Conversaciones únicas" color="#6C3BFF" />
        <StatCard icon="✉️" label="Mensajes Totales" value={totalMessages} sub="En todas las sesiones" color="#34d399" />
        <StatCard icon="🕐" label="Último Contacto" value={lastLeadDate} color="#f59e0b" />
      </div>

      {/* Activity chart */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>
        <h2 className="font-display font-bold text-white mb-6">Actividad — Últimos 7 días</h2>
        <div className="flex items-end gap-4 h-40">
          {days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: 120 }}>
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${((d.leads / maxVal) * 100)}%`,
                    background: 'linear-gradient(to top,#6C3BFF,#A855F7)',
                    minHeight: d.leads > 0 ? 4 : 0,
                  }}
                />
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${((d.chats / maxVal) * 100)}%`,
                    background: 'rgba(52,211,153,0.5)',
                    minHeight: d.chats > 0 ? 4 : 0,
                    borderRadius: d.leads > 0 ? '0' : '4px 4px 0 0',
                  }}
                />
              </div>
              <span className="text-xs capitalize" style={{ color: 'rgba(245,245,255,0.4)' }}>{d.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-4">
          <span className="flex items-center gap-2 text-xs" style={{ color: 'rgba(245,245,255,0.5)' }}>
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#A855F7' }} /> Leads
          </span>
          <span className="flex items-center gap-2 text-xs" style={{ color: 'rgba(245,245,255,0.5)' }}>
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'rgba(52,211,153,0.5)' }} /> Chats
          </span>
        </div>
      </div>

      {/* Recent leads */}
      {leads.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>
          <h2 className="font-display font-bold text-white mb-4">Últimos Leads</h2>
          <div className="space-y-3">
            {[...leads].reverse().slice(0, 5).map((lead, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div>
                  <p className="text-sm font-medium text-white">{lead.nombre}</p>
                  <p className="text-xs" style={{ color: 'rgba(245,245,255,0.4)' }}>{lead.email}</p>
                </div>
                <p className="text-xs" style={{ color: 'rgba(245,245,255,0.35)' }}>
                  {new Date(lead.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
