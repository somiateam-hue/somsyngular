import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Manifesto = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current.innerText.split(' ');
      textRef.current.innerHTML = words.map(word => `<span class="inline-block mr-3 opacity-0 translate-y-8">${word}</span>`).join(' ');
      
      gsap.to(textRef.current.querySelectorAll('span'), {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 bg-background relative overflow-hidden">
      {/* Background texture element */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div data-parallax="0.4" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <p className="text-accent-neon font-mono text-sm tracking-widest mb-8 uppercase">Nuestra Filosofía</p>
        
        <p className="text-2xl md:text-3xl text-text-secondary mb-8">
          "La mayoría de las empresas implementa herramientas."
        </p>
        
        <h2 
          ref={textRef} 
          className="text-5xl md:text-8xl font-serif italic text-text-primary leading-[1.1]"
        >
          Nosotros diseñamos <span className="text-gradient">sistemas inteligentes</span> que trabajan solos.
        </h2>
      </div>
    </section>
  );
};

export default Manifesto;
