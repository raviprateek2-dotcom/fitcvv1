'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { BarChart3, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

const proof = [
  {
    icon: BarChart3,
    title: 'JD-aware checks',
    line: 'See gaps against the posting — then tighten bullets with intent.',
    href: '/templates',
    cta: 'Start with templates',
  },
  {
    icon: Sparkles,
    title: 'AI that edits with you',
    line: 'Suggestions you can accept, rewrite, or ignore — not a mystery rewrite.',
    href: '/#features',
    cta: 'See AI tools',
  },
  {
    icon: Layers,
    title: 'ATS-first layouts',
    line: 'Readable structure for humans and parsers — without looking like a robot wrote it.',
    href: '/templates/ats',
    cta: 'ATS layouts',
  },
] as const;

export function AboutStoryProof() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-proof"
      className="py-16 md:py-24"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-10">
          <motion.p variants={reduceMotion ? undefined : aboutItemVariants} className="text-xs font-bold uppercase tracking-widest text-primary">
            Proof layer
          </motion.p>
          <motion.h2
            variants={reduceMotion ? undefined : aboutItemVariants}
            className="mt-3 text-3xl md:text-4xl font-headline font-bold tracking-tight"
          >
            What you get on day one
          </motion.h2>
          <motion.p variants={reduceMotion ? undefined : aboutItemVariants} className="mt-3 text-muted-foreground md:text-lg leading-relaxed">
            Three pillars — each one moves you closer to “confident send.”
          </motion.p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {proof.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} variants={reduceMotion ? undefined : aboutItemVariants}>
                <div className="premium-card h-full flex flex-col p-6 md:p-7">
                  <div className="rounded-xl bg-primary/10 p-3 border border-primary/15 w-fit">
                    <Icon className="h-6 w-6 text-primary" aria-hidden />
                  </div>
                  <h3 className="mt-5 font-headline text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-grow">{item.line}</p>
                  <Button asChild variant="outline" size="sm" className="mt-6 rounded-full w-full md:w-auto self-start">
                    <Link href={item.href}>{item.cta}</Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
