import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: 'Diagnóstico IA',
    desc: 'Analizamos procesos, datos y oportunidades de automatización en tu flujo de trabajo actual.',
    color: 'from-primary/20 to-transparent',
    icon: (
      <svg className="w-32 h-32 text-primary animate-pulse" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" className="animate-[spin_10s_linear_infinite]" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 2" className="animate-[spin_15s_linear_infinite_reverse]" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'Arquitectura Inteligente',
    desc: 'Diseñamos el sistema de automatización, IA y APIs personalizadas para tu modelo de negocio.',
    color: 'from-accent-neon/20 to-transparent',
    icon: (
      <svg className="w-32 h-32 text-accent-neon" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" className="animate-[translate-y_2s_ease-in-out_infinite]" />
        <path d="M10 50 Q 30 10, 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    )
  },
  {
    title: 'Implementación y Escalado',
    desc: 'Desplegamos el sistema y lo optimizamos continuamente basándonos en datos reales de rendimiento.',
    color: 'from-blue-500/20 to-transparent',
    icon: (
      <svg className="w-32 h-32 text-blue-400" viewBox="0 0 100 100">
        <path d="M10 80 L 30 40 L 50 60 L 70 20 L 90 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="90" cy="50" r="4" fill="currentColor" className="animate-ping" />
      </svg>
    )
  }
];

const Proceso = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logic for sticky stacking is mostly CSS sticky + heights, 
      // but we add fade-out/scale effects with ScrollTrigger
      const cards = gsap.utils.toArray('.sticky-card');
      // hint browser to GPU-composite before animations start
      cards.forEach(card => gsap.set(card, { willChange: 'transform, opacity' }));
      cards.forEach((card, i) => {
        if (i !== cards.length - 1) {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,          // scrub:1 = 1s de suavizado, menos CPU que scrub:true
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="proceso" ref={containerRef} className="px-6 py-24 bg-background-secondary rounded-t-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 data-clip className="text-4xl md:text-5xl font-display font-bold mb-4">Nuestro Proceso</h2>
          <p className="text-text-secondary">De la consultoría a la ejecución de alto nivel.</p>
        </div>

        <div className="relative space-y-[10vh]">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="sticky-card sticky top-24 h-[60vh] md:h-[50vh] glass rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} -z-10 opacity-30`}></div>
              
              <div className="flex-1 space-y-6">
                <div className="text-primary font-mono text-xl">0{i + 1}</div>
                <h3 className="text-3xl md:text-4xl font-display font-bold">{step.title}</h3>
                <p className="text-text-secondary text-lg leading-relaxed">{step.desc}</p>
              </div>
              
              <div className="w-full md:w-auto flex justify-center">
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proceso;
