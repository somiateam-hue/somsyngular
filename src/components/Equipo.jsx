import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin } from 'lucide-react';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

const Equipo = () => {
  const sectionRef = useRef(null);
  const { content } = useContent();
  const { members } = content.equipo;
  const e = content.equipo;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-card', {
        y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
        <h2 data-clip className="text-4xl md:text-5xl font-display font-bold">{e.title}</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">{e.subtitle}</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member, i) => (
          <div key={i} className="team-card glass rounded-[2rem] p-8 border border-white/10 bg-background-secondary hover:border-accent-neon/30 transition-colors group">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-6 mx-auto border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 duration-500"
                style={{ transition: 'filter 500ms ease', willChange: 'filter' }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-display font-bold">{member.name}</h3>
              <p className="text-accent-neon text-sm font-medium">{member.role}</p>
              <p className="text-text-secondary text-sm pt-4 leading-relaxed">{member.desc}</p>
              {member.linkedin && (
                <div className="pt-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-neon transition-colors"
                  >
                    <Linkedin size={14} />
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Equipo;
