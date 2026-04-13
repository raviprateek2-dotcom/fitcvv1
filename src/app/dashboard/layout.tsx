import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your resumes, quick actions, and progress in one place.',
  robots: { index: false, follow: true },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
