import { useState, useEffect } from 'react';
import {
  subscribePortfolio, addPortfolioItem,
  deletePortfolioItem, updatePortfolioItem,
} from '../lib/firestoreDB';

export function usePortfolio() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribePortfolio(data => {
      setItems(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return {
    items,
    loading,
    add:    addPortfolioItem,
    remove: deletePortfolioItem,
    update: updatePortfolioItem,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function getYouTubeId(url) {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
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
  imagen:  { label: 'Imagen',  color: '#A855F7' },
  video:   { label: 'Vídeo',   color: '#3B82F6' },
  reel:    { label: 'Reel',    color: '#EC4899' },
  anuncio: { label: 'Anuncio', color: '#10B981' },
};
