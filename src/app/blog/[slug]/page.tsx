
import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BlogPostClient } from '@/components/blog/BlogPostClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {};
  }
  
  const image = PlaceHolderImages.find(img => img.id === post.imageId);
  const imageUrl = image?.imageUrl || `${siteUrl}/og-image.png`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  };
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }
  
  const image = PlaceHolderImages.find(img => img.id === post.imageId);

  // Generate structured data on the server to prevent hydration errors
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
    // Use a static date to avoid hydration mismatch. In a real app, this would come from the post data.
    datePublished: '2024-01-01T00:00:00Z',
    dateModified: '2024-01-01T00:00:00Z',
  };

  return <BlogPostClient post={post} image={image} structuredDataJSON={JSON.stringify(structuredData)} />;
}
