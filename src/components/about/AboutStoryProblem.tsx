'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Compass, Bot, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

const problems = [
  {
    icon: Compass,
    title: 'No guidance',
    line: 'You know you’re qualified — but not what to prove first.',
    role: 'Emotional mirror',
  },
  {
    icon: Bot,
    title: 'ATS friction',
    line: 'Great stories die behind messy headings, tables, and keyword gaps.',
    role: 'System blocker',
  },
  {
    icon: EyeOff,
    title: 'Low visibility',
    line: 'Busy recruiters scan fast. If the signal isn’t obvious, it’s invisible.',
    role: 'Attention economics',
  },
] as const;

export function AboutStoryProblem() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-problem"
      className="py-16 md:py-24"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-10 md:mb-14">
          <motion.p
            variants={reduceMotion ? undefined : aboutItemVariants}
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            Problem awareness
          </motion.p>
          <motion.h2
            variants={reduceMotion ? undefined : aboutItemVariants}
            className="mt-3 text-3xl md:text-4xl font-headline font-bold tracking-tight"
          >
            The job search isn&apos;t unfair — it&apos;s <span className="text-gradient">under-explained</span>
          </motion.h2>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.title} variants={reduceMotion ? undefined : aboutItemVariants}>
                <Card
                  variant="neuro"
                  className="h-full p-6 md:p-7 motion-safe:transition motion-safe:duration-300 motion-safe:hover:border-primary/30 motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 border border-primary/15">
                      <Icon className="h-6 w-6 text-primary" aria-hidden />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                      {p.role}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-headline font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.line}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
