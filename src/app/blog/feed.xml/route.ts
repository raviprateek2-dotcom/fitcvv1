import { getAllPosts } from '@/lib/blog-posts';
import { buildBlogRssXml } from '@/lib/blog-rss';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const revalidate = 3600;

export async function GET() {
  const xml = buildBlogRssXml(siteUrl, getAllPosts());
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
