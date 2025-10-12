
import { blogPosts, type BlogPost } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

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

  return {
    title: post.title,
    description: post.description,
    openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
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
  const htmlContent = content
    .split('\n')
    .map((line) => {
      line = line.trim();
      if (line.startsWith('# ')) {
        return `<h1>${line.substring(2)}</h1>`;
      }
      if (line.startsWith('## ')) {
        return `<h2>${line.substring(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3>${line.substring(4)}</h3>`;
      }
      if (line.startsWith('- ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      // Basic bold and italic
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      if (line.startsWith('`') && line.endsWith('`')) {
        return `<p><code>${line.substring(1, line.length -1)}</code></p>`;
      }
      
      if(line === '') {
          return '<br />';
      }

      return `<p>${line}</p>`;
    })
    .join('');
    
    // Wrap lists
    const withLists = htmlContent.replace(/<li>(.*?)<\/li>(?!<li>)/gs, '<li>$1</li></ul>').replace(/(<li>.*?<\/li>)/, '<ul>$1');

  return <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: withLists }} />;
};


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto" variant="neuro">
        <CardHeader>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          <CardTitle className="text-3xl lg:text-4xl font-headline">{post.title}</CardTitle>
          <p className="text-muted-foreground pt-2">{post.description}</p>
        </CardHeader>
        <CardContent>
           <MarkdownRenderer content={post.content} />
        </CardContent>
      </Card>
    </div>
  );
}

    