
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { AnimatedResume } from '@/components/common/AnimatedResume';
import { DraftingCompass, Sparkles, Zap } from 'lucide-react';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};


const features = [
    {
      title: 'AI Content Suggestions',
      description: 'Get AI-powered suggestions to improve your resume content and make it more effective.',
      icon: <Sparkles className="w-6 h-6 text-primary"/>
    },
    {
      title: 'Customizable Templates',
      description: 'Choose from a variety of professionally designed templates to match your style.',
      icon: <DraftingCompass className="w-6 h-6 text-primary"/>
    },
    {
      title: 'ATS Compatibility Check',
      description: 'Ensure your resume is optimized for Applicant Tracking Systems to get past the bots.',
      icon: <Zap className="w-6 h-6 text-primary"/>
    },
];


export function FeaturesSection() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start end", "end start"],
    });
  
    // Fade in when the section starts entering the viewport from the bottom,
    // and fade out as it exits the top of the viewport.
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);


    return (
        <motion.section 
            className="relative w-full py-20 md:py-32"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            ref={targetRef}
        >
            <div id="features" className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div variants={sectionVariants} className="space-y-8">
                        <motion.div variants={itemVariants} className="space-y-4">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Everything You Need</div>
                        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-shimmer-text bg-200% bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">Features that help you stand out</h2>
                        </motion.div>
                        <motion.ul
                        variants={sectionVariants}
                        className="grid sm:grid-cols-1 gap-8"
                        >
                            {features.map((feature, index) => (
                            <motion.li 
                                key={index}
                                variants={itemVariants}
                                className="flex items-start gap-4 transition-all duration-300 hover:bg-secondary/50 p-4 rounded-lg hover:scale-105"
                            >
                                <div className="bg-primary/10 p-3 rounded-full mt-1">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                    <motion.div 
                        className="flex items-center justify-center"
                        style={{ opacity, scale }}
                    >
                        <AnimatedResume className="w-full max-w-md" />
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}
