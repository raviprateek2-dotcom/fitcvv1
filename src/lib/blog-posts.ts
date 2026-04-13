import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { normalizePostTopic, type BlogTopicSlug } from '@/lib/blog-topics';

export type BlogPost = {
  title: string;
  slug: string;
  description: string;
  imageId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  /** Content pillar for hubs and internal linking (see `blog-topics.ts`). */
  topic: BlogTopicSlug;
};

const blogDir = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDir);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(blogDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      const slug = fileName.replace(/\.mdx$/, '');

      return {
        slug,
        title: matterResult.data.title,
        description: matterResult.data.description,
        imageId: matterResult.data.imageId,
        createdAt: matterResult.data.createdAt,
        updatedAt: matterResult.data.updatedAt,
        topic: normalizePostTopic(matterResult.data.topic),
        content: matterResult.content, // Raw MDX string
      } as BlogPost;
    });

  // Sort posts by date
  return posts.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export function getPostsByTopic(topic: BlogTopicSlug): BlogPost[] {
  return getAllPosts().filter((p) => p.topic === topic);
}

export function getRelatedPosts(currentSlug: string, count: number = 3): BlogPost[] {
  const allPosts = getAllPosts();
  const current = allPosts.find((p) => p.slug === currentSlug);
  const sameTopic = allPosts.filter((p) => p.slug !== currentSlug && p.topic === current?.topic);
  const rest = allPosts.filter((p) => p.slug !== currentSlug && p.topic !== current?.topic);
  const merged = [...sameTopic, ...rest];
  return merged.slice(0, count);
}
