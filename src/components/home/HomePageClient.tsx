'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, DraftingCompass, FileText, Sparkles, Zap, XCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, type Variants, useScroll, useTransform } from 'framer-motion';
import { TypingAnimation } from '@/components/common/TypingAnimation';
import dynamic from 'next/dynamic';

const TrustMarquee = dynamic(() => import('./TrustMarquee').then(mod => mod.TrustMarquee), {
    loading: () => <div className="h-40 w-full animate-pulse bg-white/5" />
});

const Accordion = dynamic(() => import('@/components/ui/accordion').then(mod => mod.Accordion), { ssr: true });
const AccordionItem = dynamic(() => import('@/components/ui/accordion').then(mod => mod.AccordionItem), { ssr: true });
const AccordionTrigger = dynamic(() => import('@/components/ui/accordion').then(mod => mod.AccordionTrigger), { ssr: true });
const AccordionContent = dynamic(() => import('@/components/ui/accordion').then(mod => mod.AccordionContent), { ssr: true });

const Carousel = dynamic(() => import('@/components/ui/carousel').then(mod => mod.Carousel), { ssr: false });
const CarouselContent = dynamic(() => import('@/components/ui/carousel').then(mod => mod.CarouselContent), { ssr: false });
const CarouselItem = dynamic(() => import('@/components/ui/carousel').then(mod => mod.CarouselItem), { ssr: false });

const AnimatedResume = dynamic(() => import('../common/AnimatedResume').then(mod => mod.AnimatedResume), {
    loading: () => <div className="aspect-[3/4] w-full max-w-lg rounded-2xl bg-white/5 animate-pulse" />,
    ssr: false
});

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Autoplay from "embla-carousel-autoplay";
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

const testimonials = [
    {
      author: 'Sarah L.',
      title: 'Software Engineer',
      quote: 'FitCV helped me land my dream job in just two weeks! The AI suggestions were a game-changer.',
      imageId: 'testimonial-avatar-1',
      rating: 5,
    },
    {
      author: 'John D.',
      title: 'Product Manager',
      quote: 'I\'ve never felt more confident about my resume. The templates are modern and professional.',
      imageId: 'testimonial-avatar-2',
      rating: 5,
    },
    {
      author: 'Emily C.',
      title: 'UX Designer',
      quote: 'As a designer, I appreciate the attention to detail in the templates. A fantastic tool!',
      imageId: 'testimonial-avatar-3',
      rating: 5,
    },
    {
      author: 'Mike R.',
      title: 'Marketing Director',
      quote: 'The ATS checker gave me peace of mind. I started getting more callbacks almost immediately after using FitCV.',
      imageId: 'testimonial-avatar-4',
      rating: 5,
    },
    {
      author: 'Jessica B.',
      title: 'Recent Graduate',
      quote: 'I was struggling to create my first resume. FitCV made it so easy and helped me look professional.',
      imageId: 'testimonial-avatar-5',
      rating: 5,
    }
];

const stats = [
    { label: 'Resumes Generated', value: '124,k+' },
    { label: 'Success Rate', value: '98%' },
    { label: 'ATS Optimized', value: '100%' },
    { label: 'Career Growth', value: 'Lv. Max' }
];

const faqs = [
    {
        question: "Is FitCV really free?",
        answer: "Yes! Our core designer templates and AI analysis tools are free for everyone. We offer a Premium tier for advanced AI exports and unlimited interview simulations."
    },
    {
        question: "How does the AI optimize for ATS?",
        answer: "Our engine uses a multi-layered verification process that checks your document's structural readability against the top 5 global ATS providers (Workday, iCIMS, Greenhouse, etc.)."
    },
    {
        question: "Can I import my existing LinkedIn profile?",
        answer: "Absolutely. Our LinkedIn Optimizer tool can scrap your public profile data and transform it into a high-impact cinematic resume in one click."
    }
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
        <div className="relative isolate">
            {/* Ambient Background Mesh */}
            <div className="fixed inset-0 -z-10 opacity-[0.08] dark:opacity-[0.12] animate-mesh filter blur-[80px]" />
            
            <section className="w-full py-16 sm:py-24 md:py-48 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="flex flex-col items-center text-center space-y-8"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
                            <Sparkles className="w-3 h-3" /> The Future of Careers is Here
                        </motion.div>
                        
                        <motion.h1 
                            variants={itemVariants} 
                            className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                        >
                            Don't just write a <span className="text-gradient">resume</span>
                        </motion.h1>
                        
                        <motion.div variants={itemVariants} className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl min-h-[50px] sm:min-h-[60px] md:min-h-[80px] lg:min-h-[90px] w-full max-w-[90vw] overflow-visible">
                            <TypingAnimation 
                                phrases={[
                                    "Design your future.",
                                    "Build your career.",
                                    "Land your dream job.",
                                    "Showcase your skills."
                                ]}
                                colors={['text-primary', 'text-purple-400', 'text-foreground', 'text-blue-400']}
                            />
                        </motion.div>
                        
                        <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-muted-foreground/80 md:text-xl leading-relaxed">
                            Experience the most advanced AI-powered resume builder. We combine minimalist design with powerful algorithms to help you bypass ATS and land interviews at top companies.
                        </motion.p>
                        
                        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row justify-center pt-4 w-full px-4 sm:px-0">
                            <Button asChild size="lg" variant="premium" className="h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full w-full sm:w-auto">
                                <Link href="/templates">
                                    Start Building Now
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="glass" className="h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full border-primary/20 hover:border-primary/40 w-full sm:w-auto">
                                <Link href="#features">
                                    Explore Features
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-64 h-64 bg-primary/20 rounded-full blur-[120px] animae-pulse" />
                <div className="absolute bottom-1/4 right-0 -z-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
            </section>

            <TrustMarquee />
            
            <section className="py-10 md:py-12 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-2xl md:text-5xl font-black font-headline text-primary mb-2 transition-transform group-hover:scale-110"
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <motion.section 
                className="relative w-full py-16 sm:py-24 md:py-40"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div id="how-it-works" className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 sm:mb-16">
                        <motion.div variants={itemVariants} className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20">The Process</motion.div>
                        <motion.h2 variants={itemVariants} className="text-3xl font-headline font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-gradient">Three Steps to Perfection</motion.h2>
                        <motion.p variants={itemVariants} className="max-w-[600px] text-muted-foreground md:text-lg">Our streamlined workflow ensures you get the best results with minimal effort.</motion.p>
                    </div>
                    <motion.div
                        variants={sectionVariants}
                        className="mx-auto grid items-start gap-6 sm:gap-8 sm:max-w-5xl sm:grid-cols-3 md:gap-12"
                    >
                        <motion.div variants={itemVariants} className="premium-card text-center group p-6 sm:p-8">
                            <div className="flex flex-col gap-4 items-center">
                                <div className="bg-primary/10 p-5 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                    <FileText className="w-10 h-10 text-primary transition-transform group-hover:scale-110"/>
                                </div>
                                <h3 className="text-2xl font-bold font-headline">1. Choose</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Select from 20+ designer templates optimized for your specific industry and seniority.</p>
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="premium-card text-center group">
                            <div className="flex flex-col gap-4 items-center">
                                <div className="bg-purple-500/10 p-5 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                                    <Sparkles className="w-10 h-10 text-purple-500 transition-transform group-hover:scale-110"/>
                                </div>
                                <h3 className="text-2xl font-bold font-headline">2. Refine</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Our AI analyzes your experience and suggests high-impact bullet points that get seen.</p>
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="premium-card text-center group p-6 sm:p-8">
                            <div className="flex flex-col gap-4 items-center">
                                <div className="bg-blue-500/10 p-5 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                                    <Zap className="w-10 h-10 text-blue-500 transition-transform group-hover:scale-110"/>
                                </div>
                                <h3 className="text-2xl font-bold font-headline">3. Dominate</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Export in multiple formats and track your applications with our built-in career tools.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

             <motion.section 
                className="relative w-full py-16 sm:py-24 md:py-40 bg-white/[0.02] dark:bg-black/[0.02] border-y border-white/5"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                ref={featuresRef}
            >
                <div id="features" className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <motion.div variants={sectionVariants} className="space-y-8 sm:space-y-10">
                            <motion.div variants={itemVariants} className="space-y-4">
                                <div className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest border">The Engine</div>
                                <h2 className="text-3xl font-headline font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-gradient">Built for the modern market</h2>
                                <p className="text-muted-foreground md:text-lg leading-relaxed">Every feature is engineered to solve a specific hurdle in your job search, from initial draft to final interview.</p>
                            </motion.div>
                            <motion.div
                                variants={sectionVariants}
                                className="grid gap-6"
                            >
                                {features.map((feature, index) => (
                                <motion.div 
                                    key={index}
                                    variants={itemVariants}
                                    className="premium-card flex items-start gap-6 group hover:translate-x-2 transition-all"
                                >
                                    <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{feature.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            className="flex items-center justify-center relative"
                            style={{ opacity, scale }}
                        >
                            <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full -z-10" />
                            <AnimatedResume className="w-full max-w-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]" />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Comparison Section */}
            <section className="py-16 sm:py-24 md:py-40 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 sm:mb-20 space-y-4">
                        <div className="inline-block rounded-full bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest border">The FitCV Advantage</div>
                        <h2 className="text-3xl font-headline font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-gradient">Why settle for ordinary?</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        <div className="premium-card bg-destructive/5 border-destructive/10 hover:border-destructive/30 p-6 sm:p-8">
                            <h3 className="text-2xl font-bold font-headline mb-6 text-destructive flex items-center gap-2">
                                <XCircle className="w-6 h-6" /> Traditional Builders
                            </h3>
                            <div className="space-y-4">
                                <p className="flex items-center gap-3 text-muted-foreground"><XCircle className="w-5 h-5 opacity-50" /> Manual keyword research</p>
                                <p className="flex items-center gap-3 text-muted-foreground"><XCircle className="w-5 h-5 opacity-50" /> Generic bullet points</p>
                                <p className="flex items-center gap-3 text-muted-foreground"><XCircle className="w-5 h-5 opacity-50" /> Guessing if it's ATS-friendly</p>
                                <p className="flex items-center gap-3 text-muted-foreground"><XCircle className="w-5 h-5 opacity-50" /> Limited to just the document</p>
                            </div>
                        </div>
                        <div className="premium-card bg-primary/5 border-primary/20 hover:border-primary/40 p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold font-headline mb-6 text-primary flex items-center gap-2">
                                <Sparkles className="w-6 h-6" /> The FitCV Way
                            </h3>
                            <div className="space-y-4 font-medium text-foreground">
                                <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> AI-driven keyword matching</p>
                                <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Custom impact-driven writing</p>
                                <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Verified ATS-optimized templates</p>
                                <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Complete interview prep suite</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-24 md:py-40 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12 sm:mb-16 space-y-4">
                            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20">Clarity & Confidence</div>
                            <h2 className="text-3xl font-headline font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-gradient">Common Inquiries</h2>
                            <p className="text-muted-foreground">Everything you need to know about the FitCV ecosystem.</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="bg-glass rounded-2xl border-white/5 px-6">
                                    <AccordionTrigger className="text-lg font-headline font-bold hover:no-underline py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            <section 
                className="relative w-full py-16 sm:py-24 md:py-40 bg-white/[0.02] dark:bg-black/[0.02] border-y border-white/5"
            >
                <div id="testimonials" className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 sm:mb-16">
                        <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20">Success Stories</div>
                        <h2 className="text-3xl font-headline font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-gradient">Loved by ambitious seekers</h2>
                    </div>
                    <div>
                        <Carousel
                        opts={{ align: "start", loop: true }}
                        plugins={[Autoplay({ delay: 5000 })]}
                        className="w-full max-w-6xl mx-auto"
                        >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => {
                            const image = PlaceHolderImages.find(img => img.id === testimonial.imageId);
                            return (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                                <div className="premium-card h-full flex flex-col justify-between group">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                            ))}
                                        </div>
                                        <p className="text-lg text-muted-foreground/90 italic leading-relaxed">"{testimonial.quote}"</p>
                                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                            {image && <AvatarImage src={image.imageUrl} alt={testimonial.author} />}
                                            <AvatarFallback className="bg-primary/10 text-primary">{testimonial.author.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold">{testimonial.author}</p>
                                                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                            )})}
                        </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 sm:py-24 md:py-48 overflow-hidden relative w-full">
                <div className="container mx-auto px-4 text-center w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="premium-card w-full max-w-4xl mx-auto py-12 sm:py-20 px-4 sm:px-8 flex flex-col items-center space-y-6 sm:space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-purple-500/20 rounded-full blur-[100px]" />
                        
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-headline font-extrabold tracking-tight px-2">Ready to <span className="text-gradient">skyrocket</span> your career?</h2>
                        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl px-2">
                            Join over 10,000 professionals who used FitCV to land positions at companies like Google, Meta, and Tesla.
                        </p>
                        <Button asChild size="lg" variant="premium" className="h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl rounded-full shadow-2xl w-[90%] sm:w-auto overflow-hidden whitespace-nowrap text-ellipsis flex-nowrap shrink-0">
                            <Link href="/templates" className="flex items-center justify-center w-full">
                                <span className="truncate max-w-[calc(100%-2rem)]">Claim My Free Account</span>
                                <Sparkles className="ml-2 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                            </Link>
                        </Button>
                        <p className="text-sm text-muted-foreground opacity-60">
                            No credit card required. Free forever, unless you want more power.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
