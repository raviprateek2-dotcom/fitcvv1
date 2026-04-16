import { Sparkles } from 'lucide-react';
import { getLandingHeroAb } from '@/lib/landing-ab-config';
import { HeroLandingCtas } from '@/components/home/HeroLandingCtas';

/**
 * Server-rendered hero for SEO and first paint.
 */
export function HeroSection() {
  const heroAb = getLandingHeroAb();

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
            <span className="block sm:inline">Ship an </span>
            <span className="text-gradient">ATS-ready resume</span>
            <span className="block sm:inline"> in one guided flow</span>
          </h1>

          <p className="max-w-3xl mx-auto text-foreground text-[17px] sm:text-base md:text-xl leading-relaxed px-1 font-semibold">
            Templates + AI edits + interview practice — built for busy job seekers who want fewer rejections and faster iterations.
          </p>

          <p className="max-w-3xl mx-auto text-muted-foreground/90 text-[17px] sm:text-base md:text-xl leading-relaxed px-1">
            Start with a strong layout, tighten bullets against your JD, then export when you’re confident — without drowning in choices on step one.
          </p>

          <HeroLandingCtas
            primaryHref={heroAb.primary.href}
            primaryLabel={heroAb.primary.label}
            secondaryHref={heroAb.secondary.href}
            secondaryLabel={heroAb.secondary.label}
          />

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
