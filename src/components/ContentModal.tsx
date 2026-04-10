'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';
import { X } from 'lucide-react';

export default function ContentModal() {
  const { isModalOpen, modalContent, modalTitle, closeModal } = usePortal();

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{modalTitle}</h2>
          <button onClick={closeModal} className="close-btn">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body markdown-content" dangerouslySetInnerHTML={{ __html: modalContent || '' }} />
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }
        .modal-content {
          width: 100%;
          max-width: 800px;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: modalIn 0.3s ease-out;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
        }
        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: white;
        }
        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
