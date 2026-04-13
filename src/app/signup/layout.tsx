import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create a free FitCV account — resume templates, AI suggestions, and interview practice.',
  robots: { index: true, follow: true },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
