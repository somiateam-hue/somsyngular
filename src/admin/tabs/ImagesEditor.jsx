import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

// Converts a File to base64 data URL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageCard({ label, src, onUrlChange, onFileUpload, urlValue, onUrlInput }) {
  const inputRef = useRef(null);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>
      {/* Preview */}
      <div className="relative h-48 bg-black/40">
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">🖼️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <p className="absolute bottom-3 left-4 text-sm font-bold text-white">{label}</p>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3">
        {/* URL input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={urlValue}
            onChange={e => onUrlInput(e.target.value)}
            placeholder="Pegar URL de imagen..."
            className="flex-1 px-3 py-2 rounded-xl text-xs text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
          />
          <button
            onClick={onUrlChange}
            className="px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-80"
            style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}
          >
            Usar URL
          </button>
        </div>

        {/* File upload */}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async e => {
              const file = e.target.files[0];
              if (!file) return;
              const dataUrl = await fileToDataUrl(file);
              onFileUpload(dataUrl);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
            style={{ color: 'rgba(245,245,255,0.6)', border: '1px dashed rgba(168,85,247,0.3)' }}
          >
            📁 Subir desde mi dispositivo
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline text input helper
function Field({ value, placeholder, onChange }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}
    />
  );
}

// Button to delete an item
function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Eliminar"
      className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:bg-red-500/20"
      style={{ color: 'rgba(248,113,113,0.8)', border: '1px solid rgba(248,113,113,0.2)' }}
    >
      🗑️ Eliminar
    </button>
  );
}

// Add-new card placeholder
function AddCard({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl h-full min-h-[280px] w-full flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/5"
      style={{ border: '2px dashed rgba(168,85,247,0.3)', color: 'rgba(168,85,247,0.7)' }}
    >
      <span className="text-4xl">＋</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function ImagesEditor() {
  const { content, updateSection, updateArrayItem, addArrayItem, removeArrayItem } = useContent();

  // ── Hero ──────────────────────────────────────────────────────────────────
  const [heroUrl, setHeroUrl] = useState(content.hero.image || '');
  useEffect(() => { setHeroUrl(content.hero.image || ''); }, [content.hero.image]);

  // ── Equipo ────────────────────────────────────────────────────────────────
  const members = content.equipo.members;
  const [teamUrls, setTeamUrls] = useState(members.map(m => m.img || ''));
  const [teamNames, setTeamNames] = useState(members.map(m => m.name || ''));
  const [teamRoles, setTeamRoles] = useState(members.map(m => m.role || ''));

  // Keep local state in sync when members change (add/remove)
  useEffect(() => {
    setTeamUrls(members.map(m => m.img || ''));
    setTeamNames(members.map(m => m.name || ''));
    setTeamRoles(members.map(m => m.role || ''));
  }, [members.length]);

  const handleAddMember = () => {
    addArrayItem('equipo', 'members', { name: 'Nuevo miembro', role: 'Rol', desc: '', img: '' });
  };
  const handleRemoveMember = (i) => removeArrayItem('equipo', 'members', i);

  // ── Casos ─────────────────────────────────────────────────────────────────
  const casos = content.casos.items;
  const [casosUrls, setCasosUrls] = useState(casos.map(c => c.img || ''));
  const [casosTitles, setCasosTitles] = useState(casos.map(c => c.title || ''));
  const [casosCategories, setCasosCategories] = useState(casos.map(c => c.category || ''));

  useEffect(() => {
    setCasosUrls(casos.map(c => c.img || ''));
    setCasosTitles(casos.map(c => c.title || ''));
    setCasosCategories(casos.map(c => c.category || ''));
  }, [casos.length]);

  const handleAddCaso = () => {
    addArrayItem('casos', 'items', { title: 'Nuevo caso', category: 'Categoría', img: '' });
  };
  const handleRemoveCaso = (i) => removeArrayItem('casos', 'items', i);

  return (
    <div className="space-y-12">

      {/* ── Hero ── */}
      <section>
        <h2 className="font-display font-bold text-white text-lg mb-4">🦸 Imagen del Hero</h2>
        <div className="max-w-md">
          <ImageCard
            label="Hero Principal"
            src={content.hero.image}
            urlValue={heroUrl}
            onUrlInput={setHeroUrl}
            onUrlChange={() => updateSection('hero', 'image', heroUrl)}
            onFileUpload={(url) => { setHeroUrl(url); updateSection('hero', 'image', url); }}
          />
        </div>
      </section>

      {/* ── Equipo ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white text-lg">👥 Equipo</h2>
          <span className="text-xs" style={{ color: 'rgba(245,245,255,0.35)' }}>
            {members.length} miembro{members.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {members.map((member, i) => (
            <div key={i} className="space-y-2">
              <ImageCard
                label={member.name || 'Miembro'}
                src={member.img}
                urlValue={teamUrls[i] ?? ''}
                onUrlInput={v => { const a = [...teamUrls]; a[i] = v; setTeamUrls(a); }}
                onUrlChange={() => updateArrayItem('equipo', 'members', i, 'img', teamUrls[i])}
                onFileUpload={(url) => {
                  const a = [...teamUrls]; a[i] = url; setTeamUrls(a);
                  updateArrayItem('equipo', 'members', i, 'img', url);
                }}
              />
              <Field
                value={teamNames[i] ?? ''}
                placeholder="Nombre"
                onChange={v => {
                  const a = [...teamNames]; a[i] = v; setTeamNames(a);
                  updateArrayItem('equipo', 'members', i, 'name', v);
                }}
              />
              <Field
                value={teamRoles[i] ?? ''}
                placeholder="Rol"
                onChange={v => {
                  const a = [...teamRoles]; a[i] = v; setTeamRoles(a);
                  updateArrayItem('equipo', 'members', i, 'role', v);
                }}
              />
              <DeleteButton onClick={() => handleRemoveMember(i)} />
            </div>
          ))}

          {/* Add new member */}
          <AddCard label="Añadir miembro" onClick={handleAddMember} />
        </div>
      </section>

      {/* ── Casos de Éxito ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white text-lg">📂 Casos de Éxito</h2>
          <span className="text-xs" style={{ color: 'rgba(245,245,255,0.35)' }}>
            {casos.length} caso{casos.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {casos.map((caso, i) => (
            <div key={i} className="space-y-2">
              <ImageCard
                label={caso.title || 'Caso'}
                src={caso.img}
                urlValue={casosUrls[i] ?? ''}
                onUrlInput={v => { const a = [...casosUrls]; a[i] = v; setCasosUrls(a); }}
                onUrlChange={() => updateArrayItem('casos', 'items', i, 'img', casosUrls[i])}
                onFileUpload={(url) => {
                  const a = [...casosUrls]; a[i] = url; setCasosUrls(a);
                  updateArrayItem('casos', 'items', i, 'img', url);
                }}
              />
              <Field
                value={casosTitles[i] ?? ''}
                placeholder="Título del caso"
                onChange={v => {
                  const a = [...casosTitles]; a[i] = v; setCasosTitles(a);
                  updateArrayItem('casos', 'items', i, 'title', v);
                }}
              />
              <Field
                value={casosCategories[i] ?? ''}
                placeholder="Categoría"
                onChange={v => {
                  const a = [...casosCategories]; a[i] = v; setCasosCategories(a);
                  updateArrayItem('casos', 'items', i, 'category', v);
                }}
              />
              <DeleteButton onClick={() => handleRemoveCaso(i)} />
            </div>
          ))}

          {/* Add new caso */}
          <AddCard label="Añadir caso de éxito" onClick={handleAddCaso} />
        </div>
      </section>

      <p className="text-xs" style={{ color: 'rgba(245,245,255,0.3)' }}>
        ✅ Todos los cambios se aplican y guardan instantáneamente. Las imágenes subidas se almacenan localmente en este navegador.
      </p>
    </div>
  );
}
