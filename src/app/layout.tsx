import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { PortalProvider } from "@/context/PortalContext";
import ContentModal from "@/components/ContentModal";
import ChatToolbar from "@/components/ChatToolbar";
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
              <div className="brda-doline">Brda & Doline</div>
            </div>
          </nav>

          <main style={{ paddingBottom: '100px' }}>
            {children}
          </main>

          <ContentModal />
          <ChatToolbar />
        </PortalProvider>
      </body>
    </html>
  );
}
