
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { TypingAnimation } from '@/components/common/TypingAnimation';

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


export function HeroSection() {
    return (
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
    );
}
