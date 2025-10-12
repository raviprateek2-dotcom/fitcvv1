
'use client';

import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/blog-posts';
import { ArrowRight, CheckCircle2, DraftingCompass, FileText, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const features = [
  {
    icon: <DraftingCompass className="w-6 h-6 text-primary" />,
    title: 'Intuitive Editor',
    description: 'Effortlessly build and customize your resume with our user-friendly drag and drop editor.',
  },
  {
    icon: <FileText className="w-6 h-6 text-primary" />,
    title: 'Professional Templates',
    description: 'Choose from a variety of modern, classic, and creative templates designed by experts.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: 'AI Content Writer',
    description: 'Let our AI write compelling resume content tailored to your target job in seconds.',
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
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
    quote: "ResumeCraft AI transformed my job search. The AI writer is a game-changer, and I got more interviews in a week than I did in a month.",
    author: "Sarah J.",
    title: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    quote: "As a recent graduate, I was struggling to write a professional resume. This tool made it so easy, and the templates are beautiful. Highly recommended!",
    author: "Michael B.",
    title: "Marketing Graduate",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d"
  },
  {
    quote: "I needed to update my resume quickly for a promotion. The intuitive editor and professional results saved me hours of work.",
    author: "Emily K.",
    title: "Project Manager",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d"
  },
   {
    quote: "The cover letter generator is pure magic. It perfectly captured my experience and tailored it to the job description. I got the job!",
    author: "David L.",
    title: "UX Designer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d"
  },
];


export default function Home() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentSentence = sentences[sentenceIndex];
      
      if (isDeleting) {
        setTypedText(currentSentence.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        setTypedText(currentSentence.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }

      if (!isDeleting && charIndex === currentSentence.length) {
        // Pause at end of sentence
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      }
    };

    const typingTimeout = setTimeout(handleTyping, charIndex === sentences[sentenceIndex].length ? 2000 : (isDeleting ? 75 : 150));
    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, sentenceIndex]);


  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-1 text-center gap-12 items-center">
             <div className="space-y-6">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl animate-fade-in-up">
                Build a resume that <br className="md:hidden"/>
                <span className="text-primary transition-all duration-300 min-h-[60px] sm:min-h-[70px] md:min-h-[80px] inline-block">
                    {typedText}
                    <span className="animate-ping">|</span>
                </span>
              </h1>
              
              <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-400 justify-center">
                <Button asChild size="lg" className="group transition-transform duration-300 hover:scale-105" variant="neuro">
                  <Link href="/templates">
                    Create My Resume
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-20 md:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                  <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-medium animate-fade-in">How It Works</div>
                  <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-up animation-delay-200">Three Simple Steps to Your Dream Job</h2>
              </div>
              <div className="mx-auto grid items-stretch gap-8 sm:max-w-4xl sm:grid-cols-3 md:gap-12">
                  <div className="flex flex-col gap-4 items-center text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm shadow-cyber-dark animate-fade-in-up animation-delay-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <FileText className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">1. Select a Template</h3>
                      <p className="text-muted-foreground">Choose from our library of professionally designed and ATS-friendly resume templates.</p>
                  </div>
                   <div className="flex flex-col gap-4 items-center text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm shadow-cyber-dark animate-fade-in-up animation-delay-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <Sparkles className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">2. Perfect with AI</h3>
                      <p className="text-muted-foreground">Use our AI assistant to write compelling bullet points, summaries, and cover letters.</p>
                  </div>
                   <div className="flex flex-col gap-4 items-center text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm shadow-cyber-dark animate-fade-in-up animation-delay-600 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <Zap className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">3. Download & Apply</h3>
                      <p className="text-muted-foreground">Export your pixel-perfect resume as a PDF and start landing interviews.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Features Section */}
       <section id="features" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-1 gap-16 items-center">
                 <div className="space-y-8 max-w-3xl mx-auto text-center animate-fade-in-up">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Everything You Need</div>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animation-delay-200">Features that help you stand out</h2>
                    <p className="text-muted-foreground md:text-lg animation-delay-300">
                        ResumeCraft AI provides all the tools you need to create a professional resume that gets noticed by both recruiters and automated systems.
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-6 animation-delay-400 text-left">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-4">
                              <div className="bg-primary/10 p-2 rounded-full mt-1">
                                {feature.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                              </div>
                          </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-medium animate-fade-in">What Our Users Say</div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-up animation-delay-200">Loved by Job Seekers Worldwide</h2>
          </div>
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full max-w-4xl mx-auto animate-fade-in-up animation-delay-400"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col justify-between h-full" variant="neuro">
                      <CardContent className="p-6 flex flex-col gap-4">
                        <p className="text-muted-foreground">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4 pt-4">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                            <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
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
        </div>
      </section>


      {/* Why Us Section */}
      <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
               <div className="grid md:grid-cols-1 gap-16 items-center">
                   <div className="space-y-6 max-w-3xl mx-auto text-center animate-fade-in-up">
                      <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Don't just write a resume. Design your future.</h2>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl animation-delay-200">
                          We blend beautiful design with powerful AI to give you an unfair advantage in your job search. Go beyond boring templates and create a resume that truly reflects your skills and personality.
                      </p>
                      <ul className="space-y-4 text-lg animation-delay-300 inline-flex flex-col items-start">
                        <li className="flex items-center gap-3"><CheckCircle2 className="text-primary h-6 w-6"/><span>AI-powered content suggestions.</span></li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="text-primary h-6 w-6"/><span>Professionally designed templates.</span></li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="text-primary h-6 w-6"/><span>Intuitive real-time editor.</span></li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="w-full py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-medium animate-fade-in">From Our Blog</div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-up animation-delay-200">Career Advice & Resume Tips</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg animation-delay-300">
              Get the latest insights from our career experts to help you land your dream job.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 animate-fade-in-up animation-delay-400">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.slug} className="group overflow-hidden" variant="neuro">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{post.description}</p>
                  <Button variant="link" asChild className="p-0 h-auto">
                     <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-12 animate-fade-in-up animation-delay-600">
                <Button asChild size="lg" variant="outline">
                    <Link href="/blog">View All Articles</Link>
                </Button>
            </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center animate-fade-in-up">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Ready to Build Your Future?</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
            Start for free and see how ResumeCraft AI can transform your job search. No credit card required.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="group" variant="neuro">
              <Link href="/templates">
                Create Your Resume Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

    