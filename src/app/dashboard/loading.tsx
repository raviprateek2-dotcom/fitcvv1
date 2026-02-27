'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
    return (
        <div className="container py-8 space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-52 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}
