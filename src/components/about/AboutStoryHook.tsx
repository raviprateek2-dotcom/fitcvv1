'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

export function AboutStoryHook() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-hook"
      className="relative py-20 md:py-28 text-center bg-secondary/60 border-b border-border/40"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.p
          variants={reduceMotion ? undefined : aboutItemVariants}
          className="text-xs font-bold uppercase tracking-widest text-primary mb-4"
        >
          The reality check
        </motion.p>
        <motion.h1
          variants={reduceMotion ? undefined : aboutItemVariants}
          className="text-3xl sm:text-5xl md:text-6xl font-headline font-extrabold tracking-tight leading-[1.1] text-foreground"
        >
          Most resumes don&apos;t get rejected.
          <span className="block mt-2 text-gradient">They get ignored.</span>
        </motion.h1>
        <motion.p
          variants={reduceMotion ? undefined : aboutItemVariants}
          className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          FitCV exists to turn attention into momentum — clear structure, honest AI help, and practice that feels like the real interview.
        </motion.p>
      </div>
    </motion.section>
  );
}
