import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { HeroTypingClient } from './HeroTypingClient';

/**
 * Server-rendered hero for SEO and first paint. Typing line hydrates via {@link HeroTypingClient}.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full py-12 sm:py-24 md:py-48 relative overflow-hidden scroll-mt-24"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-full">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
            AI resume &amp; interviews
          </div>

          <h1 className="font-headline font-extrabold tracking-tight text-2xl leading-[1.2] max-w-[20ch] sm:max-w-none sm:text-4xl sm:leading-tight md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block sm:inline">Don&apos;t just write a </span>
            <span className="text-gradient">resume</span>
          </h1>

          <HeroTypingClient />

          <p className="max-w-3xl mx-auto text-muted-foreground/90 text-[17px] sm:text-base md:text-xl leading-relaxed px-1">
            ATS-friendly templates, AI help with wording, and interview practice — built for busy job
            seekers who want a clear path from application to offer.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row justify-center pt-2 sm:pt-4 w-full max-w-md sm:max-w-none sm:px-0">
            <Link
              href="/templates"
              className={cn(
                buttonVariants({ variant: 'premium', size: 'lg' }),
                'min-h-[52px] h-auto py-3.5 px-6 sm:px-8 text-base rounded-full w-full sm:w-auto inline-flex items-center justify-center group'
              )}
            >
              Start building — free
              <ArrowRight
                className="ml-2 h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform"
                aria-hidden
              />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({ variant: 'glass', size: 'lg' }),
                'min-h-[52px] h-auto py-3.5 px-6 sm:px-8 text-base rounded-full border-primary/20 hover:border-primary/40 w-full sm:w-auto inline-flex items-center justify-center'
              )}
            >
              See features
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-md mx-auto px-2">
            Core templates and AI help are free. Create a free account to save resumes and export.
          </p>
        </div>
      </div>

      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-64 h-64 bg-primary/20 rounded-full blur-[120px] animate-pulse"
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 right-0 -z-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]"
        aria-hidden
      />
    </section>
  );
}
