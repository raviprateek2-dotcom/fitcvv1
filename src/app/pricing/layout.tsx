import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'FitCV plans: free core resume tools and optional Pro for advanced AI, templates, and interview features.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing | FitCV',
    description: 'Choose the plan that fits your job search.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
