import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shared resume',
  description: 'A resume shared with you via FitCV.',
  robots: { index: false, follow: false },
};

export default function ShareResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
