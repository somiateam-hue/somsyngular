import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-gsap':    ['gsap'],
          'vendor-spline':  ['@splinetool/react-spline'],
          'vendor-shaders': ['@paper-design/shaders-react'],
          'vendor-three':   ['three', '@react-three/fiber', '@react-three/drei']
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
