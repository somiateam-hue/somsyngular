import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarModal from './CalendarModal';

const Navbar = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
          <div className="text-xl font-display font-bold tracking-tighter">
            SOM <span className="text-accent-neon">SYNGULAR</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            {['Soluciones', 'Casos', 'Tecnología', 'Proceso', 'Contacto'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-text-primary transition-all duration-300 hover:-translate-y-px"
              >
                {item}
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

          <button
            data-magnetic="0.25"
            onClick={() => setIsCalendarOpen(true)}
            className="px-5 py-2.5 bg-accent-neon hover:bg-primary text-white text-sm font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Agendar Demo
          </button>
        </div>
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
