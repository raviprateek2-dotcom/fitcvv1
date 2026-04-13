import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_TOPICS } from '@/lib/blog-topics';
import { getPostsByTopic } from '@/lib/blog-posts';
import { buildBlogTopicsHubBreadcrumbGraph, safeJsonLdStringify } from '@/lib/blog-jsonld';
import { ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
const defaultOg = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  title: 'Topics — resume, interviews & job search',
  description:
    'Browse FitCV guides by topic: ATS resumes, interviews, job search strategy, and career moves.',
  alternates: { canonical: '/blog/topics' },
  openGraph: {
    title: 'Blog topics | FitCV',
    url: `${siteUrl}/blog/topics`,
    description: 'Structured reading paths for your job search.',
    type: 'website',
    images: [{ url: defaultOg, width: 1200, height: 630, alt: 'FitCV blog topics' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog topics | FitCV',
    description: 'Structured reading paths for your job search.',
    images: [defaultOg],
  },
};

const topicsHubJsonLd = safeJsonLdStringify(buildBlogTopicsHubBreadcrumbGraph(siteUrl));

export default function BlogTopicsHubPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: topicsHubJsonLd }} />
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Guide topics</p>
        <h1 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">
          Browse by <span className="text-gradient">topic</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl">
          Each pillar groups related articles so you can go deep on one part of your search, then jump into templates
          or the editor when you&apos;re ready.
        </p>

        <ul className="space-y-6">
          {BLOG_TOPICS.map((t) => {
            const count = getPostsByTopic(t.slug).length;
            return (
              <li key={t.slug}>
                <Link
                  href={`/blog/topic/${t.slug}`}
                  className="group block rounded-2xl border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition-colors p-6 md:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-headline font-bold group-hover:text-primary transition-colors">
                        {t.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 leading-relaxed">{t.description}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary shrink-0">
                      {count} article{count === 1 ? '' : 's'}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          <Link href="/blog" className="text-primary font-semibold hover:underline">
            All articles
          </Link>
          {' · '}
          <Link href="/templates" className="text-primary font-semibold hover:underline">
            Resume templates
          </Link>
        </p>
      </div>
    </div>
  );
}
