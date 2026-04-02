import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { DitheringCard } from './ui/hero-dithering-card';
import { ArrowRight, Loader2 } from 'lucide-react';

const WEBHOOK_URL = 'https://n8n.srv1119749.hstgr.cloud/webhook/a761a7e9-5fb1-4998-9cd8-7bdb73cde558';

function saveLead(lead) {
  try {
    const existing = JSON.parse(localStorage.getItem('syngular_leads') || '[]');
    existing.push({ ...lead, id: crypto.randomUUID(), done: false });
    localStorage.setItem('syngular_leads', JSON.stringify(existing));
  } catch {}
}

const InputField = ({ label, id, type = 'text', required, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-white/80">
      {label} {required && <span className="text-purple-400">*</span>}
    </label>
    <input
      id={id}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
    />
  </div>
);

const CTA = () => {
  const [form, setForm] = useState({ nombre: '', email: '', empresa: '', proceso: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const { content } = useContent();
  const c = content.cta;

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.proceso) return;
    setStatus('loading');

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          empresa: form.empresa,
          proceso: form.proceso,
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        saveLead({ nombre: form.nombre, email: form.email, empresa: form.empresa, proceso: form.proceso, timestamp: new Date().toISOString() });
        setStatus('success');
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      setStatus('error');
    }
  };

  const [hovered, setHovered] = useState(false);

  return (
    <section id="contacto" className="py-24 px-6">
      <div
        className="max-w-7xl mx-auto"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <DitheringCard isHovered={hovered} className="p-12 md:p-20">

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                 style={{ border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.08)', color: '#A855F7' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400" />
              </span>
              Automatización Inteligente
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-6 mb-14">
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight max-w-4xl mx-auto">
              {c.title}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {c.subtitle}
            </p>
          </div>

          {/* Form / Success / Error */}
          {status === 'success' ? (
            <div className="max-w-md mx-auto text-center space-y-6 py-10">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-white">¡Mensaje recibido!</h3>
              <p className="text-text-secondary">
                Nuestro equipo revisará tu solicitud y te contactará en menos de 24 horas.
              </p>
              <button
                onClick={() => { setStatus('idle'); setForm({ nombre:'', email:'', empresa:'', proceso:'' }); }}
                className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  id="nombre" label="Nombre completo" required
                  value={form.nombre} onChange={handleChange('nombre')}
                  placeholder="Juan García"
                />
                <InputField
                  id="email" label="Email" type="email" required
                  value={form.email} onChange={handleChange('email')}
                  placeholder="juan@empresa.com"
                />
              </div>

              <InputField
                id="empresa" label="Empresa"
                value={form.empresa} onChange={handleChange('empresa')}
                placeholder="Mi Empresa S.L."
              />

              <div className="space-y-1.5">
                <label htmlFor="proceso" className="block text-sm font-medium text-white/80">
                  ¿Qué proceso quieres automatizar? <span className="text-purple-400">*</span>
                </label>
                <textarea
                  id="proceso"
                  required
                  rows={4}
                  value={form.proceso}
                  onChange={handleChange('proceso')}
                  placeholder="Ej: Gestión de leads, respuestas automáticas a clientes, integración entre CRM y facturación..."
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none resize-none transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-400 text-center">
                  Error al enviar. Verifica tu conexión e inténtalo de nuevo.
                </p>
              )}

              <div className="pt-2 flex flex-col items-center gap-4">
                <button
                  data-magnetic="0.2"
                  type="submit"
                  disabled={status === 'loading'}
                  className="group inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full px-12 text-base font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)', boxShadow: '0 0 40px rgba(108,59,255,0.4)' }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      {c.button}
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 overflow-hidden"
                           style={{ borderColor: '#0B0B12' }}>
                        <img
                          src={`https://i.pravatar.cc/150?u=${i + 10}`}
                          alt="Customer Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary">
                    <span className="text-white font-bold">+120 empresas</span> ya han automatizado su éxito.
                  </p>
                </div>
              </div>
            </form>
          )}

        </DitheringCard>
      </div>
    </section>
  );
};

export default CTA;
