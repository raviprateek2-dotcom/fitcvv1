
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-posts';
import { BLOG_TOPICS } from '@/lib/blog-topics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

function lastMod(iso: string | undefined): string {
  if (!iso) return new Date().toISOString();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/about',
    '/pricing',
    '/templates',
    '/blog',
    '/blog/topics',
    '/blog/feed.xml',
    '/interview',
    '/privacy',
    '/terms',
  ];

  const routes = staticPaths.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority:
      route === ''
        ? 1
        : route === '/blog' || route === '/blog/topics'
          ? 0.85
          : route === '/blog/feed.xml'
            ? 0.55
            : 0.8,
  }));

  const topicRoutes = BLOG_TOPICS.map((t) => ({
    url: `${siteUrl}/blog/topic/${t.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: lastMod(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...topicRoutes, ...posts];
}
