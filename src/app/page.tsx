import CustomLink from "@/components/CustomLink";

export default async function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <p style={{ color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>Otkrijte Zlatnu Dolinu</p>
          <h1>Dobro došli!</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Ovo je AI turistički informator grada Požege. Ovdje možete pronaći sve informacije o znamenitostima, gastro ponudi i događanjima.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <CustomLink href="/Attractions" title="Znamenitosti" className="btn-primary">Istraži znamenitosti</CustomLink>
            <CustomLink href="/Gastro" title="Gastro Ponuda" style={{ display: "inline-block", padding: "0.75rem 1.5rem", border: "1px solid var(--glass-border)", borderRadius: "8px", fontWeight: 600 }}>Ponuda restorana</CustomLink>
          </div>
        </div>
      </section>
    </main>
  );
}
