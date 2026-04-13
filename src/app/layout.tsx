
import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Space_Grotesk,
  Montserrat,
  Lora,
  DM_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PageTransition } from '@/components/common/PageTransition';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { WebVitalsReporter } from '@/components/common/WebVitalsReporter';
import { GoogleAnalytics } from '@/components/common/GoogleAnalytics';
import { PosthogAnalytics } from '@/components/common/PosthogAnalytics';

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
  weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FitCV - Build Your Perfect Resume with AI',
    template: '%s | FitCV',
  },
  description:
    'Create a professional, ATS-optimized resume in minutes with our AI-powered builder, customizable templates, and expert guidance. Land your dream job faster with FitCV.',
  keywords: ['resume builder', 'AI resume', 'professional resume', 'resume templates', 'cv builder', 'job application', 'career tools'],
  authors: [{ name: 'FitCV Team', url: siteUrl }],
  creator: 'FitCV Team',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'FitCV - The Smartest Way to Build Your Resume',
    description: 'Create a job-winning resume in minutes with AI-powered suggestions and beautiful, professional templates.',
    siteName: 'FitCV',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'A hero image showing a resume being created on FitCV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitCV - The Smartest Way to Build Your Resume',
    description: 'Create a job-winning resume in minutes with AI-powered suggestions and professional templates.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@FitCV',
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
      'application/rss+xml': `${siteUrl}/blog/feed.xml`,
    },
  },
};

/** Mobile browser chrome + Lighthouse-friendly viewport (theme aligns with Rev2 primary / surfaces). */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f7fb' },
    { media: '(prefers-color-scheme: dark)', color: '#141b24' },
  ],
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
          dmSans.variable,
          jetbrainsMono.variable,
          lora.variable
        )}
      >
        <GoogleAnalytics />
        <PosthogAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={['light', 'dark', 'system']}
          enableSystem
          storageKey="fitcv-theme"
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <WebVitalsReporter />
            <div className="flex flex-col min-h-screen">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Skip to main content
              </a>
              <Header />
              <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
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
