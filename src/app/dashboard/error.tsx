'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Something went wrong loading your dashboard</h2>
            <p className="text-muted-foreground max-w-md">
                {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <Button onClick={reset} variant="outline">
                Try Again
            </Button>
        </div>
    );
}
