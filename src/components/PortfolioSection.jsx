import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, ExternalLink } from 'lucide-react';
import { usePortfolio, getThumbnail, getYouTubeId, TYPE_META } from '../hooks/usePortfolio';

gsap.registerPlugin(ScrollTrigger);

const FILTERS = [
  { id: 'all',     label: 'Todos' },
  { id: 'imagen',  label: 'Imágenes' },
  { id: 'video',   label: 'Vídeos' },
  { id: 'reel',    label: 'Reels' },
  { id: 'anuncio', label: 'Anuncios' },
];

function isVideoType(type) {
  return type === 'video' || type === 'reel';
}

function getEmbedUrl(src) {
  const ytId = getYouTubeId(src);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
  // Vimeo
  const vm = src.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return null;
}

function PortfolioCard({ item }) {
  const [playing, setPlaying] = useState(false);
  const thumb   = getThumbnail(item);
  const meta    = TYPE_META[item.type] || TYPE_META.imagen;
  const isVideo = isVideoType(item.type);
  const embed   = isVideo ? getEmbedUrl(item.src) : null;
  const isDirect = isVideo && !embed && item.src?.match(/\.(mp4|webm|mov)(\?|$)/i);

  return (
    <div className="portfolio-card group relative rounded-[1.75rem] overflow-hidden bg-black/40 border border-white/10 hover:border-accent-neon/30 transition-colors duration-300">

      {/* Media area */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {playing && embed ? (
          <iframe
            src={embed}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={item.title}
          />
        ) : playing && isDirect ? (
          <video
            src={item.src}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            controls
          />
        ) : (
          <>
            {thumb ? (
              <img
                src={thumb}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'rgba(108,59,255,0.08)' }}>
                <span className="text-5xl opacity-20">{isVideo ? '▶' : '🖼'}</span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Play button */}
            {isVideo && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Reproducir"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                  style={{ background: 'rgba(168,85,247,0.7)', border: '2px solid rgba(255,255,255,0.3)' }}>
                  <Play size={24} className="text-white ml-1" fill="white" />
                </div>
              </button>
            )}

            {/* External link for images */}
            {!isVideo && item.src && !item.src.startsWith('data:') && (
              <a
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <ExternalLink size={14} className="text-white" />
              </a>
            )}

            {/* Type badge */}
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
              style={{ background: meta.color + '33', color: meta.color, border: `1px solid ${meta.color}55` }}
            >
              {meta.label}
            </span>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-5 space-y-1.5">
        <h3 className="font-display font-bold text-white text-sm leading-snug">{item.title}</h3>
        {item.desc && (
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,245,255,0.5)' }}>{item.desc}</p>
        )}
      </div>
    </div>
  );
}

const PortfolioSection = () => {
  const { items } = usePortfolio();
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from('.portfolio-card', {
        y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items.length, filter]);

  // Don't render the section if there's nothing to show
  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} id="portafolio" className="py-24 px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* Header */}
        <div className="text-center space-y-5">
          <p className="text-accent-neon font-mono text-xs tracking-widest uppercase">Portafolio IA</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Contenido creado con <span className="text-gradient">inteligencia artificial</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Campañas, vídeos, reels y anuncios generados y optimizados con IA para marcas que quieren destacar.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {FILTERS.map(f => {
            const count = f.id === 'all' ? items.length : items.filter(i => i.type === f.id).length;
            if (count === 0 && f.id !== 'all') return null;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: filter === f.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${filter === f.id ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: filter === f.id ? '#A855F7' : 'rgba(245,245,255,0.55)',
                }}
              >
                {f.label}
                <span className="ml-1.5 text-xs opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-text-secondary">Sin piezas en esta categoría.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default PortfolioSection;
