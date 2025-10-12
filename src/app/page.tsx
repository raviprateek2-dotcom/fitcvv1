
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, DraftingCompass, FileText, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const features = [
  {
    icon: <DraftingCompass className="w-8 h-8 text-primary" />,
    title: 'Intuitive Editor',
    description: 'Effortlessly build and customize your resume with our user-friendly editor.',
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'Professional Templates',
    description: 'Choose from a variety of modern, classic, and creative templates designed by experts.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'AI Content Writer',
    description: 'Let our AI write compelling resume content tailored to your target job.',
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: 'ATS-Optimized',
    description: 'Craft a resume optimized to pass through Applicant Tracking Systems.',
  },
];

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground animate-fade-in-up">
                Build a Resume That Gets Results. Fast.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl animate-fade-in-up animation-delay-200">
                Create a professional, ATS-friendly resume in minutes. Let our AI guide you to landing your dream job.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
                <Button asChild size="lg" className="group">
                  <Link href="/templates">
                    Start Building Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center animate-fade-in animation-delay-300">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  width={600}
                  height={400}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  className="rounded-xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm animate-fade-in">Key Features</div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-up animation-delay-200">Why You'll Love It</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up animation-delay-400">
              We provide all the tools you need to create a professional resume that stands out.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className={`animate-fade-in-up`} style={{ animationDelay: `${200 + index * 150}ms` }}>
                <Card className="bg-background shadow-lg hover:shadow-xl transition-transform duration-300 h-full flex flex-col hover:-translate-y-2">
                  <CardHeader className="flex flex-col items-center text-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground flex-grow">
                    {feature.description}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is ResumeCraft AI free?</AccordionTrigger>
                <AccordionContent>
                  Yes, our free plan lets you create one resume with basic templates. Upgrade to Pro for unlimited access and premium features.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does the AI help?</AccordionTrigger>
                <AccordionContent>
                  Our AI suggests improvements, rephrases bullet points, and tailors your content to a specific job description to boost your chances.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Are the resumes ATS-friendly?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. All our templates are designed and structured to be fully compatible with modern Applicant Tracking Systems.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I download my resume as a PDF?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can download a high-quality PDF from the editor. Our Pro plan offers downloads without any watermarks.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center animate-fade-in-up">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Ready to Build Your Future?</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
            Start for free and see how ResumeCraft AI can transform your job search. No credit card required.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="group">
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
