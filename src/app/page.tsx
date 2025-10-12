
'use client';

import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/blog-posts';
import { ArrowRight, CheckCircle2, DraftingCompass, FileText, Sparkles, Zap, PenTool, FileSignature, BrainCircuit, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const features = [
  {
    icon: <DraftingCompass className="w-8 h-8 text-primary" />,
    title: 'Intuitive Editor',
    description: 'Effortlessly build and customize your resume with our user-friendly drag and drop editor.',
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'Professional Templates',
    description: 'Choose from a variety of modern, classic, and creative templates designed by experts.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'AI Content Writer',
    description: 'Let our AI write compelling resume content tailored to your target job in seconds.',
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: 'ATS-Optimized',
    description: 'Craft a resume that is optimized to pass through Applicant Tracking Systems and get seen by recruiters.',
  },
];

const sentences = [
    "gets you hired.",
    "lands you interviews.",
    "builds your future.",
    "showcases your skills."
];

const testimonials = [
  {
    quote: "ResumeAI transformed my job search. The AI writer is a game-changer, and I got more interviews in a week than I did in a month.",
    author: "Sarah J.",
    title: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    rating: 5,
  },
  {
    quote: "As a recent graduate, I was struggling to write a professional resume. This tool made it so easy, and the templates are beautiful. Highly recommended!",
    author: "Michael B.",
    title: "Marketing Graduate",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    rating: 5,
  },
  {
    quote: "I needed to update my resume quickly for a promotion. The intuitive editor and professional results saved me hours of work.",
    author: "Emily K.",
    title: "Project Manager",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    rating: 4,
  },
   {
    quote: "The cover letter generator is pure magic. It perfectly captured my experience and tailored it to the job description. I got the job!",
    author: "David L.",
    title: "UX Designer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
    rating: 5,
  },
];


const blogPostIcons: { [key: string]: React.FC<React.ComponentProps<'svg'>> } = {
  'ultimate-resume-guide-2024': PenTool,
  '5-common-resume-mistakes': FileSignature,
  'how-to-beat-ats': BrainCircuit,
};

const GridPatternBackground = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
    return (
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-background" />
        <svg
          className="absolute inset-0 h-full w-full stroke-secondary"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="-1"
              patternTransform="translate(0 -1)"
            >
              <path d="M0 72V0h72" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </motion.div>
    );
};


export default function Home() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSentenceIndex(prev => (prev + 1) % sentences.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  
  const sectionVariants = {
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };


  return (
    <div className="flex flex-col items-center bg-background text-foreground overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 relative h-auto">
        <GridPatternBackground />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div 
              variants={itemVariants}
              className="space-y-6 text-center md:text-left"
            >
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Build a resume that <br />
                <span className="text-primary transition-all duration-300 inline-block min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={sentenceIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {sentences[sentenceIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              <p className="max-w-lg mx-auto md:mx-0 text-muted-foreground md:text-xl">
                Create a professional, ATS-optimized resume in minutes. Let our AI guide you to landing your dream job.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
                <Button asChild size="lg" className="group">
                  <Link href="/templates">
                    Create My Resume
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative w-full py-20 md:py-32 bg-secondary/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, amount: 0.3 }}
                 transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                  <div className="inline-block rounded-lg bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium border">How It Works</div>
                  <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Three Simple Steps to Your Dream Job</h2>
              </motion.div>
              <motion.div 
                 variants={sectionVariants}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, amount: 0.2 }}
                 className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-3 md:gap-12"
              >
                  <motion.div variants={itemVariants} className="flex flex-col gap-4 items-center text-center p-6">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <FileText className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">1. Select a Template</h3>
                      <p className="text-muted-foreground">Choose from our library of professionally designed and ATS-friendly resume templates.</p>
                  </motion.div>
                   <motion.div variants={itemVariants} className="flex flex-col gap-4 items-center text-center p-6">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <Sparkles className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">2. Perfect with AI</h3>
                      <p className="text-muted-foreground">Use our AI assistant to write compelling bullet points, summaries, and cover letters.</p>
                  </motion.div>
                   <motion.div variants={itemVariants} className="flex flex-col gap-4 items-center text-center p-6">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <Zap className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">3. Download & Apply</h3>
                      <p className="text-muted-foreground">Export your pixel-perfect resume as a PDF and start landing interviews.</p>
                  </motion.div>
              </motion.div>
          </div>
      </section>

      {/* Features Section */}
       <section id="features" className="relative w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
                <motion.div variants={itemVariants} className="space-y-8">
                    <div className="space-y-4">
                      <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Everything You Need</div>
                      <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Features that help you stand out</h2>
                    </div>
                    <ul className="grid sm:grid-cols-1 gap-8">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-4">
                              <div className="bg-primary/10 p-3 rounded-full mt-1">
                                {feature.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-xl">{feature.title}</h3>
                                <p className="text-muted-foreground text-lg">{feature.description}</p>
                              </div>
                          </li>
                        ))}
                    </ul>
                </motion.div>
                 <motion.div variants={itemVariants} className="hidden md:flex justify-center">
                 </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative w-full py-20 md:py-32 bg-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="inline-block rounded-lg bg-background/50 backdrop-blur-sm border px-3 py-1 text-sm font-medium">What Our Users Say</div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Loved by Job Seekers Worldwide</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 5000 })]}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col justify-between h-full p-8" variant="neuro">
                        <CardContent className="p-0 flex flex-col gap-6">
                          <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                              ))}
                          </div>
                          <p className="text-lg text-muted-foreground flex-grow">"{testimonial.quote}"</p>
                          <div className="flex items-center gap-4 pt-6 border-t">
                            <Avatar>
                              <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                              <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-lg">{testimonial.author}</p>
                              <p className="text-md text-muted-foreground">{testimonial.title}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="relative w-full py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 md:px-6"
          >
               <div className="space-y-8 max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Don't just write a resume. Design your future.</h2>
                  <ul className="space-y-4 text-xl inline-flex flex-col items-start text-left">
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-accent h-6 w-6"/><span>AI-powered content suggestions.</span></li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-accent h-6 w-6"/><span>Professionally designed templates.</span></li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-accent h-6 w-6"/><span>Intuitive real-time editor.</span></li>
                  </ul>
              </div>
          </motion.div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="relative w-full py-20 md:py-32 bg-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="inline-block rounded-lg bg-background/50 backdrop-blur-sm border px-3 py-1 text-sm font-medium">From Our Blog</div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Career Advice & Resume Tips</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Get the latest insights from our career experts to help you land your dream job.
            </p>
          </motion.div>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 md:grid-cols-3"
          >
            {blogPosts.slice(0, 3).map((post) => {
                const Icon = blogPostIcons[post.slug] || PenTool;
                return (
                    <motion.div key={post.slug} variants={itemVariants}>
                      <Card className="group overflow-hidden flex flex-col h-full" variant="neuro">
                          <Link href={`/blog/${post.slug}`} className="block overflow-hidden relative h-48">
                              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                  <motion.div whileHover={{ scale: 1.2, rotate: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Icon className="w-24 h-24 text-primary/50" />
                                  </motion.div>
                              </div>
                          </Link>
                          <CardContent className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.description}</p>
                          <Button variant="link" asChild className="p-0 h-auto self-start">
                              <Link href={`/blog/${post.slug}`}>
                              Read More <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                          </Button>
                          </CardContent>
                      </Card>
                    </motion.div>
                )
            })}
          </motion.div>
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-12"
           >
                <Button asChild size="lg" variant="outline">
                    <Link href="/blog">View All Articles</Link>
                </Button>
            </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative w-full py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 md:px-6 text-center"
        >
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Ready to Build Your Future?</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
            Start for free and see how ResumeAI can transform your job search. No credit card required.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="group">
              <Link href="/templates">
                Create Your Resume Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
