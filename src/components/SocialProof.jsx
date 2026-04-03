import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';
import CaseStudyModal from './CaseStudyModal';

gsap.registerPlugin(ScrollTrigger);

const SocialProof = () => {
  const { content } = useContent();
  const cases = content.casos.items;
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const clipRef    = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const clip  = clipRef.current;

      const getDistance = () => track.scrollWidth - clip.offsetWidth;

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="casos"
        className="bg-background-secondary"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        <div className="h-full flex flex-col">
          {/* Heading */}
          <div className="px-6 pt-16 pb-8 text-center flex-shrink-0">
            <h2 className="text-3xl font-display font-bold">Casos de Éxito</h2>
            <p className="text-text-secondary mt-2 text-sm">Haz clic para leer el caso completo →</p>
          </div>

          {/* Horizontal track */}
          <div ref={clipRef} className="flex-1 overflow-hidden flex items-center">
            <div
              ref={trackRef}
              className="flex gap-6 pl-6"
              style={{ willChange: 'transform' }}
            >
              {cases.map((project, index) => (
                <div
                  key={index}
                  onClick={() => setSelected(project)}
                  className="group relative rounded-[2rem] overflow-hidden cursor-pointer flex-shrink-0"
                  style={{ width: 'min(480px, 78vw)', height: '58vh' }}
                >
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-accent-neon text-sm font-mono mb-2 uppercase tracking-widest">{project.category}</p>
                    <h3 className="text-2xl font-display font-bold mb-4">{project.title}</h3>
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
                          style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
                      Leer caso completo →
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex-shrink-0 w-6" />
            </div>
          </div>
        </div>
      </section>

      <CaseStudyModal
        item={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default SocialProof;
