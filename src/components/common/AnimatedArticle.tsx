
'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

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

interface AnimatedArticleProps {
    className?: string;
}


export function AnimatedArticle({ className }: AnimatedArticleProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-full h-full p-6 rounded-lg bg-card border shadow-sm flex flex-col gap-4",
        className
      )}
    >
        <motion.div variants={itemVariants} className="h-4 w-3/4 rounded bg-primary/80" />
        <motion.div variants={itemVariants} className="h-2 w-1/2 rounded bg-muted-foreground/50" />
        <motion.div variants={itemVariants} className="h-px w-full bg-border" />
        <motion.div variants={itemVariants} className="space-y-2">
            <div className="h-2 w-full rounded bg-muted-foreground/30" />
            <div className="h-2 w-5/6 rounded bg-muted-foreground/30" />
            <div className="h-2 w-full rounded bg-muted-foreground/30" />
        </motion.div>
        <motion.div variants={itemVariants} className="space-y-2">
            <div className="h-2 w-full rounded bg-muted-foreground/30" />
            <div className="h-2 w-full rounded bg-muted-foreground/30" />
            <div className="h-2 w-2/3 rounded bg-muted-foreground/30" />
        </motion.div>
         <motion.div variants={itemVariants} className="h-2 w-1/2 rounded bg-muted-foreground/30 mt-auto" />
    </motion.div>
  );
}
