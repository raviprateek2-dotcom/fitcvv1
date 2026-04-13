import { Skeleton } from '@/components/ui/skeleton';

export default function PrivacyLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl animate-pulse">
      <div className="rounded-xl border border-border p-8 space-y-6">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <div className="space-y-3 pt-4">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
