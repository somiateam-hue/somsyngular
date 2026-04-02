import { useState, useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

import Manifesto from '../components/Manifesto';
import Features from '../components/Features';
import Proceso from '../components/Proceso';
import Equipo from '../components/Equipo';
import ROICalculator from '../components/ROICalculator';
import CTA from '../components/CTA';
import Chatbot from '../components/Chatbot';

import LobbyScene from './scene/LobbyScene';
import MobileController, { subscribeAction } from './MobileController';

/* ═══════════════════════════════════════════════════════════════════════════════
   ZONE CONFIG
   ═══════════════════════════════════════════════════════════════════════════════ */

const ZONES = [
  { id: 'contacto',   name: 'CONTACTO',   sub: 'Empezar ahora',       icon: '▷', color: '#6D28D9', Component: CTA,           desc: 'Da el primer paso. Sin compromiso, respuesta en 24h.' },
  { id: 'vision',     name: 'VISIÓN',     sub: 'Nuestra filosofía',   icon: '◈', color: '#6C3BFF', Component: Manifesto,     desc: 'Descubre por qué existimos y qué nos mueve.' },
  { id: 'soluciones', name: 'SOLUCIONES', sub: 'Lo que hacemos',      icon: '⚡', color: '#A855F7', Component: Features,      desc: 'Todas las herramientas de automatización a tu servicio.' },
  { id: 'proceso',    name: 'PROCESO',    sub: 'Cómo trabajamos',     icon: '◉', color: '#7C3AED', Component: Proceso,       desc: 'Tres pasos claros para transformar tu empresa.' },
  { id: 'resultados', name: 'RESULTADOS', sub: 'Tu retorno real',     icon: '▦', color: '#8B5CF6', Component: ROICalculator, desc: 'Calcula cuánto puedes ahorrar. Números reales.' },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════════════ */

const CSS = `
@keyframes progressFill{0%{width:0}100%{width:100%}}
@keyframes flashOut{0%{opacity:.2}100%{opacity:0}}
@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   BOOT SPLASH
   ═══════════════════════════════════════════════════════════════════════════════ */

function BootSplash({ onDone }) {
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => setTimeout(onDone, 200) });
    tl.fromTo('.boot-logo', { opacity: 0, scale: .7, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: .6, ease: 'power3.out' }, 0);
    tl.fromTo('.boot-sub', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4 }, .35);
    tl.fromTo('.boot-bar-fill', { width: '0%' }, { width: '100%', duration: 1.2, ease: 'power1.inOut' }, .5);
    tl.to('.boot-ready', { opacity: 1, duration: .3 }, 1.7);
    tl.to('.boot-wrap', { opacity: 0, duration: .35 }, 2.1);
  }, [onDone]);

  return (
    <div className="boot-wrap fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: '#050508' }}>
      <div className="boot-logo text-center mb-6 select-none">
        <h1 className="text-4xl md:text-5xl font-bold tracking-[.15em]" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>
          <span className="text-white">SOM </span>
          <span style={{ color: '#A855F7', textShadow: '0 0 30px rgba(168,85,247,.8)' }}>SYNGULAR</span>
        </h1>
      </div>
      <div className="boot-sub text-purple-400/40 font-mono text-xs tracking-[.4em] uppercase mb-8">
        Cargando experiencia 3D
      </div>
      <div className="w-48 h-px bg-purple-900/30 rounded-full overflow-hidden mb-4">
        <div className="boot-bar-fill h-full rounded-full" style={{ width: 0, background: 'linear-gradient(90deg,#6C3BFF,#A855F7)' }} />
      </div>
      <div className="boot-ready font-mono text-[10px] tracking-widest opacity-0" style={{ color: '#A855F7' }}>
        SISTEMA LISTO
      </div>
      <button onClick={onDone} className="absolute bottom-6 right-8 font-mono text-[10px] text-purple-500/25 hover:text-purple-400 transition-colors">
        SKIP →
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ZONE VIEW — when user is inside a section
   ═══════════════════════════════════════════════════════════════════════════════ */

function ZoneView({ zone, onExit, onSwitch, allZones }) {
  const { Component } = zone;
  const idx = allZones.findIndex(z => z.id === zone.id);
  const prev = allZones[(idx - 1 + allZones.length) % allZones.length];
  const next = allZones[(idx + 1) % allZones.length];

  return (
    <div className="min-h-screen" style={{ background: '#0B0B12' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-2.5 backdrop-blur-md"
        style={{ borderBottom: `1px solid ${zone.color}25`, background: 'rgba(11,11,18,.92)' }}>
        <button onClick={onExit} className="font-mono text-sm hover:opacity-70 transition-opacity" style={{ color: zone.color }}>
          ← Lobby
        </button>
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-[.2em] text-sm" style={{ color: zone.color, textShadow: `0 0 14px ${zone.color}80` }}>
            {zone.name}
          </span>
          <span className="font-mono text-[10px] text-gray-500">{zone.sub}</span>
        </div>
        <div className="hidden md:flex items-center gap-5 font-mono text-[11px]">
          <button onClick={() => onSwitch(prev)} className="opacity-40 hover:opacity-100 transition-opacity" style={{ color: prev.color }}>← {prev.name}</button>
          <button onClick={() => onSwitch(next)} className="opacity-40 hover:opacity-100 transition-opacity" style={{ color: next.color }}>{next.name} →</button>
        </div>
      </div>

      {/* Corner brackets */}
      {[
        { cls: 'top-14 left-3', txt: '┌─\n│' },
        { cls: 'top-14 right-3 text-right', txt: '─┐\n  │' },
        { cls: 'bottom-12 left-3', txt: '│\n└─' },
        { cls: 'bottom-12 right-3 text-right', txt: '│\n  ─┘' },
      ].map(({ cls, txt }, i) => (
        <div key={i} className={`fixed ${cls} font-mono text-base leading-none opacity-[.1] pointer-events-none z-40 select-none whitespace-pre`}
          style={{ color: zone.color }}>{txt}</div>
      ))}

      {/* Content */}
      <div className="relative z-10"><Component /></div>

      {/* Bottom minimap */}
      <div className="sticky bottom-0 z-50 flex items-center justify-between px-4 md:px-6 py-2.5 backdrop-blur-md"
        style={{ borderTop: `1px solid ${zone.color}18`, background: 'rgba(11,11,18,.92)' }}>
        <span className="font-mono text-[10px] text-gray-600 hidden md:block">SOM SYNGULAR // {zone.sub.toUpperCase()}</span>
        <div className="flex items-center gap-1.5 mx-auto md:mx-0">
          {allZones.map(z => (
            <button key={z.id} title={`${z.name} — ${z.sub}`}
              onClick={() => z.id !== zone.id && onSwitch(z)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: z.id === zone.id ? 22 : 7, height: 7,
                borderRadius: z.id === zone.id ? 4 : '50%',
                background: z.id === zone.id ? z.color : `${z.color}35`,
                boxShadow: z.id === zone.id ? `0 0 10px ${z.color}` : 'none',
              }} />
          ))}
        </div>
        <button onClick={onExit} className="font-mono text-[10px] opacity-40 hover:opacity-80 transition-opacity hidden md:block" style={{ color: zone.color }}>
          ← Volver al lobby
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LOBBY HUD — 2D overlay on top of 3D scene
   ═══════════════════════════════════════════════════════════════════════════════ */

function LobbyHUD({ hoveredZone }) {
  const crosshairRef = useRef(null);

  useEffect(() => {
    // Expose a global method for FirstPersonRig to update crosshair pos
    window.__UPDATE_CROSSHAIR__ = (x, y) => {
      if (crosshairRef.current) {
        crosshairRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };
    return () => {
      delete window.__UPDATE_CROSSHAIR__;
    };
  }, []);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Crosshair — robotic targeting reticle (dynamic position) */}
      <div ref={crosshairRef} className="absolute top-0 left-0 transition-none will-change-transform" style={{ transform: 'translate(50vw, 50vh) translate(-50%, -50%)' }}>
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border border-purple-500/30" style={{ boxShadow: '0 0 15px rgba(168,85,247,0.15)' }}>
          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400/80" style={{ boxShadow: '0 0 6px rgba(168,85,247,0.8)' }} />
          {/* Cross lines */}
          <div className="absolute top-1/2 left-0 w-2 h-px bg-purple-500/40 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-2 h-px bg-purple-500/40 -translate-y-1/2" />
          <div className="absolute top-0 left-1/2 w-px h-2 bg-purple-500/40 -translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-px h-2 bg-purple-500/40 -translate-x-1/2" />
        </div>
      </div>

      {/* Top HUD */}
      <div className="flex items-start justify-between px-6 md:px-10 pt-4">
        <div className="font-mono space-y-0.5">
          <div className="text-[11px] text-purple-400/40">SOM SYNGULAR // ARM CONTROL</div>
          <div className="text-[9px] text-purple-500/20 tracking-wider">GRIPPER: READY</div>
        </div>
        <div className="hidden md:block text-center">
          <div className="font-mono text-[9px] tracking-[.5em] text-purple-400/25 uppercase">
            Mueve el ratón · Click para agarrar
          </div>
        </div>
        <div className="font-mono text-right space-y-0.5">
          <div className="text-[11px]" style={{ color: '#A855F7' }}>● Online</div>
          <div className="text-[9px] text-purple-500/20 tracking-wider">{ZONES.length} secciones</div>
        </div>
      </div>

      {/* Hovered zone info panel */}
      {hoveredZone && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="px-6 py-3 rounded-xl font-mono backdrop-blur-lg text-center"
            style={{ background: 'rgba(8,8,14,.9)', border: `1px solid ${hoveredZone.color}30`, boxShadow: `0 0 30px ${hoveredZone.color}15` }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg">{hoveredZone.icon}</span>
              <span className="text-sm font-bold tracking-[.15em]" style={{ color: hoveredZone.color }}>{hoveredZone.name}</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-1">{hoveredZone.desc}</p>
            <div className="text-[9px] tracking-wider" style={{ color: hoveredZone.color }}>CLICK para agarrar →</div>
          </div>
        </div>
      )}

      {/* Bottom HUD */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-6 md:px-10 pb-4 pointer-events-auto">
        <span className="font-mono text-[9px] text-purple-400/20 hidden md:block">
          Automatización inteligente para empresas modernas
        </span>
        <Link to="/" className="font-mono text-[10px] text-purple-400/25 hover:text-purple-300 transition-colors">
          ← Volver al sitio
        </Link>
      </div>

      {/* Corner brackets */}
      {[
        { p: 'top-11 left-5', c: '┌──' },
        { p: 'top-11 right-5', c: '──┐' },
        { p: 'bottom-10 left-5', c: '└──' },
        { p: 'bottom-10 right-5', c: '──┘' },
      ].map(({ p, c }) => (
        <div key={c} className={`absolute ${p} font-mono text-sm text-purple-500/[.07] select-none`}>{c}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INTRO OVERLAY — cinematic "TOMA TÚ EL CONTROL" text
   ═══════════════════════════════════════════════════════════════════════════════ */

function IntroOverlay() {
  useEffect(() => {
    const tl = gsap.timeline();

    // Fade in subtitle first
    tl.fromTo('.intro-sub', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.8);

    // Main text reveal
    tl.fromTo('.intro-title', { opacity: 0, scale: 0.85, y: 20 }, {
      opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, 1.4);

    // Glitch flicker on main text
    tl.to('.intro-title', { opacity: 0.3, duration: 0.05 }, 2.4);
    tl.to('.intro-title', { opacity: 1, duration: 0.05 }, 2.45);
    tl.to('.intro-title', { opacity: 0.5, duration: 0.04 }, 2.55);
    tl.to('.intro-title', { opacity: 1, duration: 0.05 }, 2.59);

    // Bottom hint
    tl.fromTo('.intro-hint', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.8);

    // Fade everything out before camera enters gripper
    tl.to('.intro-overlay-content', { opacity: 0, duration: 0.6, ease: 'power2.in' }, 3.8);

    return () => tl.kill();
  }, []);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center">
      <div className="intro-overlay-content text-center select-none">
        {/* Subtitle */}
        <div className="intro-sub font-mono text-[11px] md:text-xs tracking-[.5em] uppercase mb-4 opacity-0"
          style={{ color: '#A855F7' }}>
          SOM SYNGULAR // SISTEMA ACTIVADO
        </div>

        {/* Main title */}
        <h1 className="intro-title text-4xl md:text-6xl lg:text-7xl font-bold tracking-[.08em] leading-tight opacity-0"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#ffffff',
            textShadow: '0 0 60px rgba(168,85,247,0.6), 0 0 120px rgba(108,59,255,0.3)',
          }}>
          TOMA T<span style={{ color: '#A855F7' }}>Ú</span> EL CONTROL
        </h1>

        {/* Decorative line */}
        <div className="mx-auto mt-5 mb-3 w-32 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #A855F7, transparent)' }} />

        {/* Bottom hint */}
        <div className="intro-hint font-mono text-[10px] tracking-[.4em] uppercase opacity-0"
          style={{ color: '#6C3BFF80' }}>
          Preparando control manual...
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN GAME LOBBY
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function GameLobby() {
  const overlayRef = useRef(null);
  const zoneRef = useRef(null);

  const [phase, setPhase] = useState('boot');       // boot → intro → lobby → grabbing → zone
  const [hoveredId, setHoveredId] = useState(null);
  const [grabbedId, setGrabbedId] = useState(null);
  const [activeZone, setActiveZone] = useState(null);

  const hoveredZone = hoveredId ? ZONES.find(z => z.id === hoveredId) : null;

  // ── Crate clicked: start grab ──
  const handleCrateClick = useCallback((zone) => {
    if (phase !== 'lobby') return;
    setGrabbedId(zone.id);
    setPhase('grabbing');
  }, [phase]);

  // ── Camera dolly done → fade to zone ──
  const handleTransitionDone = useCallback(() => {
    // Fade overlay to black, then show zone
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          setActiveZone(ZONES.find(z => z.id === grabbedId));
          setPhase('zone');
          setGrabbedId(null);
          scrollTo({ top: 0 });

          // Fade zone in
          requestAnimationFrame(() => {
            if (zoneRef.current) {
              gsap.fromTo(zoneRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
            }
            if (overlayRef.current) {
              gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, delay: 0.1 });
            }
          });
        },
      });
    }
  }, [grabbedId]);

  // ── Exit zone → back to lobby ──
  const handleExitZone = useCallback(() => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.25,
        onComplete: () => {
          setActiveZone(null);
          setPhase('lobby');
          scrollTo({ top: 0 });

          requestAnimationFrame(() => {
            if (overlayRef.current) {
              gsap.to(overlayRef.current, { opacity: 0, duration: 0.4 });
            }
          });
        },
      });
    }
  }, []);

  // ── Switch between zones ──
  const handleSwitchZone = useCallback((zone) => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.2,
        onComplete: () => {
          setActiveZone(zone);
          scrollTo({ top: 0 });

          requestAnimationFrame(() => {
            if (zoneRef.current) {
              gsap.fromTo(zoneRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            }
            if (overlayRef.current) {
              gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
            }
          });
        },
      });
    }
  }, []);

  // ── Action button from mobile controller ──
  useEffect(() => {
    return subscribeAction(() => {
      if (hoveredId && phase === 'lobby') {
        const zone = ZONES.find(z => z.id === hoveredId);
        if (zone) handleCrateClick(zone);
      }
    });
  }, [hoveredId, phase, handleCrateClick]);

  return (
    <>
      <style>{CSS}</style>

      {/* ── BOOT ── */}
      {phase === 'boot' && <BootSplash onDone={() => setPhase('intro')} />}

      {/* ── 3D SCENE (always mounted when not booting or in zone) ── */}
      {phase !== 'boot' && phase !== 'zone' && (
        <div className="fixed inset-0 z-0">
          <LobbyScene
            zones={ZONES}
            hoveredId={hoveredId}
            grabbedId={grabbedId}
            onHover={setHoveredId}
            onClick={handleCrateClick}
            onTransitionDone={handleTransitionDone}
            introMode={phase === 'intro'}
            onIntroDone={() => setPhase('lobby')}
          />
        </div>
      )}

      {/* ── MOBILE VIRTUAL JOYSTICK ── */}
      {(phase === 'lobby' || phase === 'grabbing') && <MobileController />}

      {/* ── INTRO OVERLAY — "TOMA TÚ EL CONTROL" ── */}
      {phase === 'intro' && <IntroOverlay />}

      {/* ── 2D HUD OVERLAY ── */}
      {(phase === 'lobby' || phase === 'grabbing') && (
        <LobbyHUD hoveredZone={hoveredZone} />
      )}

      {/* ── ZONE CONTENT ── */}
      {phase === 'zone' && activeZone && (
        <div ref={zoneRef} className="relative z-30">
          <ZoneView
            zone={activeZone}
            onExit={handleExitZone}
            onSwitch={handleSwitchZone}
            allZones={ZONES}
          />
        </div>
      )}

      {/* ── TRANSITION OVERLAY (black fade) ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[80] pointer-events-none"
        style={{ background: '#050510', opacity: 0 }}
      />
      
      {/* ── CHATBOT GLOBAL ── */}
      <div className="relative z-[1000]">
        <Chatbot />
      </div>
    </>
  );
}
