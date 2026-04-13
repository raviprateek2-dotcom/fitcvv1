import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Request a link to reset your FitCV account password.',
  robots: { index: false, follow: true },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
