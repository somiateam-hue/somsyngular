import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Overview from './tabs/Overview';
import Leads from './tabs/Leads';
import ChatHistory from './tabs/ChatHistory';
import ContentEditor from './tabs/ContentEditor';
import PortfolioManager from './tabs/PortfolioManager';
import MeetingsManager from './tabs/MeetingsManager';
import Settings from './tabs/Settings';

const NAV = [
  { id: 'overview',   label: 'Overview',             icon: '📊' },
  { id: 'leads',      label: 'Leads',                icon: '📋' },
  { id: 'chats',      label: 'Chat History',         icon: '💬' },
  { id: 'meetings',   label: 'Agenda Citas',         icon: '🗓️' },
  { id: 'editor',     label: 'Editor de Contenido',  icon: '✏️' },
  { id: 'portfolio',  label: 'Portafolio IA',        icon: '🎨' },
  { id: 'settings',   label: 'Ajustes',              icon: '⚙️' },
];

export default function AdminLayout() {
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    supabase.auth.signOut();
    navigate('/admin');
  };

  const TABS = { overview: Overview, leads: Leads, chats: ChatHistory, meetings: MeetingsManager, editor: ContentEditor, portfolio: PortfolioManager, settings: Settings };
  const TabComponent = TABS[active];

  return (
    <div className="flex min-h-screen" style={{ background: '#0B0B12', color: '#F5F5FF' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300"
        style={{
          width: sidebarOpen ? 240 : 64,
          background: 'rgba(17,17,27,0.95)',
          borderRight: '1px solid rgba(168,85,247,0.15)',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'rgba(168,85,247,0.1)' }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {sidebarOpen && (
            <span className="font-display font-bold text-sm whitespace-nowrap">
              SOM <span style={{ color: '#A855F7' }}>SYNGULAR</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
              style={{
                background: active === item.id ? 'rgba(168,85,247,0.15)' : 'transparent',
                color: active === item.id ? '#A855F7' : 'rgba(245,245,255,0.6)',
                border: active === item.id ? '1px solid rgba(168,85,247,0.25)' : '1px solid transparent',
              }}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="py-4 px-2 space-y-1 border-t" style={{ borderColor: 'rgba(168,85,247,0.1)' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5"
            style={{ color: 'rgba(245,245,255,0.5)' }}
          >
            <span className="text-lg flex-shrink-0">🌐</span>
            {sidebarOpen && <span className="text-sm">Ver sitio</span>}
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-red-500/10"
            style={{ color: 'rgba(239,68,68,0.8)' }}
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {sidebarOpen && <span className="text-sm">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
          style={{
            background: 'rgba(11,11,18,0.9)',
            borderBottom: '1px solid rgba(168,85,247,0.1)',
            backdropFilter: 'blur(12px)',
          }}>
          <div>
            <h1 className="font-display font-bold text-xl text-white">
              {NAV.find(n => n.id === active)?.icon} {NAV.find(n => n.id === active)?.label}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(245,245,255,0.4)' }}>
              Panel de administración — SOM SYNGULAR
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Sistema activo
          </div>
        </header>

        {/* Tab content */}
        <div className="p-8">
          <TabComponent />
        </div>
      </main>
    </div>
  );
}
