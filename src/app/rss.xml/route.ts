
import { blogPosts } from '@/lib/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

function generateRssFeed() {
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>FitCV Blog</title>
  <link>${siteUrl}/blog</link>
  <description>Career Advice & Resume Tips from the FitCV team.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
`;

  blogPosts.forEach(post => {
    rss += `
  <item>
    <title>${post.title}</title>
    <link>${siteUrl}/blog/${post.slug}</link>
    <description>${post.description}</description>
    <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    <guid>${siteUrl}/blog/${post.slug}</guid>
  </item>
`;
  });

  rss += `
</channel>
</rss>`;

  return rss;
}

export async function GET() {
  const feed = generateRssFeed();
  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
