'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';
import { Utensils, MapPin, Calendar, Compass } from 'lucide-react';

const THEMES = [
  { label: 'Gdje jesti?', icon: <Utensils size={18} />, query: 'Preporuči mi najbolje restorane i vinarije u Požegi.' },
  { label: 'Što posjetiti?', icon: <MapPin size={18} />, query: 'Koje su najvažnije znamenitosti koje moram vidjeti?' },
  { label: 'Događanja', icon: <Calendar size={18} />, query: 'Kakva su događanja i manifestacije planirane u Požegi?' },
  { label: 'Upoznaj grad', icon: <Compass size={18} />, query: 'Reci mi nešto više o povijesti i kulturi grada Požege.' },
];

export default function HeaderThemes() {
  const { triggerChat } = usePortal();

  return (
    <div className="header-themes">
      {THEMES.map((theme, i) => (
        <button 
          key={i} 
          className="theme-btn glass-panel"
          onClick={() => triggerChat(theme.query)}
        >
          {theme.icon}
          <span>{theme.label}</span>
        </button>
      ))}

      <style jsx>{`
        .header-themes {
          display: flex;
          gap: 1rem;
          flex: 1;
          justify-content: center;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 0.5rem 0;
        }
        .header-themes::-webkit-scrollbar {
          display: none;
        }
        .theme-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 99px;
          color: white;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .theme-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 0 20px var(--primary-glow);
        }
        @media (max-width: 768px) {
          .header-themes {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
