import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Sign in to FitCV to edit your resumes, run AI tools, and practice interviews.',
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
