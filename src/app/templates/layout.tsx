import type { Metadata } from 'next';
import { Suspense } from 'react';
import TemplatesLoading from './loading';

export const metadata: Metadata = {
  title: 'Resume templates',
  description:
    'Browse ATS-friendly resume templates, preview layouts, and open the editor free. Professional, creative, and minimal styles.',
  alternates: { canonical: '/templates' },
  openGraph: {
    title: 'Resume templates | FitCV',
    description: 'ATS-friendly layouts you can customize and export.',
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<TemplatesLoading />}>{children}</Suspense>;
}
