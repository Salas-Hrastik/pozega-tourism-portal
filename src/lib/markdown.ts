import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'src', 'content');

export async function getMarkdownData(filePath: string) {
  const fullPath = path.join(contentDirectory, `${filePath}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Convert Date objects to strings for React
  const sanitizedData = { ...matterResult.data };
  for (const key in sanitizedData) {
    if (sanitizedData[key] instanceof Date) {
      sanitizedData[key] = sanitizedData[key].toLocaleDateString('hr-HR');
    }
  }

  return {
    id: filePath,
    contentHtml,
    ...sanitizedData,
  };
}

export function getAllContentSlugs() {
  const slugs: { slug: string[] }[] = [];

  function readDir(dir: string, currentSlug: string[] = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    // Add the directory itself (unless it's the root)
    if (currentSlug.length > 0) {
      slugs.push({ slug: currentSlug });
    }

    for (const item of items) {
      if (item.isDirectory()) {
        readDir(path.join(dir, item.name), [...currentSlug, item.name]);
      } else if (item.name.endsWith('.md')) {
        const name = item.name.replace(/\.md$/, '');
        slugs.push({ slug: [...currentSlug, name] });
      }
    }
  }

  readDir(contentDirectory);
  return slugs;
}

export function getDirectoryContent(directory: string) {
  const dirPath = path.join(contentDirectory, directory);
  if (!fs.existsSync(dirPath)) return [];

  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  return items.map((item) => {
    if (item.isDirectory()) {
      return {
        name: item.name,
        type: 'directory',
      };
    }
    const fullPath = path.join(dirPath, item.name);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    // Convert Date objects to strings for React
    const sanitizedData = { ...data };
    for (const key in sanitizedData) {
      if (sanitizedData[key] instanceof Date) {
        sanitizedData[key] = sanitizedData[key].toLocaleDateString('hr-HR');
      }
    }

    return {
      name: item.name.replace(/\.md$/, ''),
      type: 'file',
      title: sanitizedData.title || item.name.replace(/\.md$/, ''),
      ...sanitizedData,
    };
  });
}
