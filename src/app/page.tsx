
import { Button } from '@/components/ui/button';
import { blogPostsMetadata } from '@/lib/blog-posts-metadata';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturesSection = dynamic(
  () => import('@/components/home/FeaturesSection').then(mod => mod.FeaturesSection),
  { 
    loading: () => <Skeleton className="w-full h-[500px]" />,
    ssr: false 
  }
);

const HeroSection = dynamic(
  () => import('@/components/home/HeroSection').then(mod => mod.HeroSection),
  { 
    loading: () => <Skeleton className="w-full h-[400px]" />,
    ssr: false 
  }
);

const HowItWorksSection = dynamic(
  () => import('@/components/home/HowItWorksSection').then(mod => mod.HowItWorksSection),
  { 
    loading: () => <Skeleton className="w-full h-[400px]" />,
    ssr: false 
  }
);

const TestimonialsSection = dynamic(
    () => import('@/components/home/TestimonialsSection').then(mod => mod.TestimonialsSection),
    {
      loading: () => <Skeleton className="w-full h-[400px]" />,
      ssr: false
    }
);


export default function Home() {
  return (
    <div className="flex flex-col items-center bg-background text-foreground overflow-x-hidden">
      
      <HeroSection />

      <HowItWorksSection />

      <FeaturesSection />

      <TestimonialsSection />

      {/* Blog Section */}
      <section 
        className="relative w-full py-20 md:py-32"
      >
        <div id="blog" className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">From Our Blog</div>
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">Career Advice & Resume Tips</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                Get the latest insights from our career experts to help you land your dream job.
              </p>
            </div>
            <div
              className="grid gap-8 md:grid-cols-3"
            >
              {blogPostsMetadata.slice(0, 3).map((post) => {
                  const image = PlaceHolderImages.find(img => img.id === post.imageId);
                  return (
                      <div key={post.slug}>
                        <Card className="group overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl" variant="neuro">
                            <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                                {image && (
                                <Image
                                    src={image.imageUrl}
                                    alt={post.title}
                                    width={600}
                                    height={400}
                                    data-ai-hint={image.imageHint}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                />
                                )}
                            </Link>
                            <CardContent className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.description}</p>
                            <Button variant="link" asChild className="p-0 h-auto self-start">
                                <Link href={`/blog/${post.slug}`}>
                                Read More <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            </CardContent>
                        </Card>
                      </div>
                  )
              })}
            </div>
             <div
                className="text-center mt-12"
             >
                  <Button asChild size="lg" variant="outline">
                      <Link href="/blog">View All Articles</Link>
                  </Button>
              </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="relative w-full py-20 md:py-32"
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">Ready to Build Your Future?</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
            Start for free and see how ResumeAI can transform your job search. No credit card required.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="group" variant='neuro'>
              <Link href="/templates">
                Create Your Resume Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
