'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, MicOff } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: '🍽 Gdje jesti?', query: 'Preporuči mi beste restorane, kafiće i vinarije u Požegi.' },
  { label: '🏛 Što posjetiti?', query: 'Koje su najvažnije znamenitosti i atrakcije koje moram vidjeti u Požegi?' },
  { label: '📅 Događanja', query: 'Kakva su događanja i manifestacije planirane u Požegi?' },
  { label: '🌿 Priroda', query: 'Koje su mogućnosti za rekreaciju, biciklizam i boravak u prirodi oko Požege?' },
  { label: '🏨 Smještaj', query: 'Gdje mogu odsjesti u Požegi? Koje smještajne mogućnosti postoje?' },
  { label: '🗺 Upoznaj grad', query: 'Reci mi nešto o povijesti i kulturi grada Požege i Zlatne doline.' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function InlineChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicSupported(false); return; }
    const rec = new SR();
    rec.lang = 'hr-HR';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oprostite, došlo je do greške u komunikaciji.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="inline-chat-wrapper">
      {/* Quick prompt chips */}
      <div className="quick-prompts-bar">
        {QUICK_PROMPTS.map((p, i) => (
          <button
            key={i}
            className="prompt-chip"
            onClick={() => sendMessage(p.query)}
            disabled={isLoading}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat box */}
      <div className="chat-body glass-panel">
        {messages.length === 0 && !isLoading ? (
          <div className="welcome-screen">
            <div className="welcome-card">
              <p className="welcome-eyebrow">TURISTIČKI AI INFORMATOR</p>
              <h2 className="welcome-title">Dobrodošli u Zlatnu Dolinu</h2>
              <p className="welcome-sub">
                Pitajte me o znamenitostima, gastro ponudi, smještaju, događanjima ili putovanju u Požegu i okolicu.
              </p>
              <p className="welcome-hint">↑ Odaberite temu iznad ili napišite pitanje dolje</p>
            </div>
          </div>
        ) : (
          <div className="messages-area">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="bot-avatar">TZ</div>
                )}
                <div className="msg-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="msg-row assistant">
                <div className="bot-avatar">TZ</div>
                <div className="msg-bubble typing-indicator">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input row */}
      <div className="chat-input-row">
        {micSupported && (
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleMic}
            title={isListening ? 'Zaustavi mikrofon' : 'Govori'}
            type="button"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Pitajte nas nešto o Požegi i Zlatnoj dolini..."
          className="chat-text-input"
          disabled={isLoading}
        />
        <button
          className="send-btn"
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          type="button"
        >
          <Sparkles size={18} />
          <span>PITAJ</span>
        </button>
      </div>

      <style jsx>{`
        .inline-chat-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 12px;
          padding: 16px 20px 20px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        /* ===== QUICK PROMPTS ===== */
        .quick-prompts-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .prompt-chip {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(245,158,11,0.35);
          border-radius: 20px;
          color: #e2e8f0;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .prompt-chip:hover:not(:disabled) {
          background: rgba(245,158,11,0.15);
          border-color: #f59e0b;
          color: #f59e0b;
          transform: translateY(-1px);
        }
        .prompt-chip:disabled {
          opacity: 0.5;
          cursor: default;
        }

        /* ===== CHAT BOX ===== */
        .chat-body {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(8, 12, 22, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .welcome-screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .welcome-card {
          text-align: center;
          max-width: 520px;
        }
        .welcome-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 3px;
          color: #f59e0b;
          margin-bottom: 0.75rem;
        }
        .welcome-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.75rem;
          text-shadow: 0 4px 20px rgba(0,0,0,0.6);
        }
        .welcome-sub {
          font-size: 1rem;
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .welcome-hint {
          font-size: 0.8rem;
          color: #94a3b8;
          font-style: italic;
        }

        /* ===== MESSAGES ===== */
        .messages-area {
          flex: 1;
          padding: 1.25rem 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          max-width: 88%;
        }
        .msg-row.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .msg-row.assistant {
          align-self: flex-start;
        }

        .bot-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 900;
          color: #0a0c10;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .msg-bubble {
          padding: 11px 16px;
          border-radius: 14px;
          font-size: 0.93rem;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .assistant .msg-bubble {
          background: rgba(255,255,255,0.10);
          color: #f1f5f9;
          border: 1px solid rgba(255,255,255,0.12);
          border-left: 3px solid #f59e0b;
          border-radius: 2px 14px 14px 14px;
        }
        .user .msg-bubble {
          background: var(--primary);
          color: white;
          border-radius: 14px 14px 2px 14px;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 14px 16px;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          display: inline-block;
          animation: dot-bounce 1.3s infinite ease-in-out;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* ===== INPUT ROW ===== */
        .chat-input-row {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
          background: rgba(8, 12, 22, 0.92);
          padding: 12px 16px;
          border-radius: 0 0 16px 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: -1px;
        }
        .mic-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .mic-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .mic-btn.listening {
          background: rgba(239,68,68,0.2);
          border-color: rgba(239,68,68,0.5);
          color: #ef4444;
          animation: mic-pulse 1s infinite ease-in-out;
        }
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        .chat-text-input {
          flex: 1;
          height: 48px;
          padding: 0 1.25rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .chat-text-input::placeholder { color: #475569; }
        .chat-text-input:focus { border-color: rgba(245,158,11,0.6); }
        .chat-text-input:disabled { opacity: 0.6; }
        .send-btn {
          height: 48px;
          padding: 0 1.5rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          border-radius: 12px;
          color: #0a0c10;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.4); }
        .send-btn:disabled { opacity: 0.4; cursor: default; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 640px) {
          .inline-chat-wrapper { padding: 10px 12px 14px; gap: 8px; }
          .quick-prompts-bar { gap: 6px; }
          .prompt-chip { font-size: 12px; padding: 6px 12px; }
          .welcome-title { font-size: 1.5rem; }
          .welcome-sub { font-size: 0.9rem; }
          .send-btn span { display: none; }
          .send-btn { padding: 0 1rem; }
        }
      `}</style>
    </div>
  );
}
