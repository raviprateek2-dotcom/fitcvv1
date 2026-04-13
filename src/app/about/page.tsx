
import { AboutPageClient } from '@/components/about/AboutPageClient';
import type { Metadata } from 'next';

// Keep metadata as a separate export in the Server Component
export const metadata: Metadata = {
  title: 'About FitCV',
  description: 'Mission, product principles, and the team behind FitCV — resumes and interview prep for job seekers in India and beyond.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About FitCV',
    description: 'Why we built FitCV and how we think about career tools.',
  },
};

export default function AboutUsPage() {
  return <AboutPageClient />;
}
