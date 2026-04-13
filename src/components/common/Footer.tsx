'use client';

import { Rocket, Cpu, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics-events';

const productLinks = [
  { label: 'Get started', href: '/#get-started' },
  { label: 'Templates', href: '/templates' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Interview practice', href: '/interview' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

type SocialEntry = { label: string; href: string };

function parsePublicSocialUrl(raw: string | undefined): string | undefined {
  const s = raw?.trim();
  if (!s) return undefined;
  try {
    const u = new URL(s);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
}

/** Built at module load; only non-empty valid NEXT_PUBLIC_SOCIAL_* URLs appear. */
function getConfiguredSocialLinks(): SocialEntry[] {
  const out: SocialEntry[] = [];
  const x = parsePublicSocialUrl(process.env.NEXT_PUBLIC_SOCIAL_X);
  if (x) out.push({ label: 'X', href: x });
  const linkedIn = parsePublicSocialUrl(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN);
  if (linkedIn) out.push({ label: 'LinkedIn', href: linkedIn });
  const instagram = parsePublicSocialUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM);
  if (instagram) out.push({ label: 'Instagram', href: instagram });
  return out;
}

const configuredSocialLinks = getConfiguredSocialLinks();

export function Footer() {
  const { toast } = useToast();
  const [newsletterPending, setNewsletterPending] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = (data.get('email') as string)?.trim();
    if (!email) {
      toast({ variant: 'destructive', title: 'Add your email', description: 'Enter an address so we know where to reach you.' });
      return;
    }

    setNewsletterPending(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        mode?: string;
        error?: string;
      };

      if (res.status === 429) {
        toast({
          variant: 'destructive',
          title: 'Too many attempts',
          description: 'Please wait a minute before subscribing again.',
        });
        return;
      }

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || 'request_failed');
      }

      if (data.mode === 'placeholder') {
        trackEvent('newsletter_signup', { mode: 'placeholder' });
        toast({
          title: 'Thanks — we’ll be in touch',
          description: 'Full email signup is rolling out. For now, catch every new guide on the blog.',
        });
      } else {
        trackEvent('newsletter_signup', { mode: data.mode ?? 'forwarded' });
        toast({
          title: 'You’re on the list',
          description: 'Thanks — if your provider sends a confirmation, check your inbox.',
        });
      }
      form.reset();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Could not subscribe',
        description: 'Check your connection or try again later. You can still read new posts on the blog.',
      });
    } finally {
      setNewsletterPending(false);
    }
  };

  return (
    <footer className="relative mt-20 px-4 pb-12 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-glass border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 lg:gap-24 relative z-10">
            <div className="flex flex-col gap-6 sm:col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-4 font-black font-headline text-3xl group w-fit">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Rocket className="h-7 w-7" />
                </div>
                <span className="text-gradient">FitCV</span>
              </Link>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium max-w-xs">
                Build an ATS-friendly resume, practice interviews, and move forward with clear, practical guidance — built for job seekers in India and beyond.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 mb-2 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 shrink-0" aria-hidden />
                Product
              </h3>
              <nav className="space-y-3" aria-label="Product links">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs font-bold text-muted-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 min-h-[44px] md:min-h-0 py-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 mb-2 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden />
                Company
              </h3>
              <nav className="space-y-3" aria-label="Company links">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs font-bold text-muted-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 min-h-[44px] md:min-h-0 py-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-6 sm:col-span-2 md:col-span-1">
              <div className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
                  Stay in the loop
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Resume tips and interview guides — no spam.{' '}
                  <Link href="/blog" className="text-primary underline-offset-2 hover:underline font-semibold">
                    Read the blog
                  </Link>
                  {' or subscribe via '}
                  <Link
                    href="/blog/feed.xml"
                    className="text-primary underline-offset-2 hover:underline font-semibold"
                  >
                    RSS
                  </Link>
                  .
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="relative flex flex-col sm:flex-row gap-2"
                  noValidate
                >
                  <label htmlFor="footer-email" className="sr-only">
                    Email for updates
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Your email"
                    disabled={newsletterPending}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-primary/40 transition-all min-h-[48px] disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={newsletterPending}
                    aria-label={newsletterPending ? 'Submitting email' : 'Submit email for updates'}
                    className="sm:absolute sm:right-2 sm:top-1.5 sm:bottom-1.5 px-4 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity min-h-[48px] sm:min-h-0 disabled:opacity-60"
                  >
                    {newsletterPending ? 'Sending…' : 'Notify me'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div
            className={`mt-12 md:mt-20 pt-8 border-t border-white/5 flex flex-col items-center gap-6 ${
              configuredSocialLinks.length > 0 ? 'md:flex-row md:justify-between' : ''
            }`}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 text-center md:text-left">
              &copy; {new Date().getFullYear()} FitCV. All rights reserved.
            </p>
            {configuredSocialLinks.length > 0 && (
              <nav className="flex flex-wrap justify-center gap-6" aria-label="Social links">
                {configuredSocialLinks.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 hover:text-primary transition-colors min-h-[44px] flex items-center"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
