'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { aboutContainerVariants, aboutItemVariants, aboutViewport } from '@/components/about/about-motion';

const rows = [
  { label: 'North star', them: 'Pretty pages', us: 'Hiring clarity' },
  { label: 'Templates', them: 'Generic layouts', us: 'ATS-first structure you can trust' },
  { label: 'AI', them: 'Black-box rewrites', us: 'Guided edits you control' },
  { label: 'After the resume', them: 'Disconnected tools', us: 'JD checks + interview practice + tracking' },
] as const;

export function AboutStoryDifferentiation() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about-differentiation"
      className="py-16 md:py-24 bg-secondary/40 border-y border-border/40"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={aboutViewport}
      variants={reduceMotion ? undefined : aboutContainerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-10">
          <motion.p variants={reduceMotion ? undefined : aboutItemVariants} className="text-xs font-bold uppercase tracking-widest text-primary">
            Differentiation
          </motion.p>
          <motion.h2
            variants={reduceMotion ? undefined : aboutItemVariants}
            className="mt-3 text-3xl md:text-4xl font-headline font-bold tracking-tight"
          >
            Others sell documents. <span className="text-gradient">We sell decisions.</span>
          </motion.h2>
        </div>

        <motion.div variants={reduceMotion ? undefined : aboutItemVariants}>
          <Card variant="neuro" className="overflow-hidden">
            <div className="grid md:grid-cols-2 border-b border-border/50 bg-muted/30">
              <div className="p-4 md:p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Typical tools</div>
              <div className="p-4 md:p-5 text-xs font-bold uppercase tracking-widest text-primary border-t md:border-t-0 md:border-l border-border/50">
                FitCV
              </div>
            </div>
            {rows.map((row) => (
              <div key={row.label} className="grid md:grid-cols-2 border-b border-border/40 last:border-0">
                <div className="p-4 md:p-6 flex gap-3 items-start border-b md:border-b-0 border-border/40">
                  <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{row.label}</div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{row.them}</p>
                  </div>
                </div>
                <div className="p-4 md:p-6 flex gap-3 items-start md:border-l border-border/40 bg-primary/[0.03]">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{row.label}</div>
                    <p className="mt-1 text-sm text-foreground leading-relaxed font-medium">{row.us}</p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
