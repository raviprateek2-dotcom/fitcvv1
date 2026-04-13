export default function BlogTopicLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-3xl animate-pulse space-y-8">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-10 w-4/5 max-w-lg rounded-lg bg-muted" />
        <div className="h-5 w-full rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-border bg-card/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
