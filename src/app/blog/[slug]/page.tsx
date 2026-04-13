
import { getPostBySlug, getRelatedPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BlogPostClient } from '@/components/blog/BlogPostClient';
import { buildBlogPostGraph, safeJsonLdStringify } from '@/lib/blog-jsonld';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

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
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
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
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }
  
  const image = PlaceHolderImages.find(img => img.id === post.imageId);

  const structuredData = buildBlogPostGraph({
    siteUrl,
    post,
    heroImageUrl: image?.imageUrl,
  });

  const relatedPosts = getRelatedPosts(params.slug);

  const articleUrl = `${siteUrl}/blog/${post.slug}`;

  return (
    <BlogPostClient
      post={post}
      relatedPosts={relatedPosts}
      image={image}
      structuredDataJSON={safeJsonLdStringify(structuredData)}
      articleUrl={articleUrl}
    />
  );
}
