
import { BlogClientPage } from '@/components/blog/BlogClientPage';
import { getAllPosts } from '@/lib/blog-posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Career Advice & Resume Tips',
  description: 'Explore articles on resume writing, career development, interview tips, and more from the FitCV team.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogClientPage posts={posts} />;
}
