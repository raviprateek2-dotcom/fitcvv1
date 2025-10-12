import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const freeFeatures = [
  { text: '1 Resume', included: true },
  { text: 'Basic Templates', included: true },
  { text: 'PDF Export with Watermark', included: true },
  { text: 'Basic AI Suggestions', included: true },
  { text: 'Unlimited Resumes', included: false },
  { text: 'Access to All Templates', included: false },
  { text: 'Advanced AI Features', included: false },
  { text: 'Priority Support', included: false },
];

const proFeatures = [
  'Unlimited Resumes & Downloads',
  'Access to All Premium Templates',
  'Advanced AI Content Writer',
  'ATS Compatibility Checker',
  'No Watermarks, No Branding',
  'Priority Customer Support',
];

export default function PricingPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for you. No hidden fees.</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8">
          <Card className="w-full max-w-md shadow-lg bg-background">
            <CardHeader className="text-center p-8">
              <CardTitle className="font-headline text-3xl">Free</CardTitle>
              <CardDescription>Perfect for getting started and landing your first interview.</CardDescription>
              <div className="text-5xl font-bold mt-4">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <ul className="space-y-4">
                {freeFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    <span className={!feature.included ? 'text-muted-foreground line-through' : ''}>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full max-w-md shadow-2xl border-2 border-primary bg-background relative">
            <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </div>
            </div>
            <CardHeader className="text-center p-8">
              <CardTitle className="font-headline text-3xl text-primary">Pro</CardTitle>
              <CardDescription>Unlock all features to land your dream job, faster.</CardDescription>
              <div className="text-5xl font-bold mt-4">$19<span className="text-lg font-normal text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <ul className="space-y-4">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button className="w-full" asChild>
                <Link href="/signup?plan=pro">Go Pro</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <p className="text-center text-muted-foreground text-sm mt-12">All prices are in USD. You can cancel your subscription at any time.</p>
      </div>
    </div>
  );
}
