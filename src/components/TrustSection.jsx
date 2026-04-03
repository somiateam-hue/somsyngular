import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Lock, Zap, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Datos protegidos',
    desc: 'Cumplimiento RGPD. Tus datos nunca se comparten con terceros ni se usan para entrenar modelos externos.',
    color: '#A855F7',
  },
  {
    icon: Lock,
    title: 'Cifrado extremo a extremo',
    desc: 'Todas las integraciones y webhooks corren bajo HTTPS con cifrado AES-256 en reposo y en tránsito.',
    color: '#6C3BFF',
  },
  {
    icon: Zap,
    title: '99.9 % de disponibilidad',
    desc: 'Infraestructura cloud con redundancia automática. Sin mantenimientos en horario de negocio.',
    color: '#A855F7',
  },
  {
    icon: Clock,
    title: 'Soporte en menos de 24 h',
    desc: 'Equipo técnico dedicado. Respuesta garantizada en menos de un día hábil para cualquier incidencia.',
    color: '#6C3BFF',
  },
];

const LOGOS = [
  { text: 'TURNITO',     className: 'font-display font-black tracking-tight text-white/80' },
  { text: 'DentistiQ',   className: 'font-serif font-black italic text-purple-400' },
  { text: 'tallerPRO',   className: 'font-display font-black text-white/70' },
  { text: 'IMANEVOLUTION', className: 'font-sans font-extrabold tracking-tighter text-white/80', highlight: 'EVOLUTION' },
  { text: 'PHIWALLET',   className: 'font-mono font-bold text-white/60' },
];

function LogoItem({ logo }) {
  if (logo.highlight) {
    const parts = logo.text.split(logo.highlight);
    return (
      <span className={`text-3xl md:text-4xl ${logo.className} flex-shrink-0`}>
        {parts[0]}<span style={{ color: '#A855F7' }}>{logo.highlight}</span>{parts[1]}
      </span>
    );
  }
  return (
    <span className={`text-3xl md:text-4xl ${logo.className} flex-shrink-0`}>
      {logo.text}
    </span>
  );
}

const TrustSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.trust-card', {
        y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-background-secondary">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-accent-neon font-mono text-xs tracking-widest uppercase">Seguridad y confianza</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold">Construido para empresas serias</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Implementamos los mismos estándares de seguridad que usan las empresas Fortune 500, sin importar el tamaño de tu negocio.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="trust-card glass rounded-[2rem] p-8 space-y-4 border border-white/10 hover:border-accent-neon/30 transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${p.color}20`, border: `1px solid ${p.color}30` }}
                >
                  <Icon size={22} style={{ color: p.color }} />
                </div>
                <h3 className="text-lg font-display font-bold">{p.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stats bar */}
        <div className="glass rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '+120', label: 'Empresas activas' },
            { value: '99.9%', label: 'Uptime garantizado' },
            { value: '<24h', label: 'Tiempo de respuesta' },
            { value: '100%', label: 'RGPD compliant' },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-text-secondary uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Client Logos Marquee — infinite loop */}
        <div className="space-y-4">
          <p className="text-sm text-text-secondary uppercase tracking-widest text-center font-medium">
            Marcas que confían en nuestros sistemas
          </p>

          <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex gap-16 marquee-track">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <LogoItem key={i} logo={logo} />
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .marquee-track {
          width: max-content;
          animation: marquee-scroll 24s linear infinite;
          align-items: center;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default TrustSection;
