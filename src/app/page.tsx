import { Button } from '@/components/ui/button';
import { getAllPosts } from '@/lib/blog-posts';
import { readingMinutesFromContent } from '@/lib/blog-utils';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { isPlaceholderCoUrl } from '@/lib/utils';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  title: 'FitCV — AI resume builder & interview practice',
  description:
    'ATS-friendly templates, AI help for wording and job-match checks, and interview practice — built for job seekers who want a clear path from application to offer.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'FitCV — resumes and interviews, simplified',
    description: 'Templates, AI tools, and mock interviews in one place. Start free.',
  },
};

const HomePageClient = dynamic(
  () => import('@/components/home/HomePageClient').then((mod) => mod.HomePageClient),
  {
    loading: () => (
      <div className="w-full py-12 space-y-6" aria-hidden>
        <Skeleton className="h-24 w-full max-w-4xl mx-auto rounded-xl" />
        <Skeleton className="h-48 w-full max-w-5xl mx-auto rounded-xl" />
        <Skeleton className="h-64 w-full max-w-5xl mx-auto rounded-xl" />
      </div>
    ),
  },
);


export default function LandingPage() {
  const featuredBlogs = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-col items-center bg-background text-foreground overflow-x-hidden">
      <div className="relative isolate w-full">
        <div
          className="fixed inset-0 -z-10 opacity-[0.08] dark:opacity-[0.12] animate-mesh filter blur-[80px]"
          aria-hidden
        />
        <HeroSection />
        <HomePageClient />
      </div>

      {/* Blog Section — Rev2: single column mobile, 17px body, read time */}
      <section className="relative w-full py-14 sm:py-24 md:py-32 border-t border-border/40">
        <div id="blog" className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-12">
              <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                From the blog
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground px-2 leading-tight">
                Guides for your <span className="text-gradient">job search</span>
              </h2>
              <p className="max-w-xl text-muted-foreground text-[17px] sm:text-base md:text-lg leading-[1.75] px-1">
                Practical resume and interview advice — written for real pressure, not corporate fluff.
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
              {featuredBlogs.map((post, postIndex) => {
                  const image = PlaceHolderImages.find(img => img.id === post.imageId);
                  const mins = readingMinutesFromContent(post.content);
                  const src = image?.imageUrl ?? '';
                  const unopt = src ? isPlaceholderCoUrl(src) : false;
                  return (
                      <article key={post.slug} className="flex flex-col h-full">
                        <Card className="group overflow-hidden flex flex-col h-full border-border transition-shadow duration-300 hover:shadow-lg">
                            <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full overflow-hidden bg-muted">
                                {image && (
                                <Image
                                    src={image.imageUrl}
                                    alt={`Cover image for “${post.title}”`}
                                    fill
                                    priority={postIndex === 0}
                                    fetchPriority={postIndex === 0 ? 'high' : undefined}
                                    data-ai-hint={image.imageHint}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized={unopt}
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] dark:brightness-[0.92]"
                                />
                                )}
                            </Link>
                            <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />
                              {mins} min read
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold font-headline mb-2 leading-snug group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">{post.title}</Link>
                            </h3>
                            <p className="text-muted-foreground text-[17px] sm:text-sm mb-4 flex-grow leading-[1.75] sm:leading-relaxed line-clamp-3">{post.description}</p>
                            <Button variant="link" asChild className="p-0 h-11 sm:h-auto min-h-[44px] sm:min-h-0 justify-start text-base sm:text-sm self-start -ml-2 sm:ml-0 px-2">
                                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2">
                                Read article <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                                </Link>
                            </Button>
                            </CardContent>
                        </Card>
                      </article>
                  )
              })}
            </div>
             <div className="text-center mt-10 sm:mt-12">
                  <Button asChild size="lg" variant="outline" className="min-h-[48px] w-full max-w-xs sm:w-auto sm:max-w-none">
                      <Link href="/blog">View all articles</Link>
                  </Button>
              </div>
        </div>
      </section>
    </div>
  );
}
