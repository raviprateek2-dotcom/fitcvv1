
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
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { signOut } from 'firebase/auth';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState({ newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showReauthDialog, setShowReauthDialog] = useState(false);
  const [reauthAction, setReauthAction] = useState<(() => Promise<void>) | null>(null);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user, isUserLoading, router]);

  const handleReauth = async () => {
    if (!user || !currentPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Password is required.' });
      return;
    }
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      setShowReauthDialog(false);
      setCurrentPassword('');
      if (reauthAction) {
        await reauthAction();
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Authentication Failed', description: 'The password you entered is incorrect.' });
    }
  };

  const withReauthentication = (action: () => Promise<void>) => async () => {
    try {
      await action();
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({ variant: 'destructive', title: 'Action Required', description: 'Please re-enter your password to continue.' });
        setReauthAction(() => action);
        setShowReauthDialog(true);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'An unexpected error occurred.' });
      }
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsSaving('profile');
    
    try {
      await updateProfile(user, { displayName });
      toast({ title: 'Success!', description: 'Your name has been updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSaving(null);
    }
  };

  const handleEmailUpdate = withReauthentication(async () => {
    if (!user || !email) return;
    setIsSaving('email');
    await updateEmail(user, email);
    toast({ title: 'Success!', description: 'Your email has been updated. Please log in again.' });
    await signOut(auth);
    router.push('/login');
    setIsSaving(null);
  });
  
  const handlePasswordUpdate = withReauthentication(async () => {
    if (!user || !password.newPassword) return;
    if (password.newPassword !== password.confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
      return;
    }
    setIsSaving('password');
    await updatePassword(user, password.newPassword);
    toast({ title: 'Success!', description: 'Your password has been updated.' });
    setPassword({ newPassword: '', confirmPassword: '' });
    setIsSaving(null);
  });

  const handleDeleteAccount = withReauthentication(async () => {
    if (!user) return;
    setIsSaving('delete');
    await deleteUser(user);
    toast({ title: 'Account Deleted', description: 'Your account has been permanently deleted.' });
    router.push('/');
    setIsSaving(null);
  });

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
              <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }}>
                <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving === 'profile'}>{isSaving === 'profile' ? 'Saving...' : 'Save Name'}</Button>
                </CardFooter>
              </form>
              <form onSubmit={(e) => { e.preventDefault(); handleEmailUpdate(); }}>
                 <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving === 'email'}>{isSaving === 'email' ? 'Saving...' : 'Update Email'}</Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <form onSubmit={(e) => { e.preventDefault(); handlePasswordUpdate(); }}>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password. You may be asked to re-authenticate.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={password.newPassword} onChange={(e) => setPassword(p => ({...p, newPassword: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" value={password.confirmPassword} onChange={(e) => setPassword(p => ({...p, confirmPassword: e.target.value}))} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving === 'password'}>{isSaving === 'password' ? 'Saving...' : 'Change Password'}</Button>
                </CardFooter>
              </form>
            </Card>

             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isSaving === 'delete'}>
                          {isSaving === 'delete' ? 'Deleting...' : 'Delete My Account'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your account, your resumes, and all of your data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">Yes, delete my account</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
      </div>
      
       <AlertDialog open={showReauthDialog} onOpenChange={setShowReauthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Re-authentication Required</AlertDialogTitle>
            <AlertDialogDescription>For your security, please enter your current password to continue.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reauth-password">Current Password</Label>
            <Input
              id="reauth-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentPassword('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReauth}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
