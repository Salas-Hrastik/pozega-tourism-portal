import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { PortalProvider } from "@/context/PortalContext";
import ContentModal from "@/components/ContentModal";
import HeaderThemes from "@/components/HeaderThemes";

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
        <PortalProvider>
          <nav className="navbar glass-panel">
            <div className="nav-left">
              <Link href="/" className="logo-container">
                <div className="logo-icon">TZ</div>
                <div className="logo-text">
                  <span className="logo-top">TURISTIČKA ZAJEDNICA</span>
                  <span className="logo-bottom">GRADA POŽEGE</span>
                </div>
              </Link>
            </div>
            
            <HeaderThemes />

            <div className="nav-right">
              {/* Removed Brda & Doline */}
            </div>
          </nav>

          <main className="main-chat-area">
            {children}
          </main>

          <ContentModal />
        </PortalProvider>
      </body>
    </html>
  );
}
