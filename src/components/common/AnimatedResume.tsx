
'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
        scaleX: 1, 
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

const bulletPointVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
}

const bulletItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
}


export function AnimatedResume() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-sm aspect-[3/4] p-6 rounded-2xl bg-card border shadow-2xl flex flex-col gap-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="h-6 w-3/4 rounded bg-primary/80" />
        <div className="h-4 w-1/2 rounded bg-muted-foreground/50" />
      </motion.div>

      {/* Separator */}
      <motion.div 
        variants={itemVariants} 
        className="h-px w-full bg-border"
      />

      {/* Summary */}
      <motion.div variants={itemVariants} className="space-y-2">
        <motion.div variants={lineVariants} style={{ transformOrigin: 'left' }} className="h-3 w-full rounded bg-muted-foreground/30" />
        <motion.div variants={lineVariants} style={{ transformOrigin: 'left' }} className="h-3 w-full rounded bg-muted-foreground/30" />
        <motion.div variants={lineVariants} style={{ transformOrigin: 'left' }} className="h-3 w-3/4 rounded bg-muted-foreground/30" />
      </motion.div>

      {/* Experience Title */}
      <motion.div variants={itemVariants}>
         <div className="h-4 w-1/3 rounded bg-primary/60" />
      </motion.div>
      
      {/* Experience Bullets */}
      <motion.div variants={bulletPointVariants} className="space-y-3">
         <motion.div variants={bulletItemVariants} className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/80 mt-1 flex-shrink-0" />
            <div className="h-3 w-full rounded bg-muted-foreground/30" />
         </motion.div>
          <motion.div variants={bulletItemVariants} className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/80 mt-1 flex-shrink-0" />
            <div className="h-3 w-5/6 rounded bg-muted-foreground/30" />
         </motion.div>
         <motion.div variants={bulletItemVariants} className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/80 mt-1 flex-shrink-0" />
            <div className="h-3 w-full rounded bg-muted-foreground/30" />
         </motion.div>
      </motion.div>

       {/* Skills Title */}
      <motion.div variants={itemVariants}>
         <div className="h-4 w-1/4 rounded bg-primary/60" />
      </motion.div>

      {/* Skills Badges */}
      <motion.div variants={bulletPointVariants} className="flex flex-wrap gap-2">
        <motion.div variants={bulletItemVariants} className="h-5 w-16 rounded-full bg-primary/20" />
        <motion.div variants={bulletItemVariants} className="h-5 w-20 rounded-full bg-primary/20" />
        <motion.div variants={bulletItemVariants} className="h-5 w-12 rounded-full bg-primary/20" />
        <motion.div variants={bulletItemVariants} className="h-5 w-24 rounded-full bg-primary/20" />
      </motion.div>
    </motion.div>
  );
}
