import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GSAPEffects = () => {
  useEffect(() => {
    const magneticCleanups = [];

    const ctx = gsap.context(() => {
      // ── 1. Scroll Progress Bar ─────────────────────────────────────────────
      gsap.to('#scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0,
        },
      });

      // ── 2. Navbar scroll effect ────────────────────────────────────────────
      ScrollTrigger.create({
        start: 80,
        end: 99999,
        onEnter: () => document.getElementById('main-nav')?.classList.add('nav-scrolled'),
        onLeaveBack: () => document.getElementById('main-nav')?.classList.remove('nav-scrolled'),
      });

      // ── 3. Universal batch entrance on .glass cards ────────────────────────
      // Exclude already-individually-animated cards
      ScrollTrigger.batch('.glass:not(.team-card):not(.sticky-card)', {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        },
        start: 'top 88%',
        once: true,
      });

      // ── 4. Clip-reveal on [data-clip] elements ─────────────────────────────
      gsap.utils.toArray('[data-clip]').forEach(el => {
        gsap.fromTo(el,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      // ── 5. Parallax on [data-parallax] elements ────────────────────────────
      gsap.utils.toArray('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        gsap.to(el, {
          y: () => -80 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      });

      // ── 6. Magnetic cursor on [data-magnetic] elements ─────────────────────
      gsap.utils.toArray('[data-magnetic]').forEach(el => {
        const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3;

        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        magneticCleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    });

    return () => {
      ctx.revert();
      magneticCleanups.forEach(fn => fn());
    };
  }, []);

  return null;
};

export default GSAPEffects;
