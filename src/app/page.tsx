import { getMarkdownData } from "@/lib/markdown";
import Link from "next/link";
import { ChevronRight, MapPin, Wine, Calendar, Bus } from "lucide-react";

export default async function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <p style={{ color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>Otkrijte Zlatnu Dolinu</p>
          <h1>POŽEGA</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Dobrodošli u srce Slavonije. Upoznajte bogatu povijest, vrhunska vina i netaknutu prirodu baroknog grada.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/Attractions" className="btn-primary">Istraži znamenitosti</Link>
            <Link href="/Gastro" style={{ display: "inline-block", padding: "0.75rem 1.5rem", border: "1px solid var(--glass-border)", borderRadius: "8px", fontWeight: 600 }}>Ponuda restorana</Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "4rem 0" }}>
        <div className="grid">
          <Link href="/Attractions" className="glass-panel glass-card">
            <MapPin size={32} color="var(--primary)" style={{ marginBottom: "1rem" }} />
            <h3>Znamenitosti</h3>
            <p>Od Katedrale do baroknih trgova, svaki kutak Požege priča svoju priču.</p>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: "600" }}>Saznaj više <ChevronRight size={16} /></span>
          </Link>

          <Link href="/Gastro" className="glass-panel glass-card">
            <Wine size={32} color="var(--primary)" style={{ marginBottom: "1rem" }} />
            <h3>Gastro & Vina</h3>
            <p>Uživajte u okusima Vallis Auree kroz vrhunske vinarije i tradicionalne restorane.</p>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: "600" }}>Saznaj više <ChevronRight size={16} /></span>
          </Link>

          <Link href="/Events" className="glass-panel glass-card">
            <Calendar size={32} color="var(--primary)" style={{ marginBottom: "1rem" }} />
            <h3>Događanja</h3>
            <p>Pratite najnovije manifestacije, od Grgureva do Zlatnih žica Slavonije.</p>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: "600" }}>Kalendar <ChevronRight size={16} /></span>
          </Link>

          <Link href="/Travel" className="glass-panel glass-card">
            <Bus size={32} color="var(--primary)" style={{ marginBottom: "1rem" }} />
            <h3>Putuj & Upoznaj</h3>
            <p>Sve ključne informacije o dolasku, parkiranju i turističkim agencijama na jednom mjestu.</p>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: "600" }}>Logistika <ChevronRight size={16} /></span>
          </Link>
        </div>
      </section>

      <section className="container" style={{ marginBottom: "8rem" }}>
        <div className="glass-panel" style={{ padding: "4rem", textAlign: "center", background: "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))" }}>
          <h2 style={{ fontSize: "2.5rem" }}>Baza Znanja Požega</h2>
          <p style={{ maxWidth: "800px", margin: "0 auto 2rem" }}>
            Ovaj portal je digitalna arhiva Turističke zajednice Grada Požege, kreirana za brzi pristup svim važnim informacijama o destinaciji.
          </p>
          <Link href="/Official/Documents%20Index" className="btn-primary">Službeni dokumenti</Link>
        </div>
      </section>
    </main>
  );
}
