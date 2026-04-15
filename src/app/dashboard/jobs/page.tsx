'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { JobBoard } from '@/components/job-tracker/JobBoard';

function JobsPageClient() {
  const searchParams = useSearchParams();
  const { user, firestore, isUserLoading } = useUser();
  const demoMode = searchParams.get('demo') === '1';

  if (isUserLoading && !demoMode) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <JobBoard user={user} firestore={firestore} demoMode={demoMode} />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <JobsPageClient />
    </Suspense>
  );
}
