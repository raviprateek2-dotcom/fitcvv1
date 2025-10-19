
'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
    },
  },
};

interface AnimatedResumeProps {
    className?: string;
}

const ProfessionalTemplate = () => (
    <motion.div variants={containerVariants} className="flex w-full h-full">
        <div className="w-1/3 bg-secondary/50 p-2 space-y-4">
             <motion.div variants={itemVariants} className="h-3 w-3/4 rounded bg-primary/60" />
             <motion.div variants={itemVariants} className="space-y-1">
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
             </motion.div>
              <motion.div variants={itemVariants} className="h-3 w-1/2 rounded bg-primary/60" />
             <motion.div variants={itemVariants} className="space-y-2">
                <div className="h-2 w-5/6 rounded bg-muted-foreground/30" />
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
             </motion.div>
        </div>
        <div className="w-2/3 p-2 space-y-3">
            <motion.div variants={itemVariants} className="space-y-1">
                <div className="h-4 w-3/4 rounded bg-primary/80" />
                <div className="h-2 w-1/2 rounded bg-muted-foreground/50" />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-1">
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
                <div className="h-2 w-5/6 rounded bg-muted-foreground/30" />
            </motion.div>
            <motion.div variants={itemVariants} className="h-3 w-1/3 rounded bg-primary/60" />
            <motion.div variants={itemVariants} className="space-y-2">
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
            </motion.div>
        </div>
    </motion.div>
)

const ExecutiveTemplate = () => (
    <motion.div variants={containerVariants} className="flex w-full h-full">
        <div className="w-1/3 bg-primary/80 p-2 space-y-4">
             <motion.div variants={itemVariants} className="h-3 w-3/4 rounded bg-primary-foreground/80" />
             <motion.div variants={itemVariants} className="space-y-1">
                <div className="h-2 w-full rounded bg-primary-foreground/50" />
                <div className="h-2 w-full rounded bg-primary-foreground/50" />
             </motion.div>
              <motion.div variants={itemVariants} className="h-3 w-1/2 rounded bg-primary-foreground/80" />
             <motion.div variants={itemVariants} className="space-y-2">
                <div className="h-2 w-5/6 rounded bg-primary-foreground/50" />
                <div className="h-2 w-full rounded bg-primary-foreground/50" />
             </motion.div>
        </div>
        <div className="w-2/3 p-2 space-y-3">
            <motion.div variants={itemVariants} className="space-y-1">
                <div className="h-4 w-3/4 rounded bg-primary" />
                <div className="h-2 w-1/2 rounded bg-muted-foreground/50" />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-1">
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
                <div className="h-2 w-5/6 rounded bg-muted-foreground/30" />
            </motion.div>
            <motion.div variants={itemVariants} className="h-3 w-1/3 rounded bg-primary" />
            <motion.div variants={itemVariants} className="space-y-2">
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
                <div className="h-2 w-full rounded bg-muted-foreground/30" />
            </motion.div>
        </div>
    </motion.div>
)


const templates = ['professional', 'executive', 'modern', 'classic'];

export function AnimatedResume({ className }: AnimatedResumeProps) {
  const [templateId, setTemplateId] = useState('professional');

  useEffect(() => {
    const interval = setInterval(() => {
      setTemplateId(prev => {
        const currentIndex = templates.indexOf(prev);
        const nextIndex = (currentIndex + 1) % templates.length;
        return templates[nextIndex];
      });
    }, 3000); // Change template every 3 seconds

    return () => clearInterval(interval);
  }, []);
  
  const ResumeTemplate = () => {
    switch (templateId) {
        case 'professional':
            return <ProfessionalTemplate />;
        case 'executive':
            return <ExecutiveTemplate />;
        case 'modern':
        case 'classic':
        case 'creative':
        case 'minimalist':
        default:
            return <ProfessionalTemplate />;
    }
  }

  return (
    <div
      className={cn(
        "w-full max-w-sm aspect-[3/4] p-3 rounded-lg bg-card border shadow-sm flex flex-col gap-3 overflow-hidden",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
            key={templateId}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
        >
            <ResumeTemplate />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
