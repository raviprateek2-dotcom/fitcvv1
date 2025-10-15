
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Eye, Plus, Sparkles, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    image: PlaceHolderImages.find((img) => img.id === 'template-modern'),
    isPremium: false,
  },
  {
    id: 'classic',
    name: 'Classic',
    image: PlaceHolderImages.find((img) => img.id === 'template-classic'),
    isPremium: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    image: PlaceHolderImages.find((img) => img.id === 'template-creative'),
    isPremium: false,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    image: PlaceHolderImages.find((img) => img.id === 'template-minimalist'),
    isPremium: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    image: PlaceHolderImages.find((img) => img.id === 'template-professional'),
    isPremium: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    image: PlaceHolderImages.find((img) => img.id === 'template-executive'),
    isPremium: true,
  },
];

export default function TemplatesPage() {
  const { userProfile } = useUser();
  const router = useRouter();
  const isProUser = userProfile?.subscription === 'premium';

  const handleUseTemplate = (templateId: string, isPremium: boolean) => {
    if (isPremium && !isProUser) {
      router.push('/pricing');
    } else {
      router.push(`/editor/new?template=${templateId}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Choose Your Template</h1>
          <p className="mt-4 text-lg text-muted-foreground">Select a professionally designed template to start building your resume.</p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {templates.filter(t => t.image).map((template) => (
            <motion.div key={template.id} variants={itemVariants}>
              <Card className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col" variant='neuro'>
                <CardContent className="p-0 relative">
                  {template.isPremium && (
                      <div className="absolute top-2 right-2 z-10">
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            Pro
                          </div>
                      </div>
                  )}
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
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full transition-all hover:scale-110">
                          <Eye className="h-6 w-6" />
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
                    <Button size="lg" onClick={() => handleUseTemplate(template.id, template.isPremium)} className="transition-all hover:scale-105">
                        {template.isPremium && !isProUser ? <Lock className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {template.isPremium && !isProUser ? 'Upgrade to Use' : 'Use Template'}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-4 bg-background mt-auto">
                  <h3 className="font-headline text-lg">{template.name}</h3>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
