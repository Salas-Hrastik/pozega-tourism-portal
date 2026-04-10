import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Map, Utensils, Calendar, Info } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Požega - Zlatna Dolina | Službeni Vodič",
  description: "Istražite ljepote Slavonije kroz službeni turistički portal grada Požege.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body>
        <nav className="navbar glass-panel">
          <Link href="/" className="logo">
            <h2 style={{ margin: 0, fontWeight: 800, letterSpacing: '-1px' }}>POŽEGA</h2>
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/Attractions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Map size={18} /> Znamenitosti
            </Link>
            <Link href="/Gastro" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Utensils size={18} /> Gastro
            </Link>
            <Link href="/Events" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} /> Događanja
            </Link>
            <Link href="/Official" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} /> Dokumenti
            </Link>
          </div>
        </nav>
        {children}
        <ChatWidget />
        <footer style={{ padding: '4rem 0', textAlign: 'center', color: '#64748b' }}>
          <div className="container">
            <p>&copy; 2026 Turistička zajednica Grada Požege. Sva prava pridržana.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
