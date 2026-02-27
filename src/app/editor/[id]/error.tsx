'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function EditorError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Editor error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Could not load this resume</h2>
            <p className="text-muted-foreground max-w-md">
                {error.message || 'The resume editor encountered an error. Your data has been auto-saved.'}
            </p>
            <div className="flex gap-3">
                <Button onClick={reset} variant="outline">
                    Try Again
                </Button>
                <Button asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
