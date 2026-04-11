'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Shield, Sparkles } from 'lucide-react';
import { usePortal } from '@/context/PortalContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatToolbar() {
  const { chatTrigger, clearTrigger } = usePortal();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Dobro došli! Ja sam vaš AI turistički informator. Kako vam mogu pomoći u istraživanju Požege?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      document.body.classList.add('chat-active');
    } else {
      document.body.classList.remove('chat-active');
    }
  }, [isChatOpen]);

  // Handle triggers from header buttons
  useEffect(() => {
    if (chatTrigger) {
      handleDirectSubmit(chatTrigger);
      clearTrigger();
      setIsChatOpen(true);
    }
  }, [chatTrigger]);

  const handleDirectSubmit = async (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oprostite, došlo je do smetnji.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setIsChatOpen(true);
    handleDirectSubmit(input);
    setInput('');
  };

  return (
    <div className={`chat-toolbar-container ${isChatOpen ? 'expanded' : ''}`}>
      {isChatOpen && (
        <div className="chat-history glass-panel">
          <div className="messages-list" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                <div className="message-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && <div className="message-row assistant"><div className="message-bubble typing">Informator razmišlja...</div></div>}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      <div className="toolbar-main glass-panel">
        <div className="toolbar-left" onClick={() => setIsChatOpen(!isChatOpen)}>
          <div className="trenk-stylized">
            <Shield size={24} color="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
          </div>
          <div className="trenk-info">
            <span className="trenk-name">AI INFORMATOR</span>
            <span className="trenk-status">TURISTIČKI VODIČ</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="toolbar-input-area">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pitajte nas nešto o Požegi..."
            className="toolbar-input"
            onFocus={() => setIsChatOpen(true)}
          />
          <button type="submit" className="toolbar-send-btn" disabled={isLoading}>
            <Sparkles size={18} />
            <span>PITAJ</span>
          </button>
        </form>

        <div className="toolbar-right">
          <button className="toggle-chat-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
            {isChatOpen ? 'Zatvori' : 'Povijest'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-toolbar-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 1500;
          isolation: isolate;
          transition: transform 0.3s ease;
        }
        .chat-history {
          margin: 0 auto 1rem;
          width: 90%;
          max-width: 800px;
          height: 350px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .messages-list {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message-row { display: flex; max-width: 85%; }
        .message-row.user { align-self: flex-end; }
        .message-bubble { 
          padding: 0.75rem 1.25rem; 
          border-radius: 12px; 
          font-size: 0.95rem; 
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
        }
        .user .message-bubble { 
          background: var(--primary); 
          color: white; 
          border: none;
        }
        .typing { font-style: italic; color: #94a3b8; }

        .toolbar-main {
          margin: 0 auto;
          width: 95%;
          max-width: 1100px;
          height: 70px;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 1.5rem;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom: none;
        }
        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          min-width: 180px;
        }
        .trenk-stylized {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .trenk-info { display: flex; flex-direction: column; }
        .trenk-name { font-weight: 800; font-size: 0.85rem; letter-spacing: 1px; color: #f59e0b; }
        .trenk-status { font-size: 0.65rem; color: #64748b; font-weight: 600; }

        .toolbar-input-area {
          flex: 1;
          display: flex;
          gap: 0.75rem;
        }
        .toolbar-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0 1.25rem;
          color: white;
          outline: none;
          height: 45px;
          transition: border-color 0.2s;
        }
        .toolbar-input:focus { border-color: var(--primary); }
        .toolbar-send-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .toolbar-send-btn:hover { transform: scale(1.02); }
        .toolbar-right { display: flex; align-items: center; }
        .toggle-chat-btn {
          background: none;
          border: 1px solid var(--glass-border);
          color: #94a3b8;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
