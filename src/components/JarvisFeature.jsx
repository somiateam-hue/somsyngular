import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Mail, FileText, CheckCircle2, Mic } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MESSAGES = [
  { from: 'user', text: '¿Qué tengo hoy en la agenda?' },
  { from: 'jarvis', text: 'Tienes 3 reuniones: 10:00 con el equipo de diseño, 12:30 llamada con el cliente y 16:00 revisión de presupuesto.' },
  { from: 'user', text: 'Responde los emails de prioridad media' },
  { from: 'jarvis', text: 'Listo ✅ He respondido 14 emails. También subí el informe financiero a Drive. ¿Algo más, jefe?' },
];

function WhatsAppMockup() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= MESSAGES.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 900 + visible * 200);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="w-full h-full flex flex-col" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* WA Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
           style={{ background: 'rgba(37,211,102,0.08)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
             style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
          J
        </div>
        <div>
          <p className="text-sm font-bold text-white">Jarvis · SOM SYNGULAR</p>
          <p className="text-xs flex items-center gap-1" style={{ color: '#25d366' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            en línea
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden px-4 py-4 space-y-3"
           style={{ background: 'rgba(0,0,0,0.3)' }}>
        {MESSAGES.slice(0, visible).map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div
              className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
              style={msg.from === 'user'
                ? { background: 'linear-gradient(135deg,#6C3BFF,#A855F7)', color: '#fff', borderBottomRightRadius: 4 }
                : { background: 'rgba(255,255,255,0.1)', color: '#F5F5FF', borderBottomLeftRadius: 4 }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {visible < MESSAGES.length && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 }}>
              <div className="flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"
                    style={{ animation: `bounce 1s ease-in-out ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10">
        <div className="flex-1 px-4 py-2 rounded-full text-xs text-white/30"
             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Escribe un mensaje...
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
          <Mic size={14} className="text-white" />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

const JarvisFeature = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.jarvis-elem', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent-neon rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* Left: Phone Mockup */}
        <div className="jarvis-elem flex justify-center lg:justify-start">
          <div className="relative" style={{ width: 300 }}>
            {/* Glow */}
            <div className="absolute -inset-8 rounded-[3rem] blur-2xl opacity-30"
                 style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }} />

            {/* Phone frame */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/15"
                 style={{ background: '#0d0d17', height: 560 }}>

              {/* Status bar */}
              <div className="flex justify-between items-center px-6 pt-4 pb-2 text-[10px] text-white/40 font-mono">
                <span>9:41</span>
                <div className="w-24 h-5 rounded-full bg-black absolute top-0 left-1/2 -translate-x-1/2" />
                <span>●●●</span>
              </div>

              {/* WhatsApp chat */}
              <div style={{ height: 'calc(100% - 28px)' }}>
                <WhatsAppMockup />
              </div>

              {/* Notch indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/20" />
            </div>

            {/* Floating badges */}
            <div className="absolute -right-8 top-12 bg-[#11111b] border border-purple-500/30 rounded-2xl px-4 py-2 shadow-xl animate-[float_3s_ease-in-out_infinite]">
              <p className="text-xs font-bold text-white">+14 emails</p>
              <p className="text-[10px] text-green-400">respondidos ✓</p>
            </div>
            <div className="absolute -left-8 bottom-20 bg-[#11111b] border border-purple-500/30 rounded-2xl px-4 py-2 shadow-xl animate-[float_3s_ease-in-out_0.5s_infinite]">
              <p className="text-xs font-bold text-white">3 reuniones</p>
              <p className="text-[10px] text-purple-400">organizadas ✓</p>
            </div>
          </div>
        </div>

        {/* Right: Copy */}
        <div className="space-y-8">
          <div className="space-y-4 jarvis-elem">
            <p className="text-accent-neon font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-accent-neon rounded-full" />
              Exclusivo para CEOs
            </p>
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              Tu asistente personal en <span className="text-gradient">WhatsApp</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Conoce a <strong>Jarvis</strong>. Integrado directamente en tu WhatsApp y conectado con todo tu entorno de Google Workspace. Olvídate de abrir el calendario corporativo o redactar emails repetitivos.
            </p>
          </div>

          <div className="space-y-5 jarvis-elem">
            {[
              { icon: Calendar, text: 'Gestión inteligente de Google Calendar por notas de voz.' },
              { icon: Mail, text: 'Clasificación y respuesta autónoma de emails importantes.' },
              { icon: FileText, text: 'Lectura y resumen automático de Google Docs y PDFs.' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <feature.icon size={20} />
                </div>
                <p className="font-medium text-white/80">{feature.text}</p>
              </div>
            ))}
          </div>

          <div className="jarvis-elem pt-6">
            <button
              data-magnetic="0.2"
              onClick={() => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:bg-purple-100 hover:scale-105 active:scale-95"
            >
              Quiero a Jarvis <CheckCircle2 size={16} className="text-green-500" />
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default JarvisFeature;
