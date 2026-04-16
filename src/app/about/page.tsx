
import { AboutPageClient } from '@/components/about/AboutPageClient';
import type { Metadata } from 'next';

// Keep metadata as a separate export in the Server Component
export const metadata: Metadata = {
  title: 'About FitCV',
  description:
    'Why resumes get ignored — and how FitCV helps you earn attention with ATS-first structure, JD-aware help, and interview practice built for real hiring pressure.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About FitCV',
    description:
      'The story behind FitCV: clarity over hype, structure over templates-only thinking, and tools that move you from application to interview.',
  },
};

export default function AboutUsPage() {
  return <AboutPageClient />;
}
