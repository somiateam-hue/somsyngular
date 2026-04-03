import React, { useEffect, useState } from 'react';
import { subscribeMeetings, updateMeetingStatus } from '../../lib/firestoreDB';
import { Calendar, Clock, User, Mail, FileText, CheckCircle2, Clock as ClockPending, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: ClockPending },
  confirmed: { label: 'Confirmada', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle }
};

export default function MeetingsManager() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeMeetings(data => {
      setMeetings(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateMeetingStatus(id, status);
    } catch (error) {
      console.error("Error updating meeting:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent border-purple-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Agenda de Sesiones</h2>
          <p className="text-sm text-white/50 mt-1">Gestión de llamadas programadas mediante el widget nativo.</p>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
          <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No hay sesiones agendadas todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map(m => {
             const statusStyle = STATUS_CONFIG[m.status || 'pending'];
             const StatusIcon = statusStyle.icon;

             return (
              <div key={m.id} className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-5 hover:border-white/20 transition-colors">
                
                {/* Header: Date + Status */}
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white font-medium text-lg">
                         <Calendar size={18} className="text-purple-400" />
                         {new Date(m.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short'})}
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                         <Clock size={16} />
                         {m.time}
                      </div>
                   </div>
                   <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color}`}>
                      <StatusIcon size={12} />
                      {statusStyle.label}
                   </div>
                </div>

                {/* Body: User Info */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                         <User size={14} className="text-purple-400" />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-white">{m.name}</p>
                         <p className="text-xs text-white/50 break-all flex items-center gap-1"><Mail size={10}/> {m.email}</p>
                      </div>
                   </div>
                   
                   {m.details && (
                      <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5">
                         <p className="text-xs text-white/70 leading-relaxed flex items-start gap-2">
                            <FileText size={14} className="text-white/40 shrink-0 mt-0.5" />
                            "{m.details}"
                         </p>
                      </div>
                   )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                   <button 
                     onClick={() => handleStatusUpdate(m.id, 'confirmed')}
                     disabled={m.status === 'confirmed'}
                     className="flex-1 py-2 rounded-lg text-xs font-medium border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-30"
                   >
                      Confirmar
                   </button>
                   <button 
                     onClick={() => handleStatusUpdate(m.id, 'cancelled')}
                     disabled={m.status === 'cancelled'}
                     className="flex-1 py-2 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                   >
                      Cancelar
                   </button>
                </div>

              </div>
             );
          })}
        </div>
      )}
    </div>
  );
}
