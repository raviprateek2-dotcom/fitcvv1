export default function BlogLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-background" />
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative">
        <div className="max-w-3xl mb-16 space-y-4 animate-pulse">
          <div className="h-6 w-40 rounded-full bg-muted" />
          <div className="h-12 w-full max-w-xl rounded-lg bg-muted" />
          <div className="h-4 w-full rounded bg-muted/80" />
          <div className="h-4 w-5/6 rounded bg-muted/80" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border overflow-hidden bg-card/50 animate-pulse"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-6 w-full rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted/80" />
                <div className="h-4 w-4/5 rounded bg-muted/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
