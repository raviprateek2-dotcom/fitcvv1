
'use client';

import { blogPosts } from '@/lib/blog-posts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

export function BlogClientPage() {
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
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">From the Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore articles on resume writing, career development, and interview tips.
          </p>
        </motion.div>

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
                <Card className="group overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl h-full" variant="neuro">
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
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground text-sm flex-grow mb-4">{post.description}</p>
                  <Button variant="link" asChild className="p-0 h-auto self-start font-semibold">
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
