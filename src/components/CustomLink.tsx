'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';

interface CustomLinkProps {
  href: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function CustomLink({ href, title, children, className, style }: CustomLinkProps) {
  const { openModal } = usePortal();

  const handleClick = async (e: React.MouseEvent) => {
    // Check if it's an internal link (not starting with http)
    if (href.startsWith('/') && href !== '/') {
      e.preventDefault();
      try {
        const response = await fetch(href);
        const html = await response.text();
        
        // Extract content from within the <article> or main container if possible
        // For simplicity in this RAG portal, we can also fetch a raw version or just the whole HTML
        // Since it's Next.js, we can also call our Markdown utility directly if we were in a Server Component
        // But for a dynamic client link, we'll fetch the page and extract the .markdown-content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('.markdown-content')?.innerHTML || 'Sadržaj nije pronađen.';
        
        openModal(title, content);
      } catch (error) {
        console.error('Greška pri učitavanju sadržaja:', error);
      }
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
