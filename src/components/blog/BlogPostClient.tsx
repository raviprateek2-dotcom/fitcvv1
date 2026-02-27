
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Clock, ChevronRight, BookOpen, Share2, Twitter, Linkedin, Link2, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/blog-posts';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Custom markdown-to-HTML renderer with link and callout support
const MarkdownRenderer = ({ content }: { content: string }) => {
  const htmlContent = content
    .split('\n')
    .map((line, index) => {
      line = line.trim();
      
      // Headers
      if (line.startsWith('# ')) {
        return `<h1 key=${index} class="text-3xl font-bold font-headline mt-8 mb-4">${line.substring(2)}</h1>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 key=${index} class="text-2xl font-bold font-headline mt-6 mb-3">${line.substring(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3 key=${index} class="text-xl font-bold font-headline mt-4 mb-2">${line.substring(4)}</h3>`;
      }
      
      // Links [text](url)
      line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-semibold">$1</a>');
      
      // Basic bold and italic
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Inline code
      line = line.replace(/`(.*?)`/g, '<code class="bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono text-sm">$1</code>');
      
      // Lists
      if (line.startsWith('- ')) {
        return `<li key=${index} class="ml-5 mb-2">${line.substring(2)}</li>`;
      }
      
      // Pro-Tip Callout Custom logic (starts with > !PRO-TIP)
      if (line.startsWith('> !TIP')) {
        return `<div class="p-4 my-6 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 shadow-sm">
            <span class="text-primary mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
            <div><strong class="text-primary block mb-1">PRO STRATEGY</strong><p class="text-sm italic text-muted-foreground">${line.substring(6).trim()}</p></div>
        </div>`;
      }

      if (line === '') return '';

      return `<p key=${index} class="leading-relaxed mb-4 text-slate-700 dark:text-slate-300">${line}</p>`;
    })
    .filter(line => line !== '')
    .join('');
    
    const withLists = htmlContent.replace(/(<li>.*?<\/li>)+/gs, '<ul class="list-disc list-outside space-y-2 mb-4">$&</ul>');

  return <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline mb-12" dangerouslySetInnerHTML={{ __html: withLists }} />;
};

interface BlogPostClientProps {
    post: BlogPost;
    relatedPosts?: BlogPost[];
    image?: ImagePlaceholder;
    structuredDataJSON: string;
}

export function BlogPostClient({ post, relatedPosts = [], image, structuredDataJSON }: BlogPostClientProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Calculate reading time
  const wordCount = post.content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: "Link copied!", description: "The article link has been copied to your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJSON }} />
      
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link href="/blog" className="hover:text-primary transition-colors">Career Insights</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-foreground font-medium truncate">{post.title}</span>
        </nav>

        <article>
            <motion.header 
              className="mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        Strategy
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {readingTime} min read
                    </div>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-4xl lg:text-6xl font-headline font-extrabold tracking-tight mb-6 leading-[1.1]">
                    {post.title}
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-xl text-muted-foreground leading-relaxed mb-8">
                    {post.description}
                </motion.p>

                {image && (
                  <motion.div variants={itemVariants} className="relative aspect-[16/9] mt-8 overflow-hidden rounded-3xl shadow-2xl border border-white/10">
                      <Image
                        src={image.imageUrl}
                        alt={post.title}
                        fill
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                )}
            </motion.header>

            <motion.div 
              className="flex flex-col lg:flex-row gap-12"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.4, duration: 0.6}}
            >
                {/* Main Content */}
                <div className="flex-1">
                    <MarkdownRenderer content={post.content} />
                    
                    {/* Author & Share Footer */}
                    <div className="pt-12 mt-12 border-t border-white/10">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-lg">AI</div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">FitCV Editorial</p>
                                    <p className="text-xs text-muted-foreground">Expert insights on career growth</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground mr-2">Share Strategy:</span>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-primary/10 hover:text-primary transition-all">
                                    <Twitter className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-primary/10 hover:text-primary transition-all">
                                    <Linkedin className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={copyLink}
                                    className={cn("h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-primary/10 hover:text-primary transition-all", copied && "text-green-500")}
                                >
                                    <Link2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Desktop Only) */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-24 space-y-8">
                        <div className="premium-card p-6 bg-glass">
                            <h4 className="font-bold flex items-center gap-2 mb-4">
                                <Target className="w-4 h-4 text-primary" />
                                Optimize Now
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Don't let these insights go to waste. Deploy the optimizer on your own resume now.
                            </p>
                            <Button className="w-full premium py-6" asChild>
                                <Link href="/templates">Get Started Free</Link>
                            </Button>
                        </div>

                        {relatedPosts.length > 0 && (
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Read Next</h4>
                                <div className="space-y-4">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link 
                                            key={relatedPost.slug} 
                                            href={`/blog/${relatedPost.slug}`}
                                            className="group block"
                                        >
                                            <h5 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                                {relatedPost.title}
                                            </h5>
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Career Insight • 5m</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </motion.div>
        </article>

        {/* Mobile Related Posts (Horizontal) */}
        {relatedPosts.length > 0 && (
            <div className="mt-20 lg:hidden pt-12 border-t border-white/10">
                <h3 className="text-2xl font-headline font-bold mb-8">Continue Engineering Your Career</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                        <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="premium-card p-6 bg-glass group">
                            <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">{relatedPost.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{relatedPost.description}</p>
                            <div className="flex items-center text-primary text-xs font-bold uppercase tracking-widest">
                                Read Insight <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
