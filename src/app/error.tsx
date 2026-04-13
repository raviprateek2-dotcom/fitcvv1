'use client';

import { useEffect } from 'react';
import { captureException } from '@sentry/browser';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      captureException(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <h2 className="text-3xl font-headline font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error. Please try again, or refresh the page.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
