import CustomLink from "@/components/CustomLink";

export default async function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <p style={{ color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>Otkrijte Zlatnu Dolinu</p>
          <h1>Dobro došli!</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Ja sam AI turistički informator. Mogu pomoći u istraživanju Požege?
          </p>
        </div>
      </section>
    </main>
  );
}
