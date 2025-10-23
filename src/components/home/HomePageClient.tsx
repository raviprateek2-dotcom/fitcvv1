
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, DraftingCompass, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion, type Variants, useScroll, useTransform } from 'framer-motion';
import { TypingAnimation } from '@/components/common/TypingAnimation';
import { useRef } from 'react';
import { AnimatedResume } from '../common/AnimatedResume';

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


export function HomePageClient() {
    const featuresRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: featuresRef,
      offset: ["start end", "end start"],
    });
  
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

    return (
        <>
            <section className="w-full py-24 md:py-40 relative">
                <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="flex flex-col items-center text-center space-y-6"
                    >
                        <motion.h1 
                        variants={itemVariants} 
                        className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                        >
                            Don't just write a resume
                        </motion.h1>
                        <motion.div variants={itemVariants} className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[90px]">
                            <TypingAnimation 
                            phrases={[
                                "Design your future.",
                                "Build your career.",
                                "Land your dream job.",
                                "Showcase your skills."
                            ]}
                            colors={['text-primary', 'text-accent', 'text-foreground', 'text-warning']}
                            />
                        </motion.div>
                        <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
                            Create a professional, ATS-optimized resume in minutes. Let our AI guide you to landing your dream job, faster.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row justify-center">
                            <Button asChild size="lg" className="group" variant='neuro'>
                            <Link href="/templates">
                                Create My Resume
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

             <motion.section 
                className="relative w-full py-20 md:py-32"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                ref={featuresRef}
            >
                <div id="features" className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div variants={sectionVariants} className="space-y-8">
                            <motion.div variants={itemVariants} className="space-y-4">
                            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Everything You Need</div>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl bg-200% bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">Features that help you stand out</h2>
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
        </>
    );
}
