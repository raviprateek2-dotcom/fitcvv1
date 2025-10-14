
import { BlogClientPage } from '@/components/blog/BlogClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Career Advice & Resume Tips',
  description: 'Explore articles on resume writing, career development, interview tips, and more from the ResumeAI team.',
};

export default function BlogPage() {
  return <BlogClientPage />;
}
