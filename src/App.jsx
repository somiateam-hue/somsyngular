import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public site — crítico, carga inmediata
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import SocialProof   from './components/SocialProof';
import Features      from './components/Features';
import ROICalculator from './components/ROICalculator';
import Manifesto     from './components/Manifesto';
import VideoShowcase    from './components/VideoShowcase';
import PortfolioSection from './components/PortfolioSection';
import Proceso          from './components/Proceso';
import Equipo        from './components/Equipo';
import TrustSection  from './components/TrustSection';
import CTA           from './components/CTA';
import Footer        from './components/Footer';
import Chatbot       from './components/Chatbot';
import GSAPEffects   from './components/GSAPEffects';

// Rutas pesadas — lazy (no se descargan hasta que el usuario navega ahí)
const GameLobby   = lazy(() => import('./lobby/GameLobby'));
const AdminLogin  = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const PrivateRoute = lazy(() => import('./admin/PrivateRoute'));

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0B0B12' }}>
    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#A855F7', borderTopColor: 'transparent' }} />
  </div>
);

function PublicSite() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-accent-neon selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <ROICalculator />
        <Manifesto />
        <VideoShowcase />
        <PortfolioSection />
        <Proceso />
        <Equipo />
        <TrustSection />
        <CTA />
      </main>
      <Footer />
      <Chatbot />
      <GSAPEffects />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"               element={<PublicSite />} />
        <Route path="/lobby"          element={<GameLobby />} />
        <Route path="/admin"          element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
