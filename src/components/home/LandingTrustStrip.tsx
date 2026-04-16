import { LockKeyhole, Search, ShieldCheck, Sparkles } from 'lucide-react';

const items = [
  {
    title: 'ATS-safe structure',
    description: 'Clean headings and simple layouts parsers can read.',
    icon: ShieldCheck,
  },
  {
    title: 'JD-aware wording',
    description: 'Spot gaps against the posting and tighten bullets fast.',
    icon: Search,
  },
  {
    title: 'AI that edits with you',
    description: 'Suggestions you can accept, tweak, or ignore — not a black box.',
    icon: Sparkles,
  },
  {
    title: 'You control your data',
    description: 'Create a free account when you want sync, saves, and exports.',
    icon: LockKeyhole,
  },
] as const;

export function LandingTrustStrip() {
  return (
    <section className="relative w-full py-10 sm:py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Why FitCV feels “safe”</p>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-foreground">
            Built for real hiring friction — not generic “AI resume” hype
          </h2>
          <p className="mt-3 text-muted-foreground md:text-lg leading-relaxed">
            If you’re applying under pressure, you need clarity fast: what to write, what to cut, and whether your file will survive the first screen.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="premium-card p-5 sm:p-6 motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/25 motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-primary/10 p-2 border border-primary/15">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="font-headline font-bold text-foreground leading-snug">{item.title}</div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
