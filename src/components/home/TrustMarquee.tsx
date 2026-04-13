'use client';

import { useReducedMotion } from 'framer-motion';

/** Roles and paths — not employer endorsements. */
const SEEKER_SEGMENTS = [
  'Software',
  'Product',
  'Design',
  'Marketing',
  'Operations',
  'Finance',
  'Campus hiring',
  'Career changers',
];

export function TrustMarquee() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full py-12 bg-white/[0.01] border-y border-white/5 overflow-hidden select-none">
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground/55">
          Built for people in every kind of role
        </p>
        <p className="mt-2 text-sm text-muted-foreground/80 max-w-xl mx-auto">
          Not affiliated with any employer — a resume and interview tool for individual job seekers.
        </p>
      </div>

      {reduceMotion === true ? (
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 py-2">
            {SEEKER_SEGMENTS.map((label) => (
              <span
                key={label}
                className="text-sm md:text-base font-headline font-semibold text-muted-foreground/50 px-3 py-1.5 rounded-full border border-border/60 bg-card/30"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4">
              {SEEKER_SEGMENTS.concat(SEEKER_SEGMENTS).map((label, idx) => (
                <span
                  key={`a-${idx}`}
                  className="text-xl md:text-2xl font-headline font-bold text-muted-foreground/25 hover:text-primary/45 transition-colors cursor-default"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 py-4">
              {SEEKER_SEGMENTS.concat(SEEKER_SEGMENTS).map((label, idx) => (
                <span
                  key={`b-${idx}`}
                  className="text-xl md:text-2xl font-headline font-bold text-muted-foreground/25 hover:text-primary/45 transition-colors cursor-default"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <style jsx>{`
            .animate-marquee {
              display: inline-flex;
              animation: marquee 36s linear infinite;
            }
            .animate-marquee2 {
              display: inline-flex;
              position: absolute;
              top: 0;
              left: 100%;
              animation: marquee2 36s linear infinite;
            }
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-100%);
              }
            }
            @keyframes marquee2 {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-100%);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
