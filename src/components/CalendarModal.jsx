import React, { useEffect, useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { addMeeting } from '../lib/firestoreDB';

const AVAILABLE_TIMES = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

const CalendarModal = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form on open
      setStatus('idle');
      setSelectedDate('');
      setSelectedTime('');
      setFormData({ name: '', email: '', details: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) return;
    
    setStatus('loading');
    try {
      await addMeeting({
        date: selectedDate,
        time: selectedTime,
        name: formData.name,
        email: formData.email,
        details: formData.details
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  // Get tomorrow as min date
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
         style={{ background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
           style={{ background: '#11111b', border: '1px solid rgba(168,85,247,0.2)' }}>
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5"
             style={{ background: 'linear-gradient(135deg,rgba(108,59,255,0.1),rgba(168,85,247,0.05))' }}>
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Agenda tu sesión de consultoría
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
          {status === 'success' ? (
             <div className="text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div>
                   <h3 className="text-2xl font-display font-bold text-white">¡Sesión Agendada!</h3>
                   <p className="text-white/60 mt-2">Hemos contactado contigo en el correo para confirmar los detalles.</p>
                </div>
                <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium">Volver a la web</button>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Date & Time Selection */}
              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center gap-2">1. Selecciona Fecha y Hora</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Input */}
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="date"
                      required
                      min={minDateStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A24] border border-purple-500/30 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 transition-shadow [color-scheme:dark]"
                    />
                  </div>
                  {/* Time Grid (only show if date selected) */}
                  {selectedDate ? (
                     <div className="grid grid-cols-3 gap-2">
                        {AVAILABLE_TIMES.map(time => (
                           <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-1 text-sm rounded-lg transition-all border ${
                                 selectedTime === time 
                                 ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                                 : 'bg-[#1A1A24] border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                              }`}
                           >
                              {time}
                           </button>
                        ))}
                     </div>
                  ) : (
                     <div className="flex items-center justify-center p-4 border border-dashed border-white/10 rounded-xl text-white/30 text-sm">
                        Selecciona un día primero
                     </div>
                  )}
                </div>
              </div>

              {/* Form Info */}
              <div className={`space-y-4 transition-opacity duration-300 ${(!selectedDate || !selectedTime) ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <h4 className="text-white font-medium">2. Tus Datos</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Nombre completo" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} className="w-full px-4 py-3 bg-[#1A1A24] border border-purple-500/30 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500" />
                    <input required type="email" placeholder="Correo de cuenta de Google (a ser posible)" value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))} className="w-full px-4 py-3 bg-[#1A1A24] border border-purple-500/30 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <textarea rows={3} placeholder="¿De qué quieres hablar en la sesión? (Opcional)" value={formData.details} onChange={e => setFormData(f => ({...f, details: e.target.value}))} className="w-full px-4 py-3 bg-[#1A1A24] border border-purple-500/30 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>
              </div>

               {status === 'error' && <p className="text-red-400 text-sm text-center">Ocurrió un error. Inténtalo de nuevo.</p>}

              <button 
                type="submit" 
                disabled={!selectedDate || !selectedTime || !formData.name || !formData.email || status === 'loading'}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white hover:scale-[1.02] active:scale-95"
                style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)', boxShadow: '0 0 40px rgba(108,59,255,0.2)' }}
              >
                {status === 'loading' ? <><Loader2 className="w-5 h-5 animate-spin"/> Procesando...</> : 'Confirmar Reserva'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
