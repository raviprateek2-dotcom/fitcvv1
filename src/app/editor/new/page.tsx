'use client';

import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { defaultResumeData } from '@/lib/default-resume-data';


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

function NewResumeContent() {
  const { user, isUserLoading, isProfileLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'modern';
  const { toast } = useToast();

  useEffect(() => {
    const createResumeFlow = async () => {
        // Wait until we know the user's status
        if (isUserLoading || isProfileLoading || !firestore || !user) {
          return;
        }

        // The logic for PDF uploads is handled on the dashboard, so we only proceed if there is a templateId
        if (!templateId) {
            router.push('/dashboard');
            return;
        }

        // FitCV: All features are now free.
        const resumesCollection = collection(firestore, `users/${user.uid}/resumes`);
        const newResumeData = {
            ...defaultResumeData,
            title: 'Untitled Resume',
            templateId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            personalInfo: {
                ...defaultResumeData.personalInfo,
                name: user.displayName || 'Your Name',
                email: user.email || '',
            },
        };
        
        // Use non-blocking write and optimistic navigation
        addDocumentNonBlocking(resumesCollection, newResumeData)
          .then(docRef => {
            if (docRef) {
                router.replace(`/editor/${docRef.id}`);
            } else {
                 throw new Error("Could not get document reference after creation.");
            }
          })
          .catch(error => {
            console.error("Error creating resume: ", error);
            toast({
                variant: "destructive",
                title: "Creation Failed",
                description: "Could not create the new resume. Please try again.",
            });
            router.push('/dashboard');
        });
    };
    
    createResumeFlow();

  }, [user, isUserLoading, isProfileLoading, firestore, router, templateId, toast]);

  return <CreatingResumeLoading />;
}

export default function NewResumePage() {
  return (
    <Suspense fallback={<CreatingResumeLoading />}>
      <NewResumeContent />
    </Suspense>
  );
}
