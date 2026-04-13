import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your FitCV profile, account security, and preferences.',
  robots: { index: false, follow: true },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
