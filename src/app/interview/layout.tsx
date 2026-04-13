import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview practice',
  description:
    'Practice answers with AI feedback, voice mock interviews, behavioral analysis, and pitch prep — built for real interviews.',
  alternates: { canonical: '/interview' },
  openGraph: {
    title: 'Interview practice | FitCV',
    description: 'Train with mock interviews and structured feedback.',
  },
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
