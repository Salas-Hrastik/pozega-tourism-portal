import { getMarkdownData, getDirectoryContent, getAllContentSlugs } from "@/lib/markdown";
import Link from "next/link";
import { ChevronLeft, FileText, Folder } from "lucide-react";

export async function generateStaticParams() {
  return getAllContentSlugs();
}

export default async function DynamicPage({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const pathString = slug.join("/");
  
  try {
    // Try to load as a Markdown file
    const data = await getMarkdownData(pathString);
    
    return (
      <main className="container" style={{ padding: "4rem 0" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--primary)" }}>
          <ChevronLeft size={16} /> Povratak
        </Link>
        <article className="glass-panel" style={{ padding: "3rem" }}>
          <div className="markdown-content" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
          {data.source && (
            <p style={{ marginTop: "4rem", fontSize: "0.8rem", borderTop: "1px solid var(--glass-border)", paddingTop: "1rem" }}>
              Izvor: <a href={data.source} target="_blank" rel="noopener noreferrer">{data.source}</a>
            </p>
          )}
        </article>
      </main>
    );
  } catch (e) {
    console.error(`Greška pri učitavanju Markdowna za ${pathString}, pokušavam učitati direktorij...`);
    // If not a file, it might be a directory
    const items = getDirectoryContent(pathString);
    
    if (items.length === 0) {
      return (
        <main className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
          <h1>404 - Stranica nije pronađena</h1>
          <p>Žao nam je, traženi sadržaj ne postoji u bazi.</p>
          <Link href="/" className="btn-primary">Povratak na naslovnicu</Link>
        </main>
      );
    }

    return (
      <main className="container" style={{ padding: "4rem 0" }}>
        <h1 style={{ textTransform: "capitalize" }}>{slug[slug.length - 1].replace(/-/g, " ")}</h1>
        <div className="grid">
          {items.map((item: any) => (
            <Link 
              key={item.name} 
              href={`/${pathString}/${item.name}`} 
              className="glass-panel glass-card"
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              {item.type === "directory" ? <Folder color="var(--primary)" /> : <FileText color="var(--primary)" />}
              <div>
                <h4 style={{ margin: 0 }}>{item.title || item.name}</h4>
                {item.date && <p style={{ fontSize: "0.8rem", margin: 0 }}>{item.date}</p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  }
}
