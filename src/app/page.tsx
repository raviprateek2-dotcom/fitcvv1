
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, DraftingCompass, FileText, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

const featuresImage = PlaceHolderImages.find((img) => img.id === 'features-image');
const whyUsImage = PlaceHolderImages.find((img) => img.id === 'why-us-image');

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl animate-fade-in-up">
                The fastest way to create a resume that gets you hired.
              </h1>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl animate-fade-in-up animation-delay-200">
                Our AI-powered resume builder helps you create a professional, ATS-friendly resume in minutes. No more writer's block, no more formatting nightmares.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center animate-fade-in-up animation-delay-400">
                <Button asChild size="lg" className="group shadow-cyber-light">
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
              <div className="mx-auto grid items-start gap-8 sm:max-w-4xl md:grid-cols-3 md:gap-12">
                  <div className="flex flex-col gap-4 items-center text-center p-6 rounded-2xl bg-background shadow-cyber-dark animate-fade-in-up animation-delay-200">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <FileText className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">1. Select a Template</h3>
                      <p className="text-muted-foreground">Choose from our library of professionally designed and ATS-friendly resume templates.</p>
                  </div>
                   <div className="flex flex-col gap-4 items-center text-center p-6 rounded-2xl bg-background shadow-cyber-dark animate-fade-in-up animation-delay-400">
                      <div className="bg-primary/10 p-4 rounded-full">
                         <Sparkles className="w-8 h-8 text-primary"/>
                      </div>
                      <h3 className="text-xl font-bold font-headline">2. Perfect with AI</h3>
                      <p className="text-muted-foreground">Use our AI assistant to write compelling bullet points, summaries, and cover letters.</p>
                  </div>
                   <div className="flex flex-col gap-4 items-center text-center p-6 rounded-2xl bg-background shadow-cyber-dark animate-fade-in-up animation-delay-600">
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
            <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium animate-fade-in">Everything You Need</div>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-up animation-delay-200">Features that help you stand out</h2>
                    <p className="text-muted-foreground md:text-lg">
                        ResumeCraft AI provides all the tools you need to create a professional resume that gets noticed by both recruiters and automated systems.
                    </p>
                    <ul className="grid gap-6">
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
                 <div className="flex justify-center animate-fade-in animation-delay-300 rounded-lg overflow-hidden">
                    {featuresImage && (
                        <Image
                        src={featuresImage.imageUrl}
                        width={600}
                        height={700}
                        alt={featuresImage.description}
                        data-ai-hint={featuresImage.imageHint}
                        className="rounded-2xl shadow-cyber-dark object-cover w-full h-full"
                        />
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="w-full py-20 md:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
               <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center animate-fade-in animation-delay-300 rounded-lg overflow-hidden">
                      {whyUsImage && (
                          <Image
                          src={whyUsImage.imageUrl}
                          width={600}
                          height={500}
                          alt={whyUsImage.description}
                          data-ai-hint={whyUsImage.imageHint}
                          className="rounded-2xl shadow-cyber-dark object-cover w-full h-full"
                          />
                      )}
                  </div>
                   <div className="space-y-6">
                      <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-up">Don't just write a resume. Design your future.</h2>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl animate-fade-in-up animation-delay-200">
                          We blend beautiful design with powerful AI to give you an unfair advantage in your job search. Go beyond boring templates and create a resume that truly reflects your skills and personality.
                      </p>
                      <ul className="space-y-4 text-lg">
                        <li className="flex items-center gap-3"><CheckCircle2 className="text-primary h-6 w-6"/><span>AI-powered content suggestions.</span></li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="text-primary h-6 w-6"/><span>Professionally designed templates.</span></li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="text-primary h-6 w-6"/><span>Intuitive real-time editor.</span></li>
                      </ul>
                  </div>
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
            <Button asChild size="lg" className="group shadow-cyber-light">
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
