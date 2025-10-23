
'use client';

import { motion, type Variants } from 'framer-motion';
import { DraftingCompass, FileText, Sparkles, Zap } from 'lucide-react';

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

export function HowItWorksSection() {
    return (
        <motion.section 
            className="relative w-full py-20 md:py-32 bg-secondary/30"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div id="how-it-works" className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <motion.div variants={itemVariants} className="inline-block rounded-lg bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium border">How It Works</motion.div>
                    <motion.h2 variants={itemVariants} className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">Three Simple Steps to Your Dream Job</motion.h2>
                </div>
                <motion.div
                    variants={sectionVariants}
                    className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-3 md:gap-12"
                >
                    <motion.div variants={itemVariants}>
                        <div className="flex flex-col gap-4 items-center text-center p-6 transition-all duration-300 hover:scale-105">
                        <motion.div variants={itemVariants} className="bg-primary/10 p-4 rounded-full">
                            <FileText className="w-8 h-8 text-primary"/>
                        </motion.div>
                        <h3 className="text-xl font-bold font-headline">1. Select a Template</h3>
                        <p className="text-muted-foreground">Choose from our library of professionally designed and ATS-friendly resume templates.</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                    <div className="flex flex-col gap-4 items-center text-center p-6 transition-all duration-300 hover:scale-105">
                        <motion.div variants={itemVariants} className="bg-primary/10 p-4 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary"/>
                        </motion.div>
                        <h3 className="text-xl font-bold font-headline">2. Perfect with AI</h3>
                        <p className="text-muted-foreground">Use our AI assistant to write compelling bullet points, summaries, and cover letters.</p>
                    </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                    <div className="flex flex-col gap-4 items-center text-center p-6 transition-all duration-300 hover:scale-105">
                        <motion.div variants={itemVariants} className="bg-primary/10 p-4 rounded-full">
                            <Zap className="w-8 h-8 text-primary"/>
                        </motion.div>
                        <h3 className="text-xl font-bold font-headline">3. Download & Apply</h3>
                        <p className="text-muted-foreground">Export your pixel-perfect resume as a PDF and start landing interviews.</p>
                    </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
