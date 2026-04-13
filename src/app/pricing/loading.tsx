import { Skeleton } from '@/components/ui/skeleton';

export default function PricingLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-5xl">
      <div className="text-center space-y-4 mb-12 animate-pulse">
        <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
        <Skeleton className="h-5 w-full max-w-lg mx-auto rounded" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-border p-8 space-y-6 animate-pulse">
            <Skeleton className="h-8 w-32 rounded" />
            <Skeleton className="h-12 w-24 rounded" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-4 w-full rounded" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
