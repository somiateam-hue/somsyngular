import { useState, Suspense, lazy } from 'react';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering }))
);

/**
 * DitheringCard — wraps any children in the animated dithering card shell.
 * Props:
 *   isHovered  — boolean, controls shader speed
 *   children   — content rendered inside the card
 *   className  — extra classes for the outer wrapper
 */
export function DitheringCard({ isHovered = false, children, className = '' }) {
  const [isMobile, setIsMobile] = useState(false);

  // Check window size on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
    }
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-[3rem] min-h-[600px] flex flex-col items-center justify-center ${className}`}
         style={{ border: '1px solid rgba(168,85,247,0.18)', background: 'rgba(17,17,27,0.85)' }}>

      {/* Dithering background solo en PC */}
      {!isMobile && (
        <Suspense fallback={<div className="absolute inset-0" style={{ background: 'rgba(17,17,27,0.5)' }} />}>
          <div className="absolute inset-0 z-0 pointer-events-none"
               style={{ opacity: 0.35, mixBlendMode: 'screen' }}>
            <Dithering
              colorBack="#00000000"
              colorFront="#A855F7"
              shape="warp"
              type="4x4"
              speed={isHovered ? 0.3 : 0.08}
              className="size-full"
              style={{ width: '100%', height: '100%' }}
              minPixelRatio={0.5}
            />
          </div>
        </Suspense>
      )}

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
