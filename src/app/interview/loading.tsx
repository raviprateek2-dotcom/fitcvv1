export default function InterviewLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
      </div>
      <div className="container mx-auto px-4 py-16 space-y-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-lg bg-muted" />
          <div className="h-48 w-full rounded-xl bg-muted" />
          <div className="h-32 w-full rounded-xl bg-muted" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 w-28 rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
