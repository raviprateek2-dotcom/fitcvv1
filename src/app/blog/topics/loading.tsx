export default function BlogTopicsLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl animate-pulse space-y-8">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-12 w-3/4 max-w-md rounded-lg bg-muted" />
        <div className="h-5 w-full max-w-2xl rounded bg-muted" />
        <div className="space-y-6 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border p-6 md:p-8 space-y-4">
              <div className="h-7 w-2/3 rounded-lg bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
