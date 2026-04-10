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

  return {
    id: filePath,
    contentHtml,
    ...(matterResult.data as any),
  };
}

export function getAllContentIds(directory: string) {
  const dirPath = path.join(contentDirectory, directory);
  if (!fs.existsSync(dirPath)) return [];
  
  const fileNames = fs.readdirSync(dirPath);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
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
    return {
      name: item.name.replace(/\.md$/, ''),
      type: 'file',
      title: data.title || item.name.replace(/\.md$/, ''),
      ...data,
    };
  });
}
