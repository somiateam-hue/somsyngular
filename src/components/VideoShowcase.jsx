import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VideoShowcase = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-12">

        <div className="text-center space-y-4">
          <p className="text-accent-neon font-mono text-xs tracking-widest uppercase">En acción</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold">Vélo por ti mismo</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Así de fluido trabaja nuestra tecnología. Automatización real, resultados reales.
          </p>
        </div>

        <div
          ref={wrapperRef}
          className="relative rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(108,59,255,0.25)] border border-white/10"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-primary/30 pointer-events-none z-10" />

          <video
            className="w-full h-auto block"
            src="/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>

      </div>
    </section>
  );
};

export default VideoShowcase;
