'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

export function AboutStoryClose() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-close"
      className="py-16 md:py-24"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          variants={reduceMotion ? undefined : aboutItemVariants}
          className="max-w-4xl mx-auto premium-card p-8 md:p-12 text-center border border-primary/15"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 p-3 mb-5">
            <Heart className="h-7 w-7 text-primary" aria-hidden />
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tight">
            Your skills deserve to be <span className="text-gradient">seen</span>.
          </h2>
          <p className="mt-5 text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed">
            Start with structure. Earn attention with clarity. Practice like it counts.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" variant="neuro" className="rounded-full px-8 group w-full sm:w-auto">
              <Link href="/templates">
                Start building your resume
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full w-full sm:w-auto">
              <Link href="/templates/ats">Browse ATS layouts</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
