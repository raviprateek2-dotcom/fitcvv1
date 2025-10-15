

import { blogPosts, type BlogPost } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }
  
  const image = PlaceHolderImages.find(img => img.id === post.imageId);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        images: image ? [image.imageUrl] : [],
    }
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

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


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }
  
  const image = PlaceHolderImages.find(img => img.id === post.imageId);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <article>
            <header className="mb-8">
                 <Button variant="ghost" asChild className="mb-4 -ml-4">
                    <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                    </Link>
                </Button>
                <h1 className="text-4xl lg:text-5xl font-headline font-extrabold tracking-tight mb-4">{post.title}</h1>
                <p className="text-lg text-muted-foreground">{post.description}</p>
                 {image && (
                    <div className="mt-8 overflow-hidden rounded-2xl shadow-2xl">
                        <Image
                            src={image.imageUrl}
                            alt={post.title}
                            width={1200}
                            height={600}
                            data-ai-hint={image.imageHint}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>
                )}
            </header>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <MarkdownRenderer content={post.content} />
            </div>
        </article>
      </div>
    </div>
  );
}
