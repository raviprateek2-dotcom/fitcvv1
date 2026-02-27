import { getAllPosts } from '@/lib/blog-posts';
import InterviewClient from '@/components/interview/InterviewClient';

export default function InterviewPage() {
    const featuredBlogs = getAllPosts().filter(p => [
        'job-interview-checklist',
        'answer-tell-me-about-yourself',
        'follow-up-email-guide'
    ].includes(p.slug));

    return <InterviewClient featuredBlogs={featuredBlogs} />;
}
