/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0B12',
          secondary: '#11111B',
        },
        primary: {
          DEFAULT: '#6C3BFF',
          dark: '#5a2fd1',
        },
        accent: {
          neon: '#A855F7',
        },
        text: {
          primary: '#F5F5FF',
          secondary: '#A1A1B3',
        },
        border: {
          sutil: 'rgba(168,85,247,0.15)',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6C3BFF 0%, #A855F7 100%)',
      },
      borderRadius: {
        'section': '2.5rem',
      },
      animation: {
        'orbit': 'orbit 20s linear infinite',
        'marquee-linear': 'marquee-linear 40s linear infinite',
        'marquee-linear-reverse': 'marquee-linear-reverse 40s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        'marquee-linear': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-linear-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      }
    },
  },
  plugins: [],
}
