import type { BlogPost } from '@/lib/blog-posts';

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0 + atom self-link for `/blog/feed.xml`. */
export function buildBlogRssXml(siteUrl: string, posts: BlogPost[]): string {
  const feedUrl = `${siteUrl}/blog/feed.xml`;
  const blogUrl = `${siteUrl}/blog`;
  const lastBuild = posts[0]?.updatedAt || posts[0]?.createdAt || new Date().toISOString();

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`;
      const pub = new Date(post.createdAt);
      const pubDate = Number.isNaN(pub.getTime()) ? new Date().toUTCString() : pub.toUTCString();
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FitCV Blog</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>${escapeXml('Resume, interview, and job search guides from FitCV.')}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
