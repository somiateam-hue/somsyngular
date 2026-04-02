import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Slack, CreditCard, MessageSquare, Cpu, BarChart3, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LOGS = [
  "Nuevo lead detectado...",
  "Workflow automatizado...",
  "Chatbot resolvió consulta...",
  "Análisis de datos completado...",
  "Sincronización de API exitosa...",
  "Modelo de IA actualizado...",
];

const Features = () => {
  const [consoleLogs, setConsoleLogs] = useState([]);
  const metricsRef   = useRef(null);
  const sectionRef   = useRef(null);
  const intervalRef  = useRef(null);
  const lineRef      = useRef(0);
  const stat1Ref     = useRef(null);
  const stat2Ref     = useRef(null);

  /* ── Typewriter: solo corre cuando la sección es visible ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          intervalRef.current = setInterval(() => {
            setConsoleLogs(prev => {
              const next = [...prev, LOGS[lineRef.current % LOGS.length]];
              lineRef.current++;
              return next.length > 5 ? next.slice(-5) : next;
            });
          }, 2000);
        } else {
          clearInterval(intervalRef.current);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      clearInterval(intervalRef.current);
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  /* ── Bar animations + stat counters ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Metric bars
      metricsRef.current.querySelectorAll('.metric-bar').forEach(bar => {
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: bar.getAttribute('data-target'),
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, start: 'top 90%', once: true },
          }
        );
      });

      // Counter: +18k
      const c1 = { val: 0 };
      gsap.to(c1, {
        val: 18,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => { if (stat1Ref.current) stat1Ref.current.textContent = `+${Math.round(c1.val)}k`; },
        scrollTrigger: { trigger: stat1Ref.current, start: 'top 90%', once: true },
      });

      // Counter: 99.9%
      const c2 = { val: 0 };
      gsap.to(c2, {
        val: 99.9,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => { if (stat2Ref.current) stat2Ref.current.textContent = `${c2.val.toFixed(1)}%`; },
        scrollTrigger: { trigger: stat2Ref.current, start: 'top 90%', once: true },
      });
    }, metricsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="tecnologia" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* Telemetry Console */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-neon/30 bg-accent-neon/5 text-accent-neon text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
              LIVE FEED
            </div>
            <h2 className="text-4xl font-display font-bold">Feed IA en tiempo real</h2>
            <p className="text-text-secondary">
              Observa cómo el sistema toma decisiones y ejecuta flujos de trabajo de manera autónoma para optimizar tu operación.
            </p>
          </div>

          <div className="glass rounded-[2rem] p-6 font-mono text-sm min-h-[240px] shadow-2xl relative overflow-hidden">
            <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="space-y-2">
              {consoleLogs.map((log, i) => (
                <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-4">
                  <span className="text-primary">{'>'}</span>
                  <span className="text-text-primary text-xs">{log}</span>
                </div>
              ))}
              <div className="flex gap-2">
                <span className="text-primary">{'>'}</span>
                <span className="w-2 h-4 bg-primary/80 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Intelligent Metrics */}
        <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2 space-y-6">
            <h2 className="text-4xl font-display font-bold">Métricas que importan</h2>
            <p className="text-text-secondary">
              Transformamos la eficiencia operativa en números reales. Menos intervención manual, más rentabilidad.
            </p>
            <div className="space-y-8 pt-6">
              {[
                { label: 'Automatización empresarial', value: '+73%',  target: '73%' },
                { label: 'Optimización de procesos',   value: '-45%',  target: '90%' },
                { label: 'Ahorro operativo',            value: '+210%', target: '65%' },
              ].map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-text-secondary">{m.label}</span>
                    <span className="text-2xl font-display font-bold text-accent-neon">{m.value}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="metric-bar h-full bg-gradient-brand rounded-full"
                      data-target={m.target}
                      style={{ width: 0, willChange: 'width' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:order-1 grid grid-cols-2 gap-4">
            <div className="p-8 glass rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
              <BarChart3 className="text-primary" size={40} />
              <div>
                <div ref={stat1Ref} className="text-2xl font-bold font-display">+0k</div>
                <div className="text-xs text-text-secondary">Horas ahorradas</div>
              </div>
            </div>
            <div className="p-8 glass rounded-[2rem] translate-y-8 flex flex-col items-center justify-center text-center space-y-4">
              <Cpu className="text-accent-neon" size={40} />
              <div>
                <div ref={stat2Ref} className="text-2xl font-bold font-display">0.0%</div>
                <div className="text-xs text-text-secondary">Uptime de IA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orbit of Integrations */}
        <div className="flex flex-col items-center text-center space-y-12 py-12">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl font-display font-bold">Sin fricciones, sin límites</h2>
            <p className="text-text-secondary">Nos integramos con tu stack tecnológico actual para potenciar cada herramienta.</p>
          </div>

          <div className="orbit-container" style={{ willChange: 'transform' }}>
            <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_40px_rgba(108,59,255,0.4)]" style={{ background: 'rgba(17,17,27,0.85)' }}>
              <span className="font-display font-bold text-xs text-center">SOM<br />SYNGULAR</span>
            </div>

            {/* GPU-accelerated CSS spin — no repaints */}
            <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full animate-spin [animation-duration:30s]"
                 style={{ willChange: 'transform' }}>
              <div className="orbiting-icon p-3 rounded-full shadow-lg" style={{ top: 0,     left: '50%', background: 'rgba(17,17,27,0.85)', border: '1px solid rgba(168, 85, 247, 0.15)' }}><Database    size={20} className="text-text-primary" /></div>
              <div className="orbiting-icon p-3 rounded-full shadow-lg" style={{ top: '50%', left: '100%', background: 'rgba(17,17,27,0.85)', border: '1px solid rgba(168, 85, 247, 0.15)' }}><Slack       size={20} className="text-text-primary" /></div>
              <div className="orbiting-icon p-3 rounded-full shadow-lg" style={{ top: '100%',left: '50%', background: 'rgba(17,17,27,0.85)', border: '1px solid rgba(168, 85, 247, 0.15)' }}><CreditCard  size={20} className="text-text-primary" /></div>
              <div className="orbiting-icon p-3 rounded-full shadow-lg" style={{ top: '50%', left: 0, background: 'rgba(17,17,27,0.85)', border: '1px solid rgba(168, 85, 247, 0.15)'       }}><MessageSquare size={20} className="text-text-primary" /></div>
            </div>

            <div className="absolute w-[450px] h-[450px] border border-white/5 rounded-full animate-spin [animation-duration:50s] [animation-direction:reverse]"
                 style={{ willChange: 'transform' }}>
              <div className="orbiting-icon p-3 rounded-full shadow-lg" style={{ top: '15%', left: '85%', background: 'rgba(17,17,27,0.85)', border: '1px solid rgba(168, 85, 247, 0.15)' }}><Globe size={20} className="text-text-primary" /></div>
              <div className="orbiting-icon p-3 rounded-full shadow-lg" style={{ top: '85%', left: '15%', background: 'rgba(17,17,27,0.85)', border: '1px solid rgba(168, 85, 247, 0.15)' }}><Cpu   size={20} className="text-text-primary" /></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
