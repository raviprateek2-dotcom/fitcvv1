
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Missing Email',
        description: 'Please enter your email address.',
      });
      return;
    }
    setIsLoading(true);
    try {
      // We always await, but the user experience is the same for success or failure.
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      // We don't want to reveal if an email exists or not for security reasons.
      // So we show the same success message even on error.
      // Specific errors could be logged to a monitoring service.
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
      setEmail('');
       toast({
        title: 'Password Reset Email Sent',
        description: 'If an account with that email exists, a password reset link has been sent to it.',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm" variant="neuro">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                <Rocket className="h-10 w-10 text-primary" />
              </motion.div>
          </div>
          <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button variant="neuro" className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            Remembered your password?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
