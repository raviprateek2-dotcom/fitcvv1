import type { BlogPost } from '@/lib/blog-posts';
import { topicMeta, type BlogTopicSlug } from '@/lib/blog-topics';

/** Avoid `</script>` breaking out of inline JSON-LD when titles contain `<`. */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildBlogPostGraph(opts: {
  siteUrl: string;
  post: BlogPost;
  heroImageUrl?: string;
}): Record<string, unknown> {
  const { siteUrl, post } = opts;
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const topicUrl = `${siteUrl}/blog/topic/${post.topic}`;
  const t = topicMeta(post.topic);
  const ogFallback = `${siteUrl}/og-image.png`;
  const imageUrl = opts.heroImageUrl || ogFallback;

  const article: Record<string, unknown> = {
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: post.title,
    description: post.description,
    image: imageUrl,
    articleSection: t.shortTitle,
    author: {
      '@type': 'Organization',
      name: 'FitCV Career Team',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FitCV',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.png`,
      },
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
  };

  const breadcrumb: Record<string, unknown> = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: t.shortTitle, item: topicUrl },
      { '@type': 'ListItem', position: 4, name: post.title, item: articleUrl },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [article, breadcrumb],
  };
}

/** Breadcrumb + article list for topic index pages (SEO). */
export function buildBlogTopicPageGraph(opts: {
  siteUrl: string;
  topicSlug: BlogTopicSlug;
  topicTitle: string;
  posts: BlogPost[];
}): Record<string, unknown> {
  const { siteUrl, topicSlug, topicTitle, posts } = opts;
  const topicUrl = `${siteUrl}/blog/topic/${topicSlug}`;

  const breadcrumb: Record<string, unknown> = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: topicTitle, item: topicUrl },
    ],
  };

  const itemList: Record<string, unknown> = {
    '@type': 'ItemList',
    name: topicTitle,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [breadcrumb, itemList],
  };
}

export function buildBlogTopicsHubBreadcrumbGraph(siteUrl: string): Record<string, unknown> {
  const hubUrl = `${siteUrl}/blog/topics`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
          { '@type': 'ListItem', position: 3, name: 'Topics', item: hubUrl },
        ],
      },
    ],
  };
}
