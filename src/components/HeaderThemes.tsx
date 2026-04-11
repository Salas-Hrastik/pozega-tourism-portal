'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';
import { Utensils, MapPin, Calendar, Compass } from 'lucide-react';

const THEMES = [
  { label: 'Gdje jesti?', icon: <Utensils size={14} />, query: 'Preporuči mi najbolje restorane i vinarije u Požegi.' },
  { label: 'Što posjetiti?', icon: <MapPin size={14} />, query: 'Koje su najvažnije znamenitosti koje moram vidjeti?' },
  { label: 'Događanja', icon: <Calendar size={14} />, query: 'Kakva su događanja i manifestacije planirane u Požegi?' },
  { label: 'Upoznaj grad', icon: <Compass size={14} />, query: 'Reci mi nešto više o povijesti i kulturi grada Požege.' },
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
          gap: 0.75rem;
          flex: 1;
          justify-content: center;
        }
        .theme-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 99px;
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .theme-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: var(--primary);
          color: white;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
