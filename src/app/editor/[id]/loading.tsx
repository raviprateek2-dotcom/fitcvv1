'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function EditorLoading() {
    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Editor Sidebar */}
            <div className="w-full lg:w-1/2 p-6 space-y-4 border-r">
                <div className="flex items-center gap-3 mb-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            </div>
            {/* Preview Side */}
            <div className="w-full lg:w-1/2 p-6 bg-muted/30">
                <Skeleton className="w-full aspect-[8.5/11] max-w-[816px] mx-auto rounded-lg" />
            </div>
        </div>
    );
}
