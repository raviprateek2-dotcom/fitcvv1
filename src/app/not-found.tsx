import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">404</p>
      <h1 className="text-3xl font-headline font-bold mb-4">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        That link doesn&apos;t exist or was moved. Try the home page, blog, or your dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blog">Blog</Link>
        </Button>
      </div>
    </div>
  );
}
