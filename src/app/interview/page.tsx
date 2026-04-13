import dynamic from 'next/dynamic';
import { getAllPosts } from '@/lib/blog-posts';

const InterviewClient = dynamic(() => import('@/components/interview/InterviewClient'), {
  loading: () => (
    <div className="container mx-auto px-4 py-16 space-y-8 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-muted" />
      <div className="h-48 w-full max-w-3xl rounded-xl bg-muted" />
      <div className="h-32 w-full rounded-xl bg-muted" />
    </div>
  ),
});

export default function InterviewPage() {
  const featuredBlogs = getAllPosts().filter((p) =>
    ['job-interview-checklist', 'answer-tell-me-about-yourself', 'follow-up-email-guide'].includes(p.slug)
  );

  return <InterviewClient featuredBlogs={featuredBlogs} />;
}
