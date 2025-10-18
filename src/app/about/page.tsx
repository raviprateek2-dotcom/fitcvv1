
import { AboutPageClient } from '@/components/about/AboutPageClient';
import type { Metadata } from 'next';

// Keep metadata as a separate export in the Server Component
export const metadata: Metadata = {
  title: 'About Us - ResumeAI',
  description: 'Learn about the mission and values of ResumeAI, and its founder, Ravi Prateek.',
};

export default function AboutUsPage() {
  return <AboutPageClient />;
}
