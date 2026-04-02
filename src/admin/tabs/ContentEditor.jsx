import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import ImagesEditor from './ImagesEditor';

const SECTIONS = [
  {
    id: 'hero',
    label: 'Hero',
    icon: '🦸',
    fields: [
      { key: 'badge', label: 'Badge (etiqueta superior)', type: 'text' },
      { key: 'title', label: 'Título principal', type: 'text' },
      { key: 'titleHighlight', label: 'Título (parte destacada)', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'cta1', label: 'Botón principal', type: 'text' },
      { key: 'cta2', label: 'Botón secundario', type: 'text' },
    ],
  },
  {
    id: 'features',
    label: 'Soluciones',
    icon: '⚡',
    fields: [
      { key: 'badge', label: 'Badge', type: 'text' },
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
    ],
  },
  {
    id: 'manifesto',
    label: 'Manifiesto',
    icon: '📣',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'body', label: 'Cuerpo de texto', type: 'textarea' },
      { key: 'cta', label: 'Enlace CTA', type: 'text' },
    ],
  },
  {
    id: 'proceso',
    label: 'Proceso',
    icon: '🔄',
    fields: [
      { key: 'badge', label: 'Badge', type: 'text' },
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
    ],
  },
  {
    id: 'equipo',
    label: 'Equipo',
    icon: '👥',
    fields: [
      { key: 'badge', label: 'Badge', type: 'text' },
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
    ],
  },
  {
    id: 'cta',
    label: 'Formulario CTA',
    icon: '📋',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'button', label: 'Texto del botón', type: 'text' },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: '🔻',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
    ],
  },
  {
    id: 'imagenes',
    label: 'Imágenes',
    icon: '🖼️',
    fields: [], // handled by ImagesEditor
  },
];

function FieldInput({ type, value, onChange }) {
  const cls = "w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500 resize-none";
  const style = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' };

  if (type === 'textarea') {
    return <textarea rows={3} value={value} onChange={onChange} className={cls} style={style} />;
  }
  return <input type="text" value={value} onChange={onChange} className={cls} style={style} />;
}

export default function ContentEditor() {
  const { content, updateSection, resetSection, resetAll } = useContent();
  const [activeSection, setActiveSection] = useState('hero');
  const [saved, setSaved] = useState(false);
  const [localEdits, setLocalEdits] = useState({});

  const section = SECTIONS.find(s => s.id === activeSection);

  const handleChange = (field, value) => {
    setLocalEdits(prev => ({ ...prev, [field]: value }));
    updateSection(activeSection, field, value);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getValue = (field) => {
    return localEdits[field] ?? content[activeSection]?.[field] ?? '';
  };

  const handleSectionChange = (id) => {
    setActiveSection(id);
    setLocalEdits({});
  };

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Section nav */}
      <div className="w-48 flex-shrink-0 space-y-1">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => handleSectionChange(s.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all text-sm"
            style={{
              background: activeSection === s.id ? 'rgba(168,85,247,0.15)' : 'transparent',
              color: activeSection === s.id ? '#A855F7' : 'rgba(245,245,255,0.6)',
              border: activeSection === s.id ? '1px solid rgba(168,85,247,0.25)' : '1px solid transparent',
            }}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Editor panel */}
      <div className="flex-1 rounded-2xl p-6 space-y-5"
        style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>

        {activeSection === 'imagenes' ? (
          <ImagesEditor />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-white">
                {section?.icon} {section?.label}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => { resetSection(activeSection); setLocalEdits({}); }}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/10"
                  style={{ color: 'rgba(245,245,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Restablecer
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                  style={{
                    background: saved ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg,#6C3BFF,#A855F7)',
                    border: saved ? '1px solid rgba(52,211,153,0.4)' : 'none',
                  }}
                >
                  {saved ? '✓ Guardado' : 'Guardar y publicar'}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {section?.fields.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <label className="block text-sm font-medium" style={{ color: 'rgba(245,245,255,0.7)' }}>
                    {f.label}
                  </label>
                  <FieldInput
                    type={f.type}
                    value={getValue(f.key)}
                    onChange={e => handleChange(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <p className="text-xs" style={{ color: 'rgba(245,245,255,0.3)' }}>
                ✅ Los cambios se guardan automáticamente y son visibles al instante en el sitio.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
