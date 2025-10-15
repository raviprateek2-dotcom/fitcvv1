
'use client';

import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

const SettingsSkeleton = () => (
  <div className="grid gap-8 md:grid-cols-3">
    <div className="md:col-span-2 space-y-8">
      <Card>
          <CardHeader>
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-36" />
              </div>
          </CardContent>
      </Card>
       <Card>
          <CardHeader>
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
               <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
      </Card>
    </div>
  </div>
);


export default function SettingsPage() {
  const { user, isUserLoading, userProfile, isProfileLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user, isUserLoading, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    
    try {
      await updateProfile(user, { displayName });
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update your profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const subscriptionStatus = userProfile?.subscription === 'premium' ? 'Pro' : 'Free';
  
  if (isUserLoading || isProfileLoading || !user) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Skeleton className="h-9 w-48 mb-8" />
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription plan and billing information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div>
                            <p className="font-semibold">Current Plan</p>
                            <p className="text-2xl font-bold text-primary capitalize">{subscriptionStatus}</p>
                        </div>
                        {subscriptionStatus === 'Pro' ? (
                            <Button variant="outline" disabled>Manage Subscription</Button>
                        ) : (
                            <Button asChild>
                              <Link href="/pricing">Upgrade to Pro</Link>
                            </Button>
                        )}
                    </div>
                     <p className="text-sm text-muted-foreground">
                        {subscriptionStatus === 'Pro' 
                          ? 'Your Pro plan is active. You can manage your subscription details, view invoices, or cancel your plan through our secure payment provider.'
                          : 'You are currently on the Free plan. Upgrade to Pro to unlock unlimited resumes, advanced AI features, and more.'
                        }
                    </p>
                </CardContent>
            </Card>

            <Card>
              <form onSubmit={handleProfileUpdate}>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ''} disabled />
                     <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
