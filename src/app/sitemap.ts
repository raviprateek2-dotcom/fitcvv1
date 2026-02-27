
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const routes = ['', '/pricing', '/templates', '/blog'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog posts
  const posts = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date().toISOString(), // In a real app, this would be the post's update date
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...posts];
}
