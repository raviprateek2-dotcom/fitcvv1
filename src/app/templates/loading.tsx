export default function TemplatesLoading() {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="text-center mb-8 space-y-3 animate-pulse max-w-xl mx-auto">
          <div className="h-10 w-64 rounded-lg bg-muted mx-auto" />
          <div className="h-4 w-full rounded bg-muted/80" />
        </div>
        <div className="flex gap-2 mb-8 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-11 w-28 shrink-0 rounded-full bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden bg-card animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-3 flex gap-2">
                <div className="h-12 flex-1 rounded-lg bg-muted" />
                <div className="h-12 flex-1 rounded-lg bg-muted" />
              </div>
              <div className="h-14 border-t border-border px-4 flex items-center">
                <div className="h-5 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
