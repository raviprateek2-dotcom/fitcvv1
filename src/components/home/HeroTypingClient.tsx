'use client';

import { TypingAnimation } from '@/components/common/TypingAnimation';

const PHRASES = [
  'Design your future.',
  'Build your career.',
  'Land your dream job.',
  'Showcase your skills.',
];

const COLORS = [
  'text-primary',
  'text-teal-600 dark:text-teal-400',
  'text-foreground',
  'text-primary',
];

export function HeroTypingClient() {
  return (
    <div className="text-xl font-headline font-bold tracking-tight leading-tight sm:text-3xl md:text-5xl lg:text-6xl min-h-[2.5rem] sm:min-h-[60px] md:min-h-[80px] lg:min-h-[90px] w-full max-w-[min(100%,24rem)] sm:max-w-[90vw] overflow-hidden mx-auto">
      <TypingAnimation phrases={PHRASES} colors={COLORS} />
    </div>
  );
}
