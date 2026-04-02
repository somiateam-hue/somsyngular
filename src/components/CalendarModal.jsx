import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CalendarModal = ({ isOpen, onClose, calendlyUrl = "https://calendly.com/" }) => {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
         style={{ background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(8px)' }}>
      
      {/* Backdrop click listener */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
           style={{ background: '#11111b', border: '1px solid rgba(168,85,247,0.2)' }}>
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5"
             style={{ background: 'linear-gradient(135deg,rgba(108,59,255,0.1),rgba(168,85,247,0.05))' }}>
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Agenda tu llamada
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Calendly iFrame */}
        <div className="flex-1 w-full bg-white relative">
          {/* Un loader detrás del iframe por si tarda */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#11111b]">
            <div className="w-8 h-8 border-2 border-t-transparent border-purple-500 rounded-full animate-spin" />
          </div>
          
          <iframe
            src={calendlyUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            className="relative z-10"
            title="Calendly Scheduling Page"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
