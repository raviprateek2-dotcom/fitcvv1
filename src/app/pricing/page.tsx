import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const freeFeatures = [
  '1 Resume',
  '1 Template',
  'PDF Export',
  'Basic AI Suggestions',
];

const proFeatures = [
  'Unlimited Resumes',
  'All Templates',
  'Advanced AI Suggestions',
  'ATS Compatibility Checker',
  'Cloud Storage',
  'Priority Support',
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for you.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Free</CardTitle>
            <CardDescription>Perfect for getting started.</CardDescription>
            <div className="text-5xl font-bold mt-4">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/signup">Get Started</a>
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-md shadow-2xl border-primary scale-105 bg-background relative">
           <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
             <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
               Most Popular
             </div>
           </div>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">Pro</CardTitle>
            <CardDescription>Unlock all features to land your dream job.</CardDescription>
            <div className="text-5xl font-bold mt-4">$19<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/signup">Go Pro</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
