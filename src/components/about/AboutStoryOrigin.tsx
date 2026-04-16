'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

const beats = [
  { t: 'The spark', d: 'Built by someone who lived the blank-page panic — not a slide deck.' },
  { t: 'The promise', d: 'Practical workflows: resume → JD fit → interview practice → tracking.' },
  { t: 'The audience', d: 'Students, switchers, and experienced pros across India — clarity for everyone.' },
] as const;

export function AboutStoryOrigin() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-origin"
      className="py-16 md:py-24"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-10">
          <motion.p variants={reduceMotion ? undefined : aboutItemVariants} className="text-xs font-bold uppercase tracking-widest text-primary">
            Origin
          </motion.p>
          <motion.h2
            variants={reduceMotion ? undefined : aboutItemVariants}
            className="mt-3 text-3xl md:text-4xl font-headline font-bold tracking-tight"
          >
            Why FitCV exists
          </motion.h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <motion.div variants={reduceMotion ? undefined : aboutItemVariants} className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
            <Avatar className="h-32 w-32 md:h-36 md:w-36 border-4 border-primary/40 shadow-lg">
              <AvatarImage src="/images/founder/ravi-prateek.svg" alt="Ravi Prateek, Founder of FitCV" />
              <AvatarFallback>RP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-headline font-bold">Ravi Prateek</p>
              <p className="text-sm text-muted-foreground">Founder, FitCV</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              MBA (UWA) · Engineering (NSIT) · Ops & analytics in the real world. FitCV is the toolkit I wish I had when “good enough” wasn’t enough.
            </p>
          </motion.div>

          <motion.div variants={reduceMotion ? undefined : aboutItemVariants} className="lg:col-span-7 space-y-4">
            {beats.map((b, i) => (
              <Card key={b.t} variant="neuro" className="p-5 md:p-6 flex gap-4 items-start">
                <div
                  className="shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-black text-primary"
                  aria-hidden
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg">{b.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{b.d}</p>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
