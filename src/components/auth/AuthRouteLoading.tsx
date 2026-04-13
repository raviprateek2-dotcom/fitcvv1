import { Skeleton } from '@/components/ui/skeleton';

/** Shared skeleton for client-only auth routes (login, signup, password reset). */
export default function AuthRouteLoading() {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-pulse">
        <div className="flex justify-center">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="h-4 w-64 mx-auto rounded" />
      </div>
    </div>
  );
}
