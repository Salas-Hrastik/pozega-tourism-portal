import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src', 'content');

export function getAllContent() {
  const allFiles: { path: string; content: string; title: string }[] = [];

  function readDir(dir: string) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        readDir(fullPath);
      } else if (item.name.endsWith('.md')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        allFiles.push({
          path: fullPath.replace(contentDirectory, ''),
          content,
          title: data.title || item.name.replace(/\.md$/, ''),
        });
      }
    }
  }

  readDir(contentDirectory);
  return allFiles;
}

export function searchContext(query: string, limit = 5) {
  const allContent = getAllContent();
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  const results = allContent.map(doc => {
    let score = 0;
    const text = (doc.title + " " + doc.content).toLowerCase();
    
    for (const word of queryWords) {
      if (text.includes(word)) score += 1;
      if (doc.title.toLowerCase().includes(word)) score += 2;
    }
    
    return { ...doc, score };
  })
  .filter(doc => doc.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);

  return results.map(r => `Title: ${r.title}\nPath: ${r.path}\nContent: ${r.content}`).join("\n\n---\n\n");
}
