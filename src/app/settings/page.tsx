'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const subscriptionStatus = 'Pro'; // This would come from your user data in Firestore

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription plan and billing information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div>
                            <p className="font-semibold">Current Plan</p>
                            <p className="text-2xl font-bold text-primary">{subscriptionStatus}</p>
                        </div>
                        {subscriptionStatus === 'Pro' ? (
                            <Button variant="outline">Manage Subscription</Button>
                        ) : (
                            <Button>Upgrade to Pro</Button>
                        )}
                    </div>
                     <p className="text-sm text-muted-foreground">
                        Your Pro plan is active. You can manage your subscription details, view invoices, or cancel your plan through our secure payment provider.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
