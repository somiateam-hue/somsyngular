import React, { useState, useRef, useEffect } from 'react';
import { saveChat } from '../lib/firestoreDB';

const WEBHOOK_URL  = import.meta.env.VITE_WEBHOOK_CHAT;
const sessionId    = crypto.randomUUID();
const sessionStart = new Date().toISOString();

function saveSession(messages) {
  saveChat(sessionId, sessionStart, messages).catch(() => {});
}

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
    style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
    SS
  </div>
);

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span key={i} className="w-2 h-2 rounded-full bg-purple-400"
        style={{ animation: `chatBounce 1s ease-in-out ${i * 0.2}s infinite` }} />
    ))}
  </div>
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy el asistente de SOM SYNGULAR 🤖\n¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });

      let botText = 'Lo siento, no pude procesar tu solicitud.';
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          botText = data.output || data.message || data.text || data.reply ||
            (typeof data === 'string' ? data : JSON.stringify(data));
        }
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
      setMessages(prev => {
        const next = [...prev, { role: 'bot', text: botText }];
        saveSession(next);
        return next;
      });
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '⚠️ No pude conectarme ahora mismo. Por favor intenta en unos segundos.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label="Abrir chatbot"
        className="fixed bottom-6 right-6 z-[1000] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg,#6C3BFF,#A855F7)',
          animation: !open ? 'chatPulse 2s infinite' : 'none',
        }}
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.09-3.27A7.65 7.65 0 013 12C3 7.582 7.03 4 12 4s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          id="chatbot-panel"
          className="chat-open fixed bottom-24 right-6 z-[999] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            background: 'rgba(17,17,27,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168,85,247,0.25)',
            maxHeight: '70vh',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
            style={{ background: 'linear-gradient(135deg,rgba(108,59,255,0.3),rgba(168,85,247,0.2))' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}>
              SS
            </div>
            <div>
              <p className="text-sm font-bold text-white">Asistente SOM SYNGULAR</p>
              <p className="text-xs flex items-center gap-1" style={{ color: '#34d399' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                En línea
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 280 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && <BotAvatar />}
                <div
                  className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={msg.role === 'user'
                    ? { background: 'linear-gradient(135deg,#6C3BFF,#A855F7)', color: '#fff', borderBottomRightRadius: 4 }
                    : { background: 'rgba(255,255,255,0.06)', color: '#F5F5FF', borderBottomLeftRadius: 4 }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <BotAvatar />
                <div className="rounded-2xl" style={{ background:'rgba(255,255,255,0.06)', borderBottomLeftRadius:4 }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10 flex gap-2 items-center">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu mensaje..."
              className="flex-1 resize-none bg-transparent outline-none text-sm placeholder-white/30 text-white max-h-24 overflow-auto"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#6C3BFF,#A855F7)' }}
              aria-label="Enviar"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.769 59.769 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
