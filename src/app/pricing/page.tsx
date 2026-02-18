'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';
import { Check, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const proFeatures = [
  'Unlimited Resumes & Downloads',
  'Access to All Premium Templates',
  'Advanced AI Content Writer',
  'ATS Compatibility Checker',
  'No Watermarks, No Branding',
  'Priority Customer Support',
];

export default function PricingPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleUpgrade = () => {
    if (!user) {
      router.push(`/signup?plan=pro-free`);
      return;
    }
    if (!firestore) return;

    if (userProfile?.subscription === 'premium') {
        toast({
            title: 'Already on Pro!',
            description: "You already have access to all premium features.",
        });
        router.push('/dashboard');
        return;
    }

    const userDocRef = doc(firestore, `users/${user.uid}`);
    updateDocumentNonBlocking(userDocRef, { subscription: 'premium' });
    toast({
      title: 'Success!',
      description: "Welcome to Pro! You now have access to all features for free.",
    });
    router.push('/dashboard');
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
          <motion.h1 variants={itemVariants} className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Professional Power, Totally Free</motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-lg text-muted-foreground">We've made all FitCV Pro features free for everyone. Build your future without limits.</motion.p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full">
            <Card className="shadow-2xl border-2 border-primary relative h-full flex flex-col transition-all duration-300" variant="neuro">
               <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Free Forever
                </div>
              </div>
              <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl text-primary">FitCV Pro</CardTitle>
                <CardDescription>Unlock all features to land your dream job, faster. Now at zero cost.</CardDescription>
                <div className="text-5xl font-bold mt-4">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
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
                     <div className="border-2 border-accent p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 relative">
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <div className="bg-accent text-accent-foreground px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Current Offer
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-accent">Full Access</p>
                            <p className="text-2xl font-bold">$0.00</p>
                        </div>
                        <Button 
                            onClick={handleUpgrade} 
                            size="lg"
                            className="w-full sm:w-auto"
                            variant="default" 
                            style={{backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}
                        >
                            {userProfile?.subscription === 'premium' ? 'Current Plan' : 'Get Started for Free'}
                        </Button>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0 text-center">
                  <p className="text-xs text-muted-foreground w-full">No credit card required. No hidden fees. Just great resumes.</p>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
