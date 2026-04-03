import React, { useRef, useState } from 'react';
import { usePortfolio, getThumbnail, TYPE_META } from '../../hooks/usePortfolio';

const TYPES = ['imagen', 'video', 'reel', 'anuncio'];

const EMPTY_FORM = {
  title: '',
  desc: '',
  type: 'imagen',
  src: '',
  thumbnail: '',
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium" style={{ color: 'rgba(245,245,255,0.6)' }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
    />
  );
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
      className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none resize-none"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
    />
  );
}

function AddForm({ onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const thumbRef = useRef(null);

  const isMedia = form.type === 'imagen' || form.type === 'anuncio';

  const handleFile = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      setError('La imagen supera 800 KB (límite para bases de datos gratuitas). Comprímela o usa una URL directa.');
      e.target.value = '';
      return;
    }
    setError('');
    const data = await fileToDataUrl(file);
    if (field === 'src') { setForm(f => ({ ...f, src: data })); setPreview(data); }
    if (field === 'thumbnail') setForm(f => ({ ...f, thumbnail: data }));
    e.target.value = '';
  };

  const handleSave = () => {
    if (!form.title.trim()) { setError('El título es obligatorio.'); return; }
    if (!form.src.trim())   { setError('Añade una imagen, vídeo o URL.'); return; }
    onSave(form);
  };

  return (
    <div className="rounded-2xl p-6 space-y-5"
      style={{ background: 'rgba(17,17,27,0.95)', border: '1px solid rgba(168,85,247,0.25)' }}>
      <h3 className="font-display font-bold text-white text-base">Nueva pieza de contenido</h3>

      {/* Type selector */}
      <Field label="Tipo">
        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setForm(f => ({ ...f, type: t }))}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: form.type === t ? TYPE_META[t].color + '33' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${form.type === t ? TYPE_META[t].color : 'rgba(255,255,255,0.1)'}`,
                color: form.type === t ? TYPE_META[t].color : 'rgba(245,245,255,0.5)',
              }}
            >
              {TYPE_META[t].label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Título *">
          <Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Ej: Campaign de verano" />
        </Field>
        <Field label="Descripción">
          <Input value={form.desc} onChange={v => setForm(f => ({ ...f, desc: v }))} placeholder="Breve descripción..." />
        </Field>
      </div>

      {/* Media input */}
      {isMedia ? (
        <Field label="Imagen (subir archivo o pegar URL)">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                value={form.src.startsWith('data:') ? '' : form.src}
                onChange={e => { setForm(f => ({ ...f, src: e.target.value })); setPreview(e.target.value); }}
                placeholder="https://... o sube un archivo"
                className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all hover:opacity-80"
                style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)', color: '#fff' }}
              >
                Subir
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, 'src')} />
            </div>
            {(preview || form.src) && (
              <img src={preview || form.src} alt="preview" className="h-32 rounded-xl object-cover" onError={() => setPreview(null)} />
            )}
          </div>
        </Field>
      ) : (
        <div className="space-y-3">
          <Field label="URL del vídeo (YouTube, Shorts, Vimeo, o .mp4 directo)">
            <Input
              value={form.src}
              onChange={v => setForm(f => ({ ...f, src: v }))}
              placeholder="https://youtube.com/watch?v=..."
            />
          </Field>
          <Field label="Miniatura personalizada (opcional — se obtiene automáticamente de YouTube)">
            <div className="flex gap-2">
              <input
                value={form.thumbnail.startsWith('data:') ? '' : form.thumbnail}
                onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                placeholder="URL de miniatura..."
                className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
              />
              <button
                onClick={() => thumbRef.current?.click()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(245,245,255,0.7)', border: '1px solid rgba(168,85,247,0.2)' }}
              >
                Subir
              </button>
              <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, 'thumbnail')} />
            </div>
          </Field>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}
        >
          Guardar pieza
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
          style={{ color: 'rgba(245,245,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function ItemCard({ item, onDelete }) {
  const thumb = getThumbnail(item);
  const meta  = TYPE_META[item.type] || TYPE_META.imagen;

  return (
    <div className="rounded-2xl overflow-hidden group"
      style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.12)' }}>
      {/* Thumbnail */}
      <div className="relative h-44 bg-black/40 overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl" style={{ color: 'rgba(255,255,255,0.1)' }}>
            {item.type === 'video' || item.type === 'reel' ? '▶' : '🖼'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Type badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ background: meta.color + '33', color: meta.color, border: `1px solid ${meta.color}55` }}
        >
          {meta.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <p className="font-bold text-sm text-white truncate">{item.title}</p>
        {item.desc && <p className="text-xs truncate" style={{ color: 'rgba(245,245,255,0.45)' }}>{item.desc}</p>}
        <p className="text-[10px]" style={{ color: 'rgba(245,245,255,0.25)' }}>
          {new Date(item.createdAt).toLocaleDateString('es-ES')}
        </p>
      </div>

      {/* Delete */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onDelete(item.id)}
          className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:bg-red-500/20"
          style={{ color: 'rgba(248,113,113,0.7)', border: '1px solid rgba(248,113,113,0.15)' }}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}

export default function PortfolioManager() {
  const { items, add, remove } = usePortfolio();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]     = useState('all');

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  const handleSave = (form) => {
    add(form);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Portafolio IA</h2>
          <p className="text-xs mt-1" style={{ color: 'rgba(245,245,255,0.4)' }}>
            {items.length} pieza{items.length !== 1 ? 's' : ''} publicadas en el sitio
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}
          >
            + Añadir pieza
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <AddForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[{ id: 'all', label: 'Todos' }, ...TYPES.map(t => ({ id: t, label: TYPE_META[t].label }))].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === f.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${filter === f.id ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: filter === f.id ? '#A855F7' : 'rgba(245,245,255,0.5)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} onDelete={remove} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3">
          <p className="text-4xl">🎨</p>
          <p className="font-bold text-white">Sin piezas todavía</p>
          <p className="text-sm" style={{ color: 'rgba(245,245,255,0.4)' }}>
            Añade tu primer contenido IA con el botón de arriba.
          </p>
        </div>
      )}

      <p className="text-xs" style={{ color: 'rgba(245,245,255,0.25)' }}>
        ✅ Las piezas se publican automáticamente en la sección "Portafolio IA" del sitio.
        Las imágenes subidas se almacenan localmente (&lt;3 MB por pieza).
      </p>
    </div>
  );
}
