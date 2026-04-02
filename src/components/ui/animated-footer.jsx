import React, { useEffect, useRef, useState } from 'react';

const AnimatedFooter = ({
  brand,
  columns = [],
  leftLinks = [],
  rightLinks = [],
  copyrightText,
  barCount = 23,
}) => {
  const waveRefs        = useRef([]);
  const footerRef       = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef(null);

  /* observe visibility */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => { if (footerRef.current) observer.unobserve(footerRef.current); };
  }, []);

  /* wave animation */
  useEffect(() => {
    let t = 0;
    const animate = () => {
      let offset = 0;
      waveRefs.current.forEach((el, i) => {
        if (el) {
          offset += Math.max(0, 20 * Math.sin((t + i) * 0.3));
          el.style.transform = `translateY(${i + offset}px)`;
        }
      });
      t += 0.1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    if (isVisible && window.innerWidth > 768) {
      animate();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isVisible]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      ref={footerRef}
      className="relative flex flex-col w-full select-none"
      style={{ background: '#07070e', color: '#F5F5FF' }}
    >
      {/* ── top grid ── */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* brand */}
          {brand && (
            <div className="space-y-4">
              <div className="text-xl font-display font-bold">
                {brand.name}
              </div>
              {brand.tagline && (
                <p className="text-sm leading-relaxed" style={{ color: '#A1A1B3' }}>
                  {brand.tagline}
                </p>
              )}
              {brand.status && (
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: '#A1A1B3' }}>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                  {brand.status}
                  <span>·</span>
                  <span>{brand.version}</span>
                </div>
              )}
            </div>
          )}

          {/* dynamic columns */}
          {columns.map((col, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: '#F5F5FF' }}>
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: '#A1A1B3' }}
                      onMouseEnter={e => e.target.style.color = '#A855F7'}
                      onMouseLeave={e => e.target.style.color = '#A1A1B3'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── bottom bar ── */}
        <div className="pt-10 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
             style={{ borderColor: 'rgba(168,85,247,0.1)' }}>

          {/* left links */}
          <ul className="flex flex-wrap gap-4">
            {leftLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="text-sm transition-colors duration-200"
                  style={{ color: '#A1A1B3' }}
                  onMouseEnter={e => e.target.style.color = '#A855F7'}
                  onMouseLeave={e => e.target.style.color = '#A1A1B3'}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* copyright */}
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#A1A1B3' }}>
            <svg className="w-3 h-3" viewBox="0 0 80 80" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M67.4307 11.5693C52.005 -3.85643 26.995 -3.85643 11.5693 11.5693C-3.85643 26.995 -3.85643 52.005 11.5693 67.4307C26.995 82.8564 52.005 82.8564 67.4307 67.4307C82.8564 52.005 82.8564 26.995 67.4307 11.5693ZM17.9332 17.9332C29.8442 6.02225 49.1558 6.02225 61.0668 17.9332C72.9777 29.8442 72.9777 49.1558 61.0668 61.0668C59.7316 62.4019 58.3035 63.5874 56.8032 64.6232L56.8241 64.6023C46.8657 54.6439 46.8657 38.4982 56.8241 28.5398L58.2383 27.1256L51.8744 20.7617L50.4602 22.1759C40.5018 32.1343 24.3561 32.1343 14.3977 22.1759L14.3768 22.1968C15.4126 20.6965 16.5981 19.2684 17.9332 17.9332ZM34.0282 38.6078C25.6372 38.9948 17.1318 36.3344 10.3131 30.6265C7.56889 39.6809 9.12599 49.76 14.9844 57.6517L34.0282 38.6078ZM21.3483 64.0156C29.24 69.874 39.3191 71.4311 48.3735 68.6869C42.6656 61.8682 40.0052 53.3628 40.3922 44.9718L21.3483 64.0156Z"
              />
            </svg>
            {copyrightText}
          </p>

          {/* right links + back to top */}
          <div className="flex flex-wrap items-center gap-4">
            {rightLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ color: '#A1A1B3' }}
                onMouseEnter={e => e.target.style.color = '#A855F7'}
                onMouseLeave={e => e.target.style.color = '#A1A1B3'}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={scrollTop}
              className="text-sm transition-colors duration-200 hover:underline"
              style={{ color: '#A1A1B3' }}
              onMouseEnter={e => e.target.style.color = '#A855F7'}
              onMouseLeave={e => e.target.style.color = '#A1A1B3'}
            >
              ↑ Volver arriba
            </button>
          </div>
        </div>
      </div>

      {/* ── wave bars ── */}
      <div aria-hidden="true" style={{ overflow: 'hidden', height: 200 }}>
        <div>
          {Array.from({ length: barCount }).map((_, i) => (
            <div
              key={i}
              ref={el => { waveRefs.current[i] = el; }}
              style={{
                height: `${i + 1}px`,
                background: `linear-gradient(90deg, #6C3BFF, #A855F7)`,
                transition: 'transform 0.1s ease',
                willChange: 'transform',
                marginTop: '-2px',
                opacity: 0.6 + (i / barCount) * 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default AnimatedFooter;
