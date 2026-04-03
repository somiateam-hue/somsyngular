import React, { useState, useEffect } from 'react';
import { subscribeChats } from '../../lib/firestoreDB';

export default function ChatHistory() {
  const [chatSessions, setChatSessions] = useState([]);
  const [expanded, setExpanded]         = useState(null);

  useEffect(() => {
    const unsub = subscribeChats(setChatSessions);
    return unsub;
  }, []);

  const sorted = chatSessions;

  if (sorted.length === 0) {
    return (
      <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.1)' }}>
        <p className="text-4xl mb-3">💬</p>
        <p className="text-white font-medium">No hay conversaciones todavía</p>
        <p className="text-sm mt-1" style={{ color: 'rgba(245,245,255,0.4)' }}>
          Cuando alguien use el chatbot, las sesiones aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((session, i) => {
        const isOpen = expanded === session.id;
        const userMessages = session.messages?.filter(m => m.role === 'user') || [];
        const date = session.startTime ? new Date(session.startTime).toLocaleString('es-ES') : '—';

        return (
          <div key={session.id || i} className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(17,17,27,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>
            {/* Session header */}
            <button
              onClick={() => setExpanded(isOpen ? null : session.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                  style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
                  💬
                </div>
                <div>
                  <p className="font-medium text-white text-sm">
                    Sesión — {session.messages?.length || 0} mensaje{session.messages?.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(245,245,255,0.4)' }}>{date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(168,85,247,0.15)', color: '#A855F7' }}>
                  {userMessages.length} preguntas
                </span>
                <span style={{ color: 'rgba(245,245,255,0.4)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  ▼
                </span>
              </div>
            </button>

            {/* Conversation */}
            {isOpen && (
              <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="pt-4 space-y-3 max-h-96 overflow-y-auto">
                  {session.messages?.map((msg, j) => (
                    <div key={j} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                        style={msg.role === 'user'
                          ? { background: 'linear-gradient(135deg,#6C3BFF,#A855F7)', color: '#fff', borderBottomRightRadius: 4 }
                          : { background: 'rgba(255,255,255,0.06)', color: '#F5F5FF', borderBottomLeftRadius: 4 }
                        }
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
