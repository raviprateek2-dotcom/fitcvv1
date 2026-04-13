import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">
      <div className="grid gap-8 md:grid-cols-3 animate-pulse">
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-xl border border-border p-6 space-y-4">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
          <div className="rounded-xl border border-border p-6 space-y-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>
        <div className="rounded-xl border border-border p-6 space-y-4 h-fit">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-20 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
