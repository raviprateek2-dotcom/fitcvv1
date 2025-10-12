import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <p className="text-lg font-bold font-headline">ResumeCraft AI</p>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ResumeCraft AI. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
