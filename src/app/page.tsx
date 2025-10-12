import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, DraftingCompass, FileText, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <DraftingCompass className="w-8 h-8 text-primary" />,
    title: 'Intuitive Editor',
    description: 'Effortlessly build your resume with our user-friendly drag-and-drop editor.',
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'Professional Templates',
    description: 'Choose from a variety of modern, classic, and creative templates.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'AI Content Suggestions',
    description: 'Enhance your resume with AI-powered content improvements and suggestions.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'ATS-Friendly',
    description: 'Optimize your resume for Applicant Tracking Systems to get noticed.',
  },
];

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                Craft Your Future with an AI-Powered Resume
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Build a professional, ATS-friendly resume in minutes. Let our AI guide you to crafting the perfect application that lands you your dream job.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="group">
                  <Link href="/templates">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center animate-fade-in">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  width={600}
                  height={400}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  className="rounded-xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
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
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-up animation-delay-200">Why Choose ResumeCraft AI?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up animation-delay-400">
              We provide all the tools you need to create a resume that stands out from the crowd.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className={`animate-fade-in-up animation-delay-${600 + index * 100}`}>
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
        <div className="container mx-auto px-4 md:px-6 text-center animate-fade-in">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Ready to build your future?</h2>
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
