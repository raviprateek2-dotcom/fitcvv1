import { BlogClientPage } from '@/components/blog/BlogClientPage';
import { getAllPosts } from '@/lib/blog-posts';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  title: 'Blog — career & resume guides',
  description:
    'Practical guides on resumes, ATS, interviews, and job search strategy — browse by topic or read all posts, then apply what you learn in the editor.',
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': `${siteUrl}/blog/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/blog`,
    title: 'FitCV blog — career & resume guides',
    description: 'Resume, interview, and job-search articles with clear next steps.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitCV blog',
    description: 'Resume and interview guides for real job searches.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogClientPage posts={posts} />;
}
