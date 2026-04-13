import { buildBlogRssXml, escapeXml } from '../blog-rss';
import type { BlogPost } from '../blog-posts';

const basePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  title: 'Test Post',
  slug: 'test-post',
  description: 'A short summary.',
  imageId: 'x',
  content: 'Body',
  createdAt: '2024-01-15T12:00:00Z',
  updatedAt: '2024-01-20T12:00:00Z',
  topic: 'job-search',
  ...overrides,
});

describe('blog-rss', () => {
  describe('escapeXml', () => {
    it('escapes XML special characters', () => {
      expect(escapeXml('A & B < C > "q" \'z\'')).toBe(
        'A &amp; B &lt; C &gt; &quot;q&quot; &apos;z&apos;',
      );
    });
  });

  describe('buildBlogRssXml', () => {
    it('produces valid RSS shell with channel metadata', () => {
      const xml = buildBlogRssXml('https://example.com', []);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');
      expect(xml).toContain('<channel>');
      expect(xml).toContain('<title>FitCV Blog</title>');
      expect(xml).toContain('<link>https://example.com/blog</link>');
      expect(xml).toContain('atom:link');
      expect(xml).toContain('https://example.com/blog/feed.xml');
    });

    it('includes escaped item entries', () => {
      const xml = buildBlogRssXml('https://app.test', [
        basePost({
          title: 'AT&T & Tips',
          slug: 'att-tips',
          description: 'Use <tags> wisely',
        }),
      ]);
      expect(xml).toContain('<item>');
      expect(xml).toContain('AT&amp;T &amp; Tips');
      expect(xml).toContain('Use &lt;tags&gt; wisely');
      expect(xml).toContain('https://app.test/blog/att-tips');
      expect(xml).toContain('<guid isPermaLink="true">');
    });
  });
});
