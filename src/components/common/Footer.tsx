
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold font-headline text-lg w-fit">
              <Rocket className="h-6 w-6 text-primary" />
              <span>FitCV</span>
            </Link>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} FitCV. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Product</h3>
            <Link href="/templates" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">Templates</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">Pricing</Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">Dashboard</Link>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">About Us</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">Blog</Link>
            <Link href="/interview" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">Interview Prep</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Legal</h3>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
