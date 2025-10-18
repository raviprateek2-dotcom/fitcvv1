
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
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Simple, Transparent Pricing</motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for you. No hidden fees.</motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 justify-center items-stretch gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full">
            <Card className="shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105" variant="neuro">
              <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl">Free</CardTitle>
                <CardDescription>Perfect for getting started and landing your first interview.</CardDescription>
                <div className="text-5xl font-bold mt-4">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow">
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

          <motion.div variants={itemVariants} className="w-full">
            <Card className="shadow-2xl border-2 border-primary/50 relative h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105" variant="neuro">
               <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <div className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pro Plan
                </div>
              </div>
              <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl text-primary">Go Pro</CardTitle>
                <CardDescription>Unlock all features to land your dream job, faster.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow">
                <ul className="space-y-4 mb-8">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-4">
                    <div className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Monthly</p>
                            <p className="text-2xl font-bold">₹499</p>
                        </div>
                        <Button onClick={() => handleUpgrade('pro-monthly')}>Choose Plan</Button>
                    </div>
                     <div className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">6 Months</p>
                            <p className="text-2xl font-bold">₹999</p>
                        </div>
                        <Button onClick={() => handleUpgrade('pro-6-months')}>Choose Plan</Button>
                    </div>
                     <div className="border-2 border-accent p-4 rounded-lg flex justify-between items-center relative">
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <div className="bg-accent text-accent-foreground px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Best Value
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-accent">Yearly</p>
                            <p className="text-2xl font-bold">₹1499</p>
                        </div>
                        <Button onClick={() => handleUpgrade('pro-yearly')} variant="default" style={{backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}>Choose Plan</Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        <p className="text-center text-muted-foreground text-sm mt-12">All prices are in INR. You can cancel your subscription at any time.</p>
      </div>
    </div>
  );
}

    