'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
            <h2 className="text-3xl font-headline font-bold mb-4 text-foreground">Something went wrong!</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                An unexpected error occurred throughout the application. Please try refreshing the page.
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
      </body>
    </html>
  );
}
