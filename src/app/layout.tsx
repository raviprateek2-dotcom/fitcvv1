import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PageTransition } from '@/components/common/PageTransition';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-headline',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ResumeCraft AI - Build Your Perfect Resume',
    template: '%s | ResumeCraft AI',
  },
  description:
    'Create a professional resume in minutes with our AI-powered builder, customizable templates, and expert guidance. Land your dream job with ResumeCraft AI.',
  keywords: ['resume builder', 'AI resume', 'professional resume', 'resume templates', 'resume editor', 'cv builder'],
  openGraph: {
    title: 'ResumeCraft AI - Build Your Perfect Resume',
    description: 'AI-powered resume builder to help you land your dream job.',
    url: siteUrl,
    siteName: 'ResumeCraft AI',
    images: [
      {
        url: `${siteUrl}/og-image.png`, // Must be an absolute URL
        width: 1200,
        height: 630,
        alt: 'ResumeCraft AI Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeCraft AI - The Smartest Way to Build Your Resume',
    description: 'Create a job-winning resume in minutes with AI-powered suggestions and professional templates.',
    // images: [`${siteUrl}/twitter-image.png`], // Must be an absolute URL
  },
  alternates: {
    canonical: siteUrl,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'relative h-full font-body antialiased',
          spaceGrotesk.variable,
          montserrat.variable
        )}
      >
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
