import { useState } from 'react';

const STORAGE_KEY = 'syngular_portfolio';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function persist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function usePortfolio() {
  const [items, setItems] = useState(load);

  const add = (item) => {
    const next = [
      { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ...items,
    ];
    setItems(next);
    persist(next);
  };

  const remove = (id) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    persist(next);
  };

  const update = (id, fields) => {
    const next = items.map(i => i.id === id ? { ...i, ...fields } : i);
    setItems(next);
    persist(next);
  };

  return { items, add, remove, update };
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function getYouTubeId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

export function getThumbnail(item) {
  if (item.thumbnail) return item.thumbnail;
  if (item.type === 'video' || item.type === 'reel') {
    const ytId = getYouTubeId(item.src || '');
    if (ytId) return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  }
  return item.src || null;
}

export const TYPE_META = {
  imagen:  { label: 'Imagen',   color: '#A855F7' },
  video:   { label: 'Vídeo',    color: '#3B82F6' },
  reel:    { label: 'Reel',     color: '#EC4899' },
  anuncio: { label: 'Anuncio',  color: '#10B981' },
};
