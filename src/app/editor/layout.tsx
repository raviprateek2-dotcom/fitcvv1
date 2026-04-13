import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume editor',
  description: 'Edit your resume with live preview, AI tools, and ATS-focused templates.',
  robots: { index: false, follow: true },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
