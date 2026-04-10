'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Shield, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Moj naklon! Ja sam Barun Franjo Trenk. Čime vam mogu poslužiti u mojoj Zlatnoj Dolini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
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
      } else {
        throw new Error(data.error || 'Pogreška');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oprostite, moji panduri javljaju da je došlo do smetnji u komunikaciji.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {isOpen ? (
        <div className="chat-window glass-panel">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="avatar-shield">
                <Shield size={18} color="#f59e0b" />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>Barun Trenk</h4>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#10b981' }}>● Na usluzi</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <X size={20} />
            </button>
          </div>

          <div className="messages-list" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                <div className="avatar-small">
                  {msg.role === 'assistant' ? <Shield size={14} /> : <User size={14} />}
                </div>
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-row assistant">
                <div className="message-bubble typing">Barun razmišlja...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="chat-input-area">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Postavite pitanje Barunu..."
              className="chat-input"
            />
            <button type="submit" className="send-btn" disabled={isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="chat-trigger glass-panel">
          <MessageSquare size={24} />
          <span className="trigger-text">Pitaj Baruna</span>
        </button>
      )}

      <style jsx>{`
        .chat-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }
        .chat-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          color: white;
          border-radius: 99px;
          transition: transform 0.2s;
        }
        .chat-trigger:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.08);
        }
        .chat-window {
          width: 380px;
          height: 500px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .chat-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(59, 130, 246, 0.05);
        }
        .avatar-shield {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }
        .messages-list {
          flex: 1;
          padding: 1.25rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message-row {
          display: flex;
          gap: 0.75rem;
          max-width: 85%;
        }
        .message-row.user {
          flex-direction: row-reverse;
          align-self: flex-end;
        }
        .avatar-small {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.4;
          background: rgba(255,255,255,0.05);
        }
        .user .message-bubble {
          background: var(--primary);
          color: white;
        }
        .chat-input-area {
          padding: 1rem;
          border-top: 1px solid var(--glass-border);
          display: flex;
          gap: 0.5rem;
        }
        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 0.6rem 1rem;
          color: white;
          font-size: 0.9rem;
          outline: none;
        }
        .send-btn {
          background: var(--primary);
          border: none;
          color: white;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .typing {
          font-style: italic;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
