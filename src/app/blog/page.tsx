
'use client';

import { blogPosts } from '@/lib/blog-posts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

// Note: Metadata is still supported in Client Components
export const metadata: Metadata = {
  title: 'Blog - Career Advice & Resume Tips',
  description: 'Explore articles on resume writing, career development, interview tips, and more from the ResumeAI team.',
};


export default function BlogPage() {
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
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">From the Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore articles on resume writing, career development, and interview tips.
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogPosts.map((post) => {
            const image = PlaceHolderImages.find(img => img.id === post.imageId);
            return (
              <motion.div key={post.slug} variants={itemVariants}>
                <Card className="group overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full" variant="neuro">
                  {image && (
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      <Image
                          src={image.imageUrl}
                          alt={post.title}
                          width={400}
                          height={200}
                          data-ai-hint={image.imageHint}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  )}
                 <CardHeader>
                      <h2 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                  </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground text-sm flex-grow">{post.description}</p>
                  <Button variant="link" asChild className="p-0 h-auto mt-4 self-start">
                      <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  );
}
