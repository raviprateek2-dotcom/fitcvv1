'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,30.41,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // If user is already logged in, show success and redirect
      if (loginState !== 'success') setLoginState('success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000); // Wait for success animation
    }
  }, [user, router, loginState]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please enter both email and password.',
      });
      return;
    }
    setLoginState('loading');
    initiateEmailSignIn(auth, email, password)
    .then(() => {
        // Auth state listener will handle the redirect via useEffect
    })
    .catch((error: any) => {
        setLoginState('idle');
        let description = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
          description = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.code === 'auth/too-many-requests') {
          description = 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.'
        }
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description,
        });
    });
  };
  
  const handleGoogleSignIn = () => {
    setLoginState('loading');
    initiateGoogleSignIn(auth)
    .then(() => {
      // Auth state listener will handle redirect
    })
    .catch(() => {
        setLoginState('idle');
        toast({
            variant: 'destructive',
            title: 'Sign-in Failed',
            description: 'Could not sign in with Google. Please try again.',
        });
    });
  };

  const isButtonDisabled = loginState === 'loading' || loginState === 'success';

  return (
    <Card className="w-full max-w-sm" variant="neuro">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
            <motion.div
              animate={{
                rotate: [0, 0, -10, 10, -10, 10, 0],
                y: [0, 0, 0, 0, 0, 0, -100],
                x: [0, 0, 0, 0, 0, 0, 300],
                opacity: [1, 1, 1, 1, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                times: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 1],
              }}
            >
              <Rocket className="h-10 w-10 text-primary" />
            </motion.div>
        </div>
        <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="neuro" className="w-full" onClick={handleGoogleSignIn} disabled={isButtonDisabled}>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isButtonDisabled} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isButtonDisabled} />
          </div>
          <motion.div
            initial={false}
            animate={{
              width: loginState === 'success' ? 44 : '100%',
              borderRadius: loginState === 'success' ? '9999px' : '0.375rem',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mx-auto"
          >
            <Button variant={loginState === 'success' ? 'default' : 'neuro'} className="w-full" type="submit" disabled={isButtonDisabled}>
              <AnimatePresence mode="wait" initial={false}>
                {loginState === 'idle' && (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Log In
                  </motion.span>
                )}
                {loginState === 'loading' && (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Logging In...
                  </motion.span>
                )}
                {loginState === 'success' && (
                  <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
