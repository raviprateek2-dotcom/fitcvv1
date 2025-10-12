'use client';

import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


const premiumTemplates = ['minimalist', 'professional'];

// A simple loading state while the resume is being created and we redirect.
const CreatingResumeLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="space-y-4 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
            <p className="mt-8 text-lg font-semibold animate-pulse">Creating your new resume...</p>
        </div>
    );
};

export default function NewResumePage() {
  const { user, userProfile, isUserLoading, isProfileLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'modern';
  const { toast } = useToast();

  useEffect(() => {
    const isProUser = userProfile?.subscription === 'premium';
    const isPremiumTemplate = premiumTemplates.includes(templateId);

    // Wait until we know the user's status
    if (isUserLoading || isProfileLoading) {
      return;
    }

    // If user is not logged in, redirect to login page.
    if (!user) {
      router.push(`/login?redirect=/templates`);
      return;
    }
    
    // If a free user tries to access a premium template, block them.
    if (isPremiumTemplate && !isProUser) {
        toast({
            variant: 'destructive',
            title: 'Upgrade Required',
            description: 'You need a Pro plan to use this template.',
        });
        router.push('/pricing');
        return;
    }

    // Once we have a user and all checks have passed, create the new resume.
    if (user && firestore) {
      const createResume = async () => {
        try {
          const resumesCollection = collection(firestore, `users/${user.uid}/resumes`);
          const newResumeData = {
            title: 'Untitled Resume',
            templateId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            personalInfo: {
              name: user.displayName || 'Your Name',
              title: 'Your Professional Title',
              email: user.email || '',
              phone: '',
              location: '',
              website: '',
            },
            summary: 'A brief professional summary about yourself.',
            experience: [],
            education: [],
            skills: 'React, Next.js, TypeScript',
            jobDescription: '',
          };

          const docRef = await addDoc(resumesCollection, newResumeData);
          // Redirect to the new resume's editor page.
          router.replace(`/editor/${docRef.id}`);
        } catch (error) {
          console.error('Error creating new resume:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not create a new resume. Please try again.'
          });
          router.push('/dashboard'); // Redirect to dashboard on error.
        }
      };

      createResume();
    }
  }, [user, isUserLoading, userProfile, isProfileLoading, firestore, router, templateId, toast]);

  // Show a loading indicator while the async operations are in progress.
  return <CreatingResumeLoading />;
}
