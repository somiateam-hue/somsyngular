import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CalendarModal from './CalendarModal';

const navLinks = [
  { label: 'Soluciones', href: '#tecnologia' },
  { label: 'Casos',      href: '#casos' },
  { label: 'Tecnología', href: '#tecnologia' },
  { label: 'Proceso',    href: '#proceso' },
  { label: 'Contacto',   href: '#contacto' },
];

const Navbar = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen]         = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        id="scroll-progress"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #6C3BFF, #A855F7)',
          transformOrigin: 'left center', transform: 'scaleX(0)', zIndex: 100,
        }}
      />

      <nav id="main-nav" className="fixed top-0 left-0 w-full z-50 border-b border-border-sutil glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Brand */}
          <div className="text-xl font-display font-bold tracking-tighter">
            SOM <span className="text-accent-neon">SYNGULAR</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-text-primary transition-all duration-300 hover:-translate-y-px"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/lobby"
              className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:-translate-y-px"
              style={{ color: '#A855F7', textShadow: '0 0 10px rgba(168,85,247,0.5)' }}
            >
              <span>◈</span>
              <span>LOBBY</span>
            </Link>
          </div>

          {/* Desktop CTA */}
          <button
            data-magnetic="0.25"
            onClick={() => setIsCalendarOpen(true)}
            className="hidden md:block px-5 py-2.5 bg-accent-neon hover:bg-primary text-white text-sm font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Agendar Demo
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setIsMenuOpen(o => !o)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-border-sutil px-6 py-5 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="block py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors border-b border-white/5 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/lobby"
              onClick={closeMenu}
              className="flex items-center gap-1.5 py-3 font-mono text-xs tracking-widest uppercase border-b border-white/5"
              style={{ color: '#A855F7' }}
            >
              <span>◈</span>
              <span>LOBBY</span>
            </Link>
            <div className="pt-4">
              <button
                onClick={() => { closeMenu(); setIsCalendarOpen(true); }}
                className="w-full py-3 bg-accent-neon text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                Agendar Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        calendlyUrl="https://calendly.com/"
      />
    </>
  );
};

export default Navbar;
