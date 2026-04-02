import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ChevronDown, Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

const ROICalculator = () => {
  const [isOpen,     setIsOpen]     = useState(false);
  const [employees,  setEmployees]  = useState(10);
  const [hours,      setHours]      = useState(5);
  const [cost,       setCost]       = useState(25);
  const [automation, setAutomation] = useState(50);

  const contentRef  = useRef(null);
  const chevronRef  = useRef(null);
  const horasRef    = useRef(null);
  const mensualRef  = useRef(null);
  const anualRef    = useRef(null);

  /* ── Expand / collapse ── */
  useEffect(() => {
    const content = contentRef.current;
    const chevron = chevronRef.current;
    if (!content || !chevron) return;

    // Matar tweens previos para evitar cola
    gsap.killTweensOf([content, chevron]);

    if (isOpen) {
      gsap.to(content, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out' });
      gsap.to(chevron, { rotate: 180,   duration: 0.3 });
    } else {
      gsap.to(content, { height: 0,    opacity: 0, duration: 0.4,  ease: 'power2.in' });
      gsap.to(chevron, { rotate: 0,    duration: 0.3 });
    }
  }, [isOpen]);

  /* ── Count-up: un tween por valor, sin querySelector en onUpdate ── */
  useEffect(() => {
    if (!isOpen) return;

    const horas_totales  = employees * hours;
    const horas_ahorradas = horas_totales * (automation / 100);
    const ahorro_mensual = horas_ahorradas * cost * 4;
    const ahorro_anual   = ahorro_mensual * 12;

    const targets = [
      { ref: horasRef,   end: horas_ahorradas * 4, prefix: '',  suffix: '' },
      { ref: mensualRef, end: ahorro_mensual,       prefix: '$', suffix: '' },
      { ref: anualRef,   end: ahorro_anual,         prefix: '$', suffix: '' },
    ];

    const tweens = targets.map(({ ref, end, prefix }) => {
      if (!ref.current) return null;
      const obj = { val: 0 };
      // Matar tween anterior de este elemento específico
      gsap.killTweensOf(obj);
      return gsap.to(obj, {
        val: end,
        duration: 1,
        ease: 'power2.out',
        onUpdate() {
          if (ref.current) {
            ref.current.textContent = prefix + Math.floor(obj.val).toLocaleString('es-ES');
          }
        },
      });
    });

    return () => tweens.forEach(t => t?.kill());
  }, [isOpen, employees, hours, cost, automation]);

  const horas_totales   = employees * hours;
  const horas_ahorradas = horas_totales * (automation / 100);
  const ahorro_mensual  = horas_ahorradas * cost * 4;
  const ahorro_anual    = ahorro_mensual * 12;

  return (
    <section className="py-12 px-6">
      <div className="max-w-[900px] mx-auto glass rounded-[2rem] border border-accent-neon/20 overflow-hidden bg-background-secondary shadow-2xl">

        <div
          className="p-8 md:p-12 cursor-pointer flex items-center justify-between group"
          onClick={() => setIsOpen(o => !o)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-neon/10 flex items-center justify-center text-accent-neon group-hover:scale-110 transition-transform"
                 style={{ willChange: 'transform' }}>
              <Calculator size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Calcula cuánto puede ahorrar tu empresa con IA
            </h2>
          </div>
          <div ref={chevronRef} className="text-text-secondary flex-shrink-0"
               style={{ willChange: 'transform' }}>
            <ChevronDown size={32} />
          </div>
        </div>

        <div ref={contentRef} style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
          <div className="p-8 md:p-12 pt-0 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5">

            {/* Inputs */}
            <div className="space-y-8">
              {[
                { label: 'Nº Empleados',                       val: employees,  set: v => setEmployees(Math.max(1, v)),  min: 1 },
                { label: 'Horas semanales repetitivas / emp',  val: hours,      set: v => setHours(Math.max(0, v)),      min: 0 },
                { label: 'Coste medio por hora (€)',           val: cost,       set: v => setCost(Math.max(0, v)),       min: 0 },
              ].map(({ label, val, set, min }) => (
                <div key={label} className="space-y-4">
                  <label className="block text-sm font-medium text-text-secondary uppercase tracking-wider">{label}</label>
                  <input
                    type="number"
                    value={val}
                    min={min}
                    onChange={e => set(parseInt(e.target.value) || 0)}
                    className="w-full bg-background border border-white/10 rounded-xl p-4 text-text-primary focus:border-accent-neon outline-none transition-colors"
                  />
                </div>
              ))}

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-text-secondary uppercase tracking-wider">
                    Nivel de automatización
                  </label>
                  <span className="text-accent-neon font-bold">{automation}%</span>
                </div>
                <input
                  type="range" min="10" max="90" step="5"
                  value={automation}
                  onChange={e => setAutomation(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-neon"
                />
              </div>
            </div>

            {/* Results — refs directos, sin querySelector */}
            <div className="bg-background/50 rounded-[1.5rem] p-8 space-y-8 flex flex-col justify-center border border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-text-secondary text-sm italic">
                  <Clock size={16} /> Horas ahorradas / mes
                </div>
                <div className="text-4xl font-display font-bold text-text-primary">
                  <span ref={horasRef}>0</span>h
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-text-secondary text-sm italic">
                  <TrendingUp size={16} /> Ahorro mensual estimado
                </div>
                <div className="text-4xl font-display font-bold text-accent-neon">
                  <span ref={mensualRef}>$0</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-text-secondary text-sm italic">
                  <DollarSign size={16} /> Ahorro anual proyectado
                </div>
                <div className="text-5xl font-display font-bold text-primary">
                  <span ref={anualRef}>$0</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
