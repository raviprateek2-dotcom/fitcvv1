
'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { BlogPost } from '@/lib/blog-posts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Rss, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn, isPlaceholderCoUrl } from '@/lib/utils';
import { BLOG_TOPICS } from '@/lib/blog-topics';
import { trackEvent } from '@/lib/analytics-events';

export function BlogClientPage({ posts }: { posts: BlogPost[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Mesh Background (Unified with Landing/Editor) */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative">
        <motion.div 
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Engineering Knowledge
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight mb-6 leading-tight">
            Advanced Career <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Strategic advice on resume engineering, ATS optimization, and high-stakes interview performance for elite professionals.
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            <Button asChild variant="default" size="sm" className="min-h-[40px] rounded-full">
              <Link
                href="/blog/topics"
                onClick={() => trackEvent('blog_cta_click', { source: 'blog_listing_header', target: 'topics' })}
              >
                Browse by topic
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="min-h-[40px] rounded-full">
              <Link href="/blog/feed.xml" className="inline-flex items-center gap-2">
                <Rss className="h-3.5 w-3.5" aria-hidden />
                RSS feed
              </Link>
            </Button>
            {BLOG_TOPICS.map((t) => (
              <Button key={t.slug} asChild variant="outline" size="sm" className="min-h-[40px] rounded-full">
                <Link
                  href={`/blog/topic/${t.slug}`}
                  onClick={() =>
                    trackEvent('blog_cta_click', {
                      source: 'blog_listing_topic_chip',
                      target: t.slug,
                    })
                  }
                >
                  {t.shortTitle}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post, postIndex) => {
            const image = PlaceHolderImages.find(img => img.id === post.imageId);
            const wordCount = post.content.trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);
            const unopt = image ? isPlaceholderCoUrl(image.imageUrl) : false;

            return (
              <motion.div key={post.slug} variants={itemVariants} className="flex h-full">
                <Link href={`/blog/${post.slug}`} className="group w-full">
                  <div className="premium-card bg-glass h-full flex flex-col p-0 overflow-hidden border-white/5 group-hover:border-primary/30 group-hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-48 overflow-hidden">
                      {image && (
                        <Image
                          src={image.imageUrl}
                          alt={post.title}
                          fill
                          priority={postIndex < 3}
                          unoptimized={unopt}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-2 py-1 rounded bg-primary text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                          Article
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime}m Read</span>
                        <span className="flex items-center gap-1 text-primary"><Target className="w-3 h-3" /> Strategy</span>
                      </div>
                      
                      <h2 className="text-xl font-bold font-headline mb-3 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-[17px] md:text-sm text-muted-foreground line-clamp-2 mb-6 leading-[1.75] md:leading-relaxed flex-grow">
                        {post.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-2 flex items-center gap-1 transition-all">
                          Read Insight <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <section
          className="mt-20 md:mt-28 max-w-3xl mx-auto rounded-2xl border border-border bg-card/60 p-6 sm:p-8 text-center space-y-4"
          aria-labelledby="blog-cta-heading"
        >
          <h2 id="blog-cta-heading" className="text-xl sm:text-2xl font-headline font-bold text-foreground">
            Put this advice to work
          </h2>
          <p className="text-muted-foreground text-[17px] sm:text-base leading-relaxed">
            Build your resume free, tailor it with real examples from these guides, and export when you are ready to apply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="lg" className="min-h-[48px] w-full sm:w-auto">
              <Link
                href="/templates?source=blog_listing_endcap"
                onClick={() => trackEvent('cta_get_started', { surface: 'blog_listing_endcap' })}
              >
                Build your resume free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-[48px] w-full sm:w-auto">
              <Link
                href="/signup?source=blog_listing_endcap"
                onClick={() => trackEvent('cta_signup', { surface: 'blog_listing_endcap' })}
              >
                Create free account
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
