import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_TOPICS, isBlogTopicSlug, topicMeta, type BlogTopicSlug } from '@/lib/blog-topics';
import { getPostsByTopic } from '@/lib/blog-posts';
import { readingMinutesFromContent } from '@/lib/blog-utils';
import { buildBlogTopicPageGraph, safeJsonLdStringify } from '@/lib/blog-jsonld';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
const defaultOg = `${siteUrl}/og-image.png`;

export function generateStaticParams() {
  return BLOG_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: { topic: string } }): Promise<Metadata> {
  if (!isBlogTopicSlug(params.topic)) return {};
  const t = topicMeta(params.topic);
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/blog/topic/${params.topic}` },
    openGraph: {
      title: `${t.shortTitle} | FitCV blog`,
      description: t.description,
      url: `${siteUrl}/blog/topic/${params.topic}`,
      type: 'website',
      images: [{ url: defaultOg, width: 1200, height: 630, alt: t.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.shortTitle} | FitCV blog`,
      description: t.description,
      images: [defaultOg],
    },
  };
}

export default function BlogTopicPage({ params }: { params: { topic: string } }) {
  if (!isBlogTopicSlug(params.topic)) notFound();
  const slug = params.topic as BlogTopicSlug;
  const meta = topicMeta(slug);
  const posts = getPostsByTopic(slug);
  const topicJsonLd = safeJsonLdStringify(
    buildBlogTopicPageGraph({
      siteUrl,
      topicSlug: slug,
      topicTitle: meta.title,
      posts,
    }),
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: topicJsonLd }} />

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-3xl">
        <Link
          href="/blog/topics"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All topics
        </Link>

        <h1 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">{meta.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">{meta.description}</p>

        <ul className="space-y-4">
          {posts.map((post) => {
            const mins = readingMinutesFromContent(post.content);
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-border bg-card/50 hover:border-primary/35 hover:bg-card px-4 py-4 transition-colors"
                >
                  <span className="font-headline font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {mins} min
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 pt-10 border-t border-border flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/templates"
            className="inline-flex justify-center items-center rounded-lg bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-90"
          >
            Use a template
          </Link>
          <Link
            href="/blog"
            className="inline-flex justify-center items-center rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-muted/50"
          >
            All articles
          </Link>
        </div>
      </div>
    </div>
  );
}
