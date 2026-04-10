'use client';

import React, { createContext, useContext, useState } from 'react';

interface PortalContextType {
  isModalOpen: boolean;
  modalContent: string | null;
  modalTitle: string | null;
  openModal: (title: string, content: string) => void;
  closeModal: () => void;
  chatTrigger: string | null;
  triggerChat: (message: string) => void;
  clearTrigger: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [chatTrigger, setChatTrigger] = useState<string | null>(null);

  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle(null);
    setModalContent(null);
  };

  const triggerChat = (message: string) => {
    setChatTrigger(message);
  };

  const clearTrigger = () => {
    setChatTrigger(null);
  };

  return (
    <PortalContext.Provider value={{ 
      isModalOpen, modalContent, modalTitle, openModal, closeModal,
      chatTrigger, triggerChat, clearTrigger 
    }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
