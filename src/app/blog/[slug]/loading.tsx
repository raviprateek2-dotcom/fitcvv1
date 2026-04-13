export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="flex gap-2 mb-8">
          <div className="h-4 w-12 rounded bg-muted" />
          <div className="h-4 w-4 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
        <div className="h-6 w-32 rounded-full bg-muted mb-6" />
        <div className="h-12 w-full max-w-2xl rounded-lg bg-muted mb-4" />
        <div className="h-5 w-full rounded bg-muted/80 mb-2" />
        <div className="aspect-[16/9] rounded-2xl bg-muted mb-10" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-muted/70" />
          <div className="h-4 w-full rounded bg-muted/70" />
          <div className="h-4 w-5/6 rounded bg-muted/70" />
          <div className="h-4 w-full rounded bg-muted/70" />
          <div className="h-4 w-4/5 rounded bg-muted/70" />
        </div>
      </div>
    </div>
  );
}
