'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { Check, X } from 'lucide-react';
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

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/signup?plan=pro');
      return;
    }
    if (!firestore) return;

    const userDocRef = doc(firestore, `users/${user.uid}`);
    try {
      await updateDoc(userDocRef, { subscription: 'premium' });
      toast({
        title: 'Upgrade Successful!',
        description: "Welcome to Pro! You now have access to all premium features.",
      });
      router.push('/settings');
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upgrade Failed',
        description: 'We couldn\'t process your upgrade. Please try again.',
      });
    }
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
          className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full max-w-md">
            <Card className="shadow-lg bg-card h-full">
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
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-md">
            <Card className="shadow-2xl border-2 border-primary bg-card relative h-full">
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
                <Button className="w-full" onClick={handleUpgrade}>
                  Go Pro
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
        <p className="text-center text-muted-foreground text-sm mt-12">All prices are in USD. You can cancel your subscription at any time.</p>
      </div>
    </div>
  );
}
