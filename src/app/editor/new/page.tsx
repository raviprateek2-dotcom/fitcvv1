'use client';

import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { defaultResumeData } from '@/lib/default-resume-data';
import { buildGuestResumeSeed, createGuestResumeId, saveGuestResume } from '@/lib/guest-resume';


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
  const createOnceRef = useRef(false);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      const guestId = createGuestResumeId();
      const guestSeed = buildGuestResumeSeed(templateId);
      saveGuestResume(guestId, guestSeed);
      toast({
        title: 'Guest draft ready',
        description: 'You can edit now. Create a free account later to sync and unlock all actions.',
      });
      router.replace(`/editor/${guestId}`);
      return;
    }

    if (!firestore || isProfileLoading) return;

    if (!templateId) {
      router.push('/dashboard');
      return;
    }

    if (createOnceRef.current) return;
    createOnceRef.current = true;

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

    addDocumentNonBlocking(resumesCollection, newResumeData)
      .then((docRef) => {
        if (docRef) {
          toast({
            title: 'Resume created',
            description:
              'Your editor is opening — add experience and export when you’re ready.',
          });
          router.replace(`/editor/${docRef.id}`);
        } else {
          throw new Error('Could not get document reference after creation.');
        }
      })
      .catch((error) => {
        createOnceRef.current = false;
        console.error('Error creating resume: ', error);
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: 'Could not create the new resume. Please try again.',
        });
        router.push('/dashboard');
      });
  }, [
    user,
    isUserLoading,
    isProfileLoading,
    firestore,
    router,
    templateId,
    toast,
  ]);

  return <CreatingResumeLoading />;
}

export default function NewResumePage() {
  return (
    <Suspense fallback={<CreatingResumeLoading />}>
      <NewResumeContent />
    </Suspense>
  );
}
