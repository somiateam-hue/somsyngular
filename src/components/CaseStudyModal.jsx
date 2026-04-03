import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CaseStudyModal = ({ item, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center p-0 md:p-6 sm:p-4 overflow-y-auto"
         style={{ background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(8px)' }}>
      
      <div className="absolute inset-0 min-h-screen" onClick={onClose} />

      <div className="relative w-full max-w-3xl min-h-screen md:min-h-0 md:h-auto md:rounded-3xl shadow-2xl bg-[#11111b] border border-white/10 z-10 flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-md"
             style={{ background: 'rgba(17,17,27,0.9)' }}>
          <h3 className="font-display font-medium text-sm text-purple-400 tracking-widest uppercase truncate max-w-[80%]">
            CASO DE ÉXITO: {item.title}
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Image/Video */}
        <div className="w-full relative aspect-video bg-black/50">
           {(item.type === 'video' || item.type === 'reel') && item.src?.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
              <video src={item.src} className="w-full h-full object-cover" controls autoPlay muted />
           ) : (
              <img src={item.thumbnail || item.src} alt={item.title} className="w-full h-full object-cover" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-[#11111b] via-transparent to-transparent"></div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 space-y-6 flex-1 overflow-y-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">{item.title}</h2>
          
          <div className="prose prose-invert prose-purple max-w-none text-text-secondary leading-relaxed">
            <p className="text-lg md:text-xl font-medium text-white/80 mb-8 border-l-2 border-purple-500 pl-4">
              {item.desc || 'Optimización integral e implementación tecnológica avanzada para conseguir resultados reales.'}
            </p>
            
            <h3 className="text-xl font-display text-white mt-8 mb-4">El Desafío</h3>
            <p>
              El principal reto consistía en crear un sistema escalable capaz de automatizar las tareas repetitivas y mejorar 
              la experiencia de usuario. Las herramientas convencionales no ofrecían el nivel de personalización necesario, 
              resultando en pérdidas de tiempo y menor conversión.
            </p>

            <h3 className="text-xl font-display text-white mt-8 mb-4">La Solución</h3>
            <p>
              En SOM SYNGULAR implementamos un ecosistema digital apoyado por Inteligencia Artificial estructurado en 3 fases:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-white/70">
              <li><strong>Auditoría Tecnológica:</strong> Identificación de cuellos de botella.</li>
              <li><strong>Desarrollo a Medida:</strong> Creación de flujos de automatización y diseño corporativo.</li>
              <li><strong>Despliegue y Optimización:</strong> Puesta en producción y tests A/B en tiempo real.</li>
            </ul>

            <h3 className="text-xl font-display text-white mt-8 mb-4">Resultados</h3>
            <div className="grid grid-cols-2 gap-4 mt-6 mb-8 text-center">
               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <span className="block text-3xl font-display font-bold text-purple-400">+45%</span>
                  <span className="text-sm uppercase tracking-widest opacity-60">Eficiencia</span>
               </div>
               <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <span className="block text-3xl font-display font-bold text-gradient">-20h</span>
                  <span className="text-sm uppercase tracking-widest opacity-60">Manuales/sem</span>
               </div>
            </div>
            {/* If we had specific text from DB we would render it here, otherwise this serves as a solid templated fallback */}
            {item.articleText && (
               <div className="mt-8 pt-8 border-t border-white/10" dangerouslySetInnerHTML={{ __html: item.articleText }} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CaseStudyModal;
