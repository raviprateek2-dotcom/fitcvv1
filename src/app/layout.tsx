
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Montserrat, Lora } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PageTransition } from '@/components/common/PageTransition';
import { ThemeProvider } from '@/components/common/ThemeProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ResumeAI - Build Your Perfect Resume with AI',
    template: '%s | ResumeAI',
  },
  description:
    'Create a professional, ATS-optimized resume in minutes with our AI-powered builder, customizable templates, and expert guidance. Land your dream job faster with ResumeAI.',
  keywords: ['resume builder', 'AI resume', 'professional resume', 'resume templates', 'cv builder', 'job application', 'career tools'],
  authors: [{ name: 'ResumeAI Team', url: siteUrl }],
  creator: 'ResumeAI Team',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'ResumeAI - The Smartest Way to Build Your Resume',
    description: 'Create a job-winning resume in minutes with AI-powered suggestions and beautiful, professional templates.',
    siteName: 'ResumeAI',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'A hero image showing a resume being created on ResumeAI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeAI - The Smartest Way to Build Your Resume',
    description: 'Create a job-winning resume in minutes with AI-powered suggestions and professional templates.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@ResumeAI',
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
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    }
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'relative h-full font-body antialiased',
          spaceGrotesk.variable,
          montserrat.variable,
          inter.variable,
          lora.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
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
        </ThemeProvider>
      </body>
    </html>
  );
}
