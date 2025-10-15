'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';
import { Check, X, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleUpgrade = (plan: string) => {
    if (!user) {
      router.push(`/signup?plan=${plan}`);
      return;
    }
    if (!firestore) return;

    const userDocRef = doc(firestore, `users/${user.uid}`);
    updateDocumentNonBlocking(userDocRef, { subscription: 'premium' });
    toast({
      title: 'Upgrade Successful!',
      description: "Welcome to Pro! You now have access to all premium features.",
    });
    router.push('/settings');
  };

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

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for you. No hidden fees.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 justify-center items-stretch gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full lg:col-span-1">
            <Card className="shadow-lg bg-card h-full" variant="neuro">
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
              <CardFooter className="p-8 pt-0 mt-auto">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full lg:col-span-1">
            <Card className="shadow-2xl border-2 border-primary/50 bg-card relative h-full" variant="neuro">
               <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <div className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Monthly
                </div>
              </div>
              <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl text-primary">Pro Monthly</CardTitle>
                <CardDescription>Unlock all features to land your dream job, faster.</CardDescription>
                <div className="text-5xl font-bold mt-4">₹499<span className="text-lg font-normal text-muted-foreground">/month</span></div>
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
              <CardFooter className="p-8 pt-0 mt-auto">
                <Button className="w-full" onClick={() => handleUpgrade('pro-monthly')} variant="default">
                  Go Pro
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants} className="w-full lg:col-span-1">
            <Card className="shadow-2xl border-2 border-primary/50 bg-card relative h-full" variant="neuro">
              <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl text-primary">Pro 6-Months</CardTitle>
                <CardDescription>A great option for a dedicated job search period.</CardDescription>
                <div className="text-5xl font-bold mt-4">₹999<span className="text-lg font-normal text-muted-foreground">/6 mo.</span></div>
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
              <CardFooter className="p-8 pt-0 mt-auto">
                <Button className="w-full" onClick={() => handleUpgrade('pro-6-months')} variant="default">
                  Choose Plan
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full lg:col-span-1">
            <Card className="shadow-2xl border-2 border-accent bg-card relative h-full" variant="neuro">
              <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Best Value
                </div>
              </div>
              <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl text-accent">Pro Yearly</CardTitle>
                <CardDescription>Get a full year of premium access and save big.</CardDescription>
                <div className="text-5xl font-bold mt-4">₹1499<span className="text-lg font-normal text-muted-foreground">/year</span></div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 mt-auto">
                <Button className="w-full" onClick={() => handleUpgrade('pro-yearly')} variant="default" style={{backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}>
                  Choose Plan
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

        </motion.div>
        <p className="text-center text-muted-foreground text-sm mt-12">All prices are in INR. You can cancel your subscription at any time.</p>
      </div>
    </div>
  );
}
