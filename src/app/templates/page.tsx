import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TemplatesCatalog from './TemplatesCatalog';

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">Resume Templates</h1>
          <p className="mt-3 text-muted-foreground">
            150 professionally crafted templates across 15 industries. Click any template to preview or start editing instantly.
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/templates/ats">Open ATS Template Picker</Link>
            </Button>
          </div>
        </header>

        <TemplatesCatalog />
      </div>
    </div>
  );
}
