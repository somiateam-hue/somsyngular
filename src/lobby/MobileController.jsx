// src/lobby/MobileController.jsx
import { useEffect, useRef, useState } from 'react';

// Global state for joystick
export const joystickState = { x: 0, y: 0, active: false };

// Action dispatcher
export const subscribeAction = (callback) => {
  window.addEventListener('lobby-action-grab', callback);
  return () => window.removeEventListener('lobby-action-grab', callback);
};

export const triggerAction = () => {
  window.dispatchEvent(new Event('lobby-action-grab'));
};

export default function MobileController() {
  const stickRef = useRef(null);
  const baseRef = useRef(null);
  
  const handleTouchStart = (e) => {
    joystickState.active = true;
    handleTouchMove(e);
  };
  
  const handleTouchMove = (e) => {
    // Prevent scrolling
    if (e.cancelable) e.preventDefault();
    if (!baseRef.current || !stickRef.current) return;
    
    const touch = e.touches[0];
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const maxDist = rect.width / 2;
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    
    stickRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    
    // Normalize to -1 to 1
    const vx = dx / maxDist;
    const vy = -(dy / maxDist); // Invert Y so up is positive
    
    joystickState.x = vx;
    joystickState.y = vy;
    
    // Update globals for R3F
    window.__JOYSTICK_X__ = vx;
    window.__JOYSTICK_Y__ = vy;
    window.__JOYSTICK_ACTIVE__ = true;
  };
  
  const handleTouchEnd = () => {
    joystickState.active = false;
    joystickState.x = 0;
    joystickState.y = 0;
    
    window.__JOYSTICK_ACTIVE__ = false;
    
    if (stickRef.current) {
      stickRef.current.style.transform = `translate(0px, 0px)`;
    }
  };

  const [hasTouch, setHasTouch] = useState(false);
  useEffect(() => {
    setHasTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!hasTouch) return null; // Only render on touch devices

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-end justify-between px-6 pb-20 md:hidden overflow-hidden touch-none">
      {/* Joystick Base */}
      <div 
        ref={baseRef}
        className="w-28 h-28 rounded-full border-2 border-purple-500/30 bg-purple-900/20 backdrop-blur-md relative flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(168,85,247,0.15)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ touchAction: 'none' }} // Ensure no scrolling
      >
        <div className="absolute w-8 h-8 rounded-full border border-purple-500/20" />
        {/* Joystick Stick */}
        <div 
          ref={stickRef}
          className="w-12 h-12 rounded-full bg-purple-500/60 border border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-transform duration-75"
        />
      </div>

      {/* Action Button */}
      <button 
        className="w-24 h-24 rounded-full bg-purple-600/30 border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center active:scale-95 active:bg-purple-500/50 transition-all pointer-events-auto touch-none"
        onClick={triggerAction}
        style={{ touchAction: 'none' }}
      >
        <div className="font-mono text-xs font-bold text-white tracking-widest text-center">
          <span className="block text-[10px] text-purple-300 opacity-70 mb-0.5">CLICK</span>
          AGARRAR
        </div>
      </button>
    </div>
  );
}
