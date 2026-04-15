
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
                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-headline font-bold">About FitCV</motion.h1>
                <motion.p variants={itemVariants} className="text-lg md:text-xl mt-4 text-muted-foreground max-w-3xl mx-auto">
                    We're building practical tools that help job seekers tell their story clearly, apply with confidence, and prepare for real interviews.
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
                            FitCV exists to make job searching less confusing and more actionable. We focus on practical workflows:
                            build your resume, tailor it for real roles, and practice how you present your experience.
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                         <Card variant="neuro" className="p-8">
                            <h3 className="text-2xl font-headline font-bold">Our Vision</h3>
                            <p className="mt-4 text-muted-foreground">
                                We want every job seeker to have one place to manage the full journey: resume building, job tracking,
                                and interview practice without switching across disconnected tools.
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
                    <Avatar className="h-40 w-40 border-4 border-primary">
                      <AvatarImage src="/images/founder/ravi-prateek.svg" alt="Ravi Prateek, Founder" />
                      <AvatarFallback>RP</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-bold font-headline mb-0">Ravi Prateek</h3>
                    <p className="text-muted-foreground -mt-3">Founder, FitCV</p>
                    <p className="text-lg">
                        I built FitCV because I was the job seeker. I have an MBA from the University of Western Australia,
                        an engineering degree from NSIT Delhi, and hands-on experience in supply chain operations and data
                        analytics. Even with that background, I still faced the same problem many people face: staring at
                        a blank resume and wondering how to make it stand out.
                    </p>
                    <p className="text-lg">
                        FitCV is what I wish existed then. A platform that helps you tell your story clearly, practice the
                        conversation that gets you hired, and track the full application journey without juggling spreadsheets.
                    </p>
                    <p className="text-lg">
                        We are building this for India&apos;s job seekers: students, career changers, and experienced professionals.
                        Everyone deserves a clear shot at the right role.
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
                       Ready to build your next resume?
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Start free with ATS-friendly templates, AI writing help, and export options. When you are ready,
                        you can also practice role-specific interviews.
                    </motion.p>
                    <motion.div variants={itemVariants} className="mt-8">
                        <Button asChild className="group" size="lg" variant="neuro">
                            <Link href="/templates">
                                Start building for free
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
