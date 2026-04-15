'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  Target,
  Twitter,
  Linkedin,
  Link2,
  ThumbsUp,
  ThumbsDown,
  ListTree,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/blog-posts';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn, isPlaceholderCoUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  buildTocFromMarkdown,
  createHeadingIdFactory,
  readingMinutesFromContent,
  blogShareTwitterUrl,
  blogShareLinkedInUrl,
  type BlogTocItem,
} from '@/lib/blog-utils';
import { topicMeta } from '@/lib/blog-topics';
import { BlogReadingProgress } from '@/components/blog/BlogReadingProgress';
import { trackEvent } from '@/lib/analytics-events';

function MarkdownRenderer({ content }: { content: string }) {
  const nextId = createHeadingIdFactory();

  const htmlContent = content
    .split('\n')
    .map((line, index) => {
      let trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        return `<h1 class="text-3xl font-bold font-headline mt-8 mb-4 scroll-mt-24">${trimmed.substring(2)}</h1>`;
      }
      if (trimmed.startsWith('### ')) {
        const text = trimmed.substring(4);
        const id = nextId(text);
        return `<h3 id="${id}" class="text-xl font-bold font-headline mt-4 mb-2 scroll-mt-24">${text}</h3>`;
      }
      if (trimmed.startsWith('## ')) {
        const text = trimmed.substring(3);
        const id = nextId(text);
        return `<h2 id="${id}" class="text-2xl font-bold font-headline mt-6 mb-3 scroll-mt-24">${text}</h2>`;
      }

      trimmed = trimmed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-semibold">$1</a>');
      trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      trimmed = trimmed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      trimmed = trimmed.replace(/`(.*?)`/g, '<code class="bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono text-sm">$1</code>');

      if (trimmed.startsWith('- ')) {
        return `<li class="ml-5 mb-2">${trimmed.substring(2)}</li>`;
      }

      if (trimmed.startsWith('> !TIP')) {
        return `<div class="p-4 my-6 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 shadow-sm">
            <span class="text-primary mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
            <div><strong class="text-primary block mb-1">PRO TIP</strong><p class="text-sm italic text-muted-foreground">${trimmed.substring(6).trim()}</p></div>
        </div>`;
      }

      if (trimmed === '') return '';

      return `<p class="leading-[1.75] mb-4 text-foreground/90 text-[17px] md:text-lg">${trimmed}</p>`;
    })
    .filter((line) => line !== '')
    .join('');

  const withLists = htmlContent.replace(/(<li class="ml-5 mb-2">.*?<\/li>)+/gs, '<ul class="list-disc list-outside space-y-2 mb-4 pl-1 text-[17px] md:text-lg leading-[1.75] text-foreground/90">$&</ul>');

  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline mb-12 prose-a:text-primary"
      dangerouslySetInnerHTML={{ __html: withLists }}
    />
  );
}

function TocNav({ items, className, slug }: { items: BlogTocItem[]; className?: string; slug?: string }) {
  return (
    <nav aria-label="Jump to section" className={cn('text-sm', className)}>
      <p className="mb-3 flex items-center gap-2 font-semibold text-foreground">
        <ListTree className="h-4 w-4 text-primary" aria-hidden />
        Jump to section
      </p>
      <ul className="space-y-2 border-l-2 border-border pl-3">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-3' : ''}>
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={() => trackEvent('blog_toc_click', { slug: slug ?? 'unknown', section: item.id })}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
  image?: ImagePlaceholder;
  structuredDataJSON: string;
  articleUrl: string;
}

export function BlogPostClient({
  post,
  relatedPosts = [],
  image,
  structuredDataJSON,
  articleUrl,
}: BlogPostClientProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [helpful, setHelpful] = useState<'up' | 'down' | null>(null);

  const wordCount = useMemo(() => post.content.trim().split(/\s+/).filter(Boolean).length, [post.content]);
  const readingTime = useMemo(() => readingMinutesFromContent(post.content), [post.content]);
  const toc = useMemo(() => buildTocFromMarkdown(post.content), [post.content]);
  const showToc = wordCount > 1000 && toc.length > 0;
  const heroImageUnopt = image ? isPlaceholderCoUrl(image.imageUrl) : false;

  let lastUpdatedLabel = '';
  try {
    lastUpdatedLabel = format(parseISO(post.updatedAt), 'MMMM yyyy');
  } catch {
    lastUpdatedLabel = 'Recently';
  }

  const copyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    trackEvent('blog_share_click', { slug: post.slug, channel: 'copy_link' });
    toast({ title: 'Link copied!', description: 'The article link has been copied to your clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterHref = blogShareTwitterUrl(articleUrl, post.title);
  const linkedInHref = blogShareLinkedInUrl(articleUrl);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <BlogReadingProgress slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJSON }} />

      <div className="max-w-4xl mx-auto">
        <nav
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-primary transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <Link href="/blog" className="hover:text-primary transition-colors shrink-0">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <Link
            href={`/blog/topic/${post.topic}`}
            className="hover:text-primary transition-colors shrink-0 max-w-[40vw] sm:max-w-none truncate"
          >
            {topicMeta(post.topic).shortTitle}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <span className="text-foreground font-medium truncate max-w-[50vw] sm:max-w-md">{post.title}</span>
        </nav>

        <article>
          <motion.header className="mb-10" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/blog/topic/${post.topic}`}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/15 transition-colors"
              >
                {topicMeta(post.topic).shortTitle}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />
                <span>{readingTime} min read</span>
              </div>
              <span className="text-xs text-muted-foreground" aria-label={`Last updated ${lastUpdatedLabel}`}>
                Last updated: {lastUpdatedLabel}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold tracking-tight mb-4 leading-tight"
            >
              {post.title}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed mb-2">
              {post.description}
            </motion.p>

            <motion.p variants={itemVariants} className="text-sm text-muted-foreground mb-8">
              Written by <span className="font-medium text-foreground">FitCV Career Team</span>
            </motion.p>

            {image && (
              <motion.div
                variants={itemVariants}
                className="relative aspect-[16/9] mt-4 overflow-hidden rounded-2xl shadow-lg border border-border"
              >
                <Image
                  src={image.imageUrl}
                  alt={post.title}
                  fill
                  priority
                  unoptimized={heroImageUnopt}
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover dark:brightness-[0.92]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </motion.div>
            )}
          </motion.header>

          <motion.div
            className="flex flex-col lg:flex-row gap-10 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex-1 min-w-0">
              {showToc && (
                <details className="lg:hidden group/toc mb-8 rounded-xl border border-border bg-card/80 p-4">
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2">
                      <ListTree className="h-4 w-4 text-primary" aria-hidden />
                      Table of contents
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open/toc:rotate-90"
                      aria-hidden
                    />
                  </summary>
                  <div className="mt-4 pt-4 border-t border-border">
                    <TocNav items={toc} slug={post.slug} />
                  </div>
                </details>
              )}

              <MarkdownRenderer content={post.content} />

              <section
                className="mt-10 rounded-xl border border-border bg-muted/30 px-4 py-5 sm:px-6"
                aria-label="Article feedback"
              >
                <p className="text-sm font-medium text-foreground mb-3">Was this helpful?</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={helpful === 'up' ? 'default' : 'outline'}
                    size="sm"
                    className="min-h-[44px] gap-2"
                    onClick={() => {
                      setHelpful('up');
                      trackEvent('blog_helpful_vote', { slug: post.slug, vote: 'up' });
                      toast({ title: 'Thanks for the feedback', description: 'Glad this helped you move forward.' });
                    }}
                  >
                    <ThumbsUp className="h-4 w-4" aria-hidden />
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={helpful === 'down' ? 'default' : 'outline'}
                    size="sm"
                    className="min-h-[44px] gap-2"
                    onClick={() => {
                      setHelpful('down');
                      trackEvent('blog_helpful_vote', { slug: post.slug, vote: 'down' });
                      toast({ title: 'Thanks for letting us know', description: 'We use feedback to improve our guides.' });
                    }}
                  >
                    <ThumbsDown className="h-4 w-4" aria-hidden />
                    Not really
                  </Button>
                </div>
              </section>

              <div className="pt-10 mt-10 border-t border-border">
                <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-primary/15 flex items-center justify-center text-primary font-headline font-bold text-sm border border-primary/20">
                      FC
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">FitCV Career Team</p>
                      <p className="text-xs text-muted-foreground">Practical guidance for your job search in India</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-full sm:w-auto sm:mr-1">Share</span>
                    <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-full" asChild>
                      <a
                        href={twitterHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on X (Twitter)"
                        onClick={() => trackEvent('blog_share_click', { slug: post.slug, channel: 'x' })}
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-full" asChild>
                      <a
                        href={linkedInHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on LinkedIn"
                        onClick={() => trackEvent('blog_share_click', { slug: post.slug, channel: 'linkedin' })}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyLink}
                      className={cn('h-11 w-11 shrink-0 rounded-full', copied && 'text-green-600 border-green-600/50')}
                      aria-label="Copy article link"
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 space-y-8">
                {showToc && (
                  <div className="premium-card p-5 bg-glass">
                    <TocNav items={toc} slug={post.slug} />
                  </div>
                )}

                <div className="premium-card p-6 bg-glass">
                  <h2 className="font-bold flex items-center gap-2 mb-3 text-base">
                    <Target className="w-4 h-4 text-primary shrink-0" aria-hidden />
                    Put this into practice
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    Build or refine your resume with templates and tools that match what you just read.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/templates">Browse resume templates</Link>
                  </Button>
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link href="/dashboard">Open resume editor</Link>
                  </Button>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      Related articles
                    </h2>
                    <ul className="space-y-4">
                      {relatedPosts.map((relatedPost) => {
                        const img = PlaceHolderImages.find((i) => i.id === relatedPost.imageId);
                        const mins = readingMinutesFromContent(relatedPost.content);
                        const relUnopt = img ? isPlaceholderCoUrl(img.imageUrl) : false;
                        return (
                          <li key={relatedPost.slug}>
                            <Link
                              href={`/blog/${relatedPost.slug}`}
                              className="group block rounded-xl border border-border overflow-hidden bg-card hover:border-primary/40 transition-colors"
                              onClick={() =>
                                trackEvent('blog_related_click', {
                                  from_slug: post.slug,
                                  to_slug: relatedPost.slug,
                                })
                              }
                            >
                              {img && (
                                <div className="relative aspect-video w-full">
                                  <Image
                                    src={img.imageUrl}
                                    alt=""
                                    fill
                                    unoptimized={relUnopt}
                                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity dark:brightness-[0.9]"
                                    sizes="288px"
                                  />
                                </div>
                              )}
                              <div className="p-3">
                                <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                  {relatedPost.title}
                                </p>
                                <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                                  {mins} min read
                                </p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </motion.div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16 lg:hidden pt-10 border-t border-border" aria-labelledby="related-heading-mobile">
            <h2 id="related-heading-mobile" className="text-xl font-headline font-bold mb-6">
              Related articles
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedPosts.map((relatedPost) => {
                const img = PlaceHolderImages.find((i) => i.id === relatedPost.imageId);
                const mins = readingMinutesFromContent(relatedPost.content);
                const relUnopt = img ? isPlaceholderCoUrl(img.imageUrl) : false;
                return (
                  <li key={relatedPost.slug}>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="group flex flex-col rounded-xl border border-border overflow-hidden bg-card h-full hover:border-primary/40 transition-colors"
                      onClick={() =>
                        trackEvent('blog_related_click', {
                          from_slug: post.slug,
                          to_slug: relatedPost.slug,
                        })
                      }
                    >
                      {img && (
                        <div className="relative aspect-[16/9] w-full shrink-0">
                          <Image
                            src={img.imageUrl}
                            alt=""
                            fill
                            unoptimized={relUnopt}
                            className="object-cover dark:brightness-[0.9]"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-1">
                        <p className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{mins} min read</p>
                        <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                          Read article
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-12">
          <Button variant="ghost" asChild className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
