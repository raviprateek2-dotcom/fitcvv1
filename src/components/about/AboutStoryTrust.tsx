'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

const stats = [
  { value: '8+', label: 'ATS-friendly layouts' },
  { value: 'Free', label: 'Core builder + AI' },
  { value: 'Built-in', label: 'Interview tools' },
  { value: 'India-first', label: 'Real hiring contexts' },
] as const;

const quotes = [
  {
    quote: 'The AI suggestions helped me tighten my bullets and feel more confident sending applications.',
    who: 'Software Engineer',
  },
  {
    quote: 'The ATS checker gave me peace of mind. I started getting more callbacks after tightening structure.',
    who: 'Marketing Director',
  },
] as const;

export function AboutStoryTrust() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-trust"
      className="py-16 md:py-24 bg-secondary/40 border-y border-border/40"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-10">
          <motion.p variants={reduceMotion ? undefined : aboutItemVariants} className="text-xs font-bold uppercase tracking-widest text-primary">
            Trust
          </motion.p>
          <motion.h2
            variants={reduceMotion ? undefined : aboutItemVariants}
            className="mt-3 text-3xl md:text-4xl font-headline font-bold tracking-tight"
          >
            Proof beats promises
          </motion.h2>
        </div>

        <motion.div
          variants={reduceMotion ? undefined : aboutItemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {stats.map((s) => (
            <Card key={s.label} variant="neuro" className="p-5 text-center">
              <div className="text-2xl md:text-4xl font-black font-headline text-primary">{s.value}</div>
              <div className="mt-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{s.label}</div>
            </Card>
          ))}
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {quotes.map((q) => (
            <motion.div key={q.who} variants={reduceMotion ? undefined : aboutItemVariants}>
              <Card variant="neuro" className="p-6 md:p-7 h-full motion-safe:transition motion-safe:hover:border-primary/25">
                <p className="text-muted-foreground leading-relaxed italic">&ldquo;{q.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-foreground">{q.who}</p>
                <p className="text-xs text-muted-foreground">FitCV user</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
