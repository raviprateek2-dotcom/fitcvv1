
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Eye, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    image: PlaceHolderImages.find((img) => img.id === 'template-modern'),
  },
  {
    id: 'classic',
    name: 'Classic',
    image: PlaceHolderImages.find((img) => img.id === 'template-classic'),
  },
  {
    id: 'creative',
    name: 'Creative',
    image: PlaceHolderImages.find((img) => img.id === 'template-creative'),
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    image: PlaceHolderImages.find((img) => img.id === 'template-minimalist'),
  },
  {
    id: 'professional',
    name: 'Professional',
    image: PlaceHolderImages.find((img) => img.id === 'template-professional'),
  },
];

export default function TemplatesPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Choose Your Template</h1>
          <p className="mt-4 text-lg text-muted-foreground">Select a professionally designed template to start building your resume.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.filter(t => t.image).map((template) => (
            <Card key={template.id} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0 relative">
                {template.image && (
                  <Image
                    src={template.image.imageUrl}
                    alt={template.name}
                    width={400}
                    height={566}
                    data-ai-hint={template.image.imageHint}
                    className="w-full h-auto object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="icon">
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">Preview</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0">
                      <DialogHeader className="hidden">
                        <DialogTitle>{template.name} Template Preview</DialogTitle>
                        <DialogDescription>A larger preview of the {template.name} resume template.</DialogDescription>
                      </DialogHeader>
                      {template.image && (
                         <Image
                           src={template.image.imageUrl}
                           alt={`${template.name} preview`}
                           width={800}
                           height={1131}
                           data-ai-hint={template.image.imageHint}
                           className="w-full h-auto object-contain rounded-lg"
                         />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button asChild>
                    <Link href={`/editor/new?template=${template.id}`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Use Template
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-background">
                <h3 className="font-headline text-lg">{template.name}</h3>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
