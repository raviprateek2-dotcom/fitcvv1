
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/blog-posts';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';

// Custom markdown-to-HTML renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
  // This is a simple renderer. For a real app, a library like 'marked' or 'react-markdown' would be better.
  const htmlContent = content
    .split('\n')
    .map((line, index) => {
      line = line.trim();
      if (line.startsWith('# ')) {
        return `<h1 key=${index} class="text-3xl font-bold font-headline mt-8 mb-4">${line.substring(2)}</h1>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 key=${index} class="text-2xl font-bold font-headline mt-6 mb-3">${line.substring(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3 key=${index} class="text-xl font-bold font-headline mt-4 mb-2">${line.substring(4)}</h3>`;
      }
      if (line.startsWith('- ')) {
        // This will be wrapped in a <ul> later
        return `<li key=${index} class="ml-5 mb-2">${line.substring(2)}</li>`;
      }
       // Basic bold and italic
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      if (line.startsWith('`') && line.endsWith('`')) {
        return `<code key=${index} class="bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono text-sm">${line.substring(1, line.length - 1)}</code>`;
      }
      
      if(line === '') {
          return ''; // Return empty string for empty lines
      }

      return `<p key=${index} class="leading-relaxed mb-4">${line}</p>`;
    })
    .filter(line => line !== '') // Remove empty lines
    .join('');
    
    // Wrap consecutive <li> elements in a <ul>
    const withLists = htmlContent.replace(/(<li>.*?<\/li>)+/gs, '<ul class="list-disc list-outside space-y-2 mb-4">$&</ul>');

  return <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:font-semibold" dangerouslySetInnerHTML={{ __html: withLists }} />;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';


interface BlogPostClientProps {
    post: BlogPost;
    image?: ImagePlaceholder;
}

export function BlogPostClient({ post, image }: BlogPostClientProps) {

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
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.description,
    image: image?.imageUrl,
    author: {
      '@type': 'Organization',
      name: 'ResumeAI Team',
       url: siteUrl,
    },
    publisher: {
        '@type': 'Organization',
        name: 'ResumeAI',
        logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/icon.png`,
        },
    },
    datePublished: new Date().toISOString(), // In a real app, you'd store and use the actual publish date
    dateModified: new Date().toISOString(),
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-4xl mx-auto">
        <article>
            <motion.header 
              className="mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                 <motion.div variants={itemVariants}>
                    <Button variant="ghost" asChild className="mb-4 -ml-4">
                        <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                        </Link>
                    </Button>
                  </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl font-headline font-extrabold tracking-tight mb-4">{post.title}</motion.h1>
                <motion.p variants={itemVariants} className="text-lg text-muted-foreground">{post.description}</motion.p>
                {image && (
                  <motion.div 
                      variants={itemVariants} 
                      className="mt-8 overflow-hidden rounded-2xl shadow-2xl"
                  >
                      <Image
                        src={image.imageUrl}
                        alt={post.title}
                        width={1200}
                        height={630}
                        priority
                        className="w-full h-auto object-cover"
                      />
                  </motion.div>
                )}
            </motion.header>
            <motion.div 
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5, duration: 0.5}}
              className="prose prose-lg dark:prose-invert max-w-none">
                <MarkdownRenderer content={post.content} />
            </motion.div>
        </article>
      </div>
    </div>
  );
}

    