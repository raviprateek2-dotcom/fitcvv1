'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

const beats = [
  { label: 'Scan window', value: 'Seconds' },
  { label: 'Signal needed', value: 'Clear' },
  { label: 'FitCV focus', value: 'Readable wins' },
] as const;

export function AboutStoryInsight() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-insight"
      className="py-16 md:py-24 bg-secondary/40 border-y border-border/40"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <motion.div variants={reduceMotion ? undefined : aboutItemVariants} className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Insight</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-headline font-extrabold tracking-tight leading-tight">
              Recruiters don&apos;t read resumes.
              <span className="block text-gradient">They triage them.</span>
            </h2>
            <p className="mt-5 text-muted-foreground md:text-lg max-w-xl leading-relaxed">
              Your job isn&apos;t to sound impressive. It&apos;s to make impact obvious — fast — in language humans and parsers can process.
            </p>
          </motion.div>

          <motion.div variants={reduceMotion ? undefined : aboutItemVariants} className="lg:col-span-5">
            <div className="premium-card p-6 md:p-8 space-y-4">
              {beats.map((b) => (
                <div key={b.label} className="flex items-center justify-between gap-4 border-b border-border/40 pb-4 last:border-0 last:pb-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{b.label}</span>
                  <span className="text-lg font-headline font-black text-foreground">{b.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
