import { Skeleton } from '@/components/ui/skeleton';

export default function AboutLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl space-y-8 animate-pulse">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-xl rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="grid gap-4 pt-8">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
