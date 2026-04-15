
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics-events';
import Script from 'next/script';
import { useState } from 'react';

const resumeFeatures = [
  'All templates',
  'AI writing help',
  'ATS score',
  'PDF + Word export',
  'Cover letter generator',
  'Job tracker',
  'Unlimited saves',
];

const trustHighlights = [
  'Razorpay secured — UPI, Cards, Net Banking, Wallets',
  'Pay once, use whenever — no subscription lock-in',
  'Full refund within 24 hours, no questions asked',
  'Your resume data is always yours — export or delete anytime',
];

export default function PricingPage() {
  const { user, userProfile } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [processingPlan, setProcessingPlan] = useState<'standard' | 'pro' | null>(null);
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const paymentEnabled = Boolean(razorpayKey);

  const openRazorpay = async (plan: 'standard' | 'pro') => {
    if (!user) {
      router.push(`/signup?plan=interview-${plan}`);
      return;
    }
    setProcessingPlan(plan);
    trackEvent('payment_checkout_start', { provider: 'razorpay', plan });
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const payload = (await res.json()) as {
        ok: boolean;
        orderId?: string;
        amount?: number;
        currency?: string;
        error?: string;
      };
      if (!res.ok || !payload.ok || !payload.orderId || !payload.amount || !payload.currency) {
        throw new Error(payload.error || 'Could not create payment order');
      }

      const RazorpayCtor = (window as Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      if (!RazorpayCtor) {
        throw new Error('Razorpay checkout script did not load');
      }

      const checkout = new RazorpayCtor({
        key: razorpayKey,
        amount: payload.amount,
        currency: payload.currency,
        name: 'FitCV Interview Practice',
        description: plan === 'pro' ? 'Pro pack' : 'Standard pack',
        order_id: payload.orderId,
        prefill: {
          email: user.email ?? '',
          name: user.displayName ?? '',
        },
        handler: () => {
          toast({
            title: 'Payment authorized',
            description: 'We are confirming your interview pack. This usually takes a few seconds.',
          });
          trackEvent('payment_checkout_authorized', { provider: 'razorpay', plan });
          router.push('/settings');
        },
      });
      checkout.open();
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'Please retry.',
      });
      trackEvent('payment_checkout_fail', { provider: 'razorpay', plan });
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleInterviewCheckout = (plan: 'standard' | 'pro') => {
    trackEvent('pricing_cta_click', { authenticated: !!user, plan });
    if (paymentEnabled) {
      void openRazorpay(plan);
      return;
    }
    if (!user) {
      router.push(`/signup?plan=interview-${plan}`);
      return;
    }
    toast({
      title: 'Checkout is temporarily unavailable',
      description: 'Please add Razorpay keys to enable interview pack payments.',
    });
    router.push('/interview');
  };

  return (
    <div className="bg-background py-12 md:py-20">
      {paymentEnabled ? (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      ) : null}
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Simple, honest pricing</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Resume building is free. Always. No catches.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card variant="neuro" className="h-full border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Free Resume Builder</CardTitle>
              <CardDescription>₹0 · Forever</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {resumeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/templates">Start free</Link>
              </Button>
            </CardContent>
          </Card>

          <Card variant="neuro" className="h-full border-accent/30">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Interview Practice Packs</CardTitle>
              <CardDescription>Start free with 5 sessions. Upgrade when ready.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border p-4">
                <p className="text-sm font-semibold">Standard</p>
                <p className="text-sm text-muted-foreground line-through">₹299</p>
                <p className="text-2xl font-bold">₹99</p>
                <p className="text-sm text-muted-foreground mt-1">2 sessions · Full report</p>
                <Button
                  onClick={() => handleInterviewCheckout('standard')}
                  className="mt-3 w-full"
                  disabled={processingPlan !== null}
                >
                  {processingPlan === 'standard' ? 'Opening checkout...' : 'Get Standard'}
                </Button>
              </div>

              <div className="rounded-xl border-2 border-primary/30 p-4">
                <p className="text-sm font-semibold">Pro — Best Value</p>
                <p className="text-sm text-muted-foreground line-through">₹999</p>
                <p className="text-2xl font-bold">₹249</p>
                <p className="text-sm text-muted-foreground mt-1">
                  50 sessions · Priority AI · PDF report · 6 months validity
                </p>
                <Button
                  onClick={() => handleInterviewCheckout('pro')}
                  className="mt-3 w-full"
                  disabled={processingPlan !== null}
                >
                  {processingPlan === 'pro' ? 'Opening checkout...' : 'Go Pro'}
                </Button>
              </div>

              {userProfile?.subscription === 'premium' && (
                <p className="text-xs text-muted-foreground">
                  You already have premium access enabled on this account.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-8 max-w-5xl rounded-2xl border bg-card/40 p-5">
          <ul className="space-y-2">
            {trustHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
