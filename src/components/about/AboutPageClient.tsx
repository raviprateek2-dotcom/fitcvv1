
'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Rocket, Sparkles, Zap, Handshake, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const values = [
    {
        icon: <Target className="w-8 h-8 text-primary" />,
        title: 'Empowerment',
        description: 'We provide tools and knowledge to give job seekers control over their career narrative.'
    },
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: 'Innovation',
        description: 'We leverage cutting-edge AI to deliver smart, effective, and intuitive solutions.'
    },
    {
        icon: <Handshake className="w-8 h-8 text-primary" />,
        title: 'Accessibility',
        description: 'We believe everyone deserves a chance to land their dream job, regardless of their background.'
    }
]

export function AboutPageClient() {
  return (
    <div className="bg-background text-foreground">
        {/* Hero Section */}
        <motion.section 
            className="py-24 md:py-32 text-center bg-secondary"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 md:px-6">
                <motion.div variants={itemVariants} className="flex justify-center mb-4">
                    <Rocket className="h-16 w-16 text-primary" />
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-headline font-bold">About ResumeAI</motion.h1>
                <motion.p variants={itemVariants} className="text-lg md:text-xl mt-4 text-muted-foreground max-w-3xl mx-auto">
                    We're on a mission to level the playing field in the job market, empowering professionals to build their dream careers with the power of AI.
                </motion.p>
            </div>
        </motion.section>

        {/* Mission & Vision Section */}
        <motion.section 
            className="py-20 md:py-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-3xl font-headline font-bold text-primary">Our Mission</h2>
                        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                            At ResumeAI, our mission is to provide smart, intuitive tools that help job seekers create professional, ATS-optimized resumes and cover letters that truly reflect their potential. We believe that a great resume opens doors, and everyone deserves a fair chance to walk through them.
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                         <Card variant="neuro" className="p-8">
                            <h3 className="text-2xl font-headline font-bold">Our Vision</h3>
                            <p className="mt-4 text-muted-foreground">
                                We envision a world where the hiring process is more transparent and equitable, where talent and potential are recognized over everything else. We are building the next generation of career tools to make that vision a reality.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.section>
        
         {/* Values Section */}
        <motion.section 
            className="py-20 md:py-28 bg-secondary"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 md:px-6 text-center">
                <motion.h2 variants={itemVariants} className="text-3xl font-headline font-bold mb-12">Our Core Values</motion.h2>
                <div className="grid sm:grid-cols-3 gap-12">
                    {values.map((value, index) => (
                        <motion.div key={index} variants={itemVariants} className="flex flex-col items-center">
                            <div className="bg-background p-4 rounded-full shadow-neuro mb-4">
                                {value.icon}
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-2">{value.title}</h3>
                            <p className="text-muted-foreground">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>

        {/* Founder Section */}
        <motion.section 
            className="py-20 md:py-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 md:px-6 text-center">
                <motion.h2 variants={itemVariants} className="text-3xl font-headline font-bold">Meet the Founder</motion.h2>
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 mt-8 max-w-3xl mx-auto">
                    <Avatar className="h-32 w-32 border-4 border-primary">
                        <AvatarImage src="https://i.pravatar.cc/150?u=ravi" alt="Ravi Prateek" />
                        <AvatarFallback>RP</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-bold font-headline mb-0">Ravi Prateek</h3>
                    <p className="text-muted-foreground -mt-3">Founder & CEO</p>
                    <p className="text-lg">
                        As a seasoned professional in the tech industry, Ravi experienced firsthand how a well-crafted resume can open doors. He founded ResumeAI with the vision of making expert career tools accessible to everyone. Ravi is passionate about technology, design, and helping people succeed.
                    </p>
                </motion.div>
            </div>
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          className="py-20 md:py-28 border-t"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
            <div className="container mx-auto px-4 md:px-6">
                 <div className="max-w-4xl mx-auto p-8 md:p-12 bg-primary/10 rounded-2xl border border-primary/20 text-center">
                    <motion.div variants={itemVariants} className="flex justify-center mb-4">
                        <Sparkles className="h-12 w-12 text-primary" />
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-3xl font-headline font-bold">
                       Ready to Supercharge Your Job Search?
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        While our core tools are free, our **Premium** subscription unlocks the full power of ResumeAI. This includes unlimited resumes, advanced AI features like our cover letter writer and in-depth analysis, and access to our full suite of executive templates—all designed to give you the ultimate competitive edge.
                    </motion.p>
                    <motion.div variants={itemVariants} className="mt-8">
                        <Button asChild className="group" size="lg" variant="neuro">
                            <Link href="/pricing">
                                Explore Premium Features
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    </div>
  );
}
