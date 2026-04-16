'use client';

import dynamic from 'next/dynamic';
import { AboutStoryHook } from '@/components/about/AboutStoryHook';
import { AboutStoryProblem } from '@/components/about/AboutStoryProblem';
import { AboutStoryInsight } from '@/components/about/AboutStoryInsight';
import { AboutScrollTelemetry } from '@/components/about/AboutScrollTelemetry';

const AboutStoryOrigin = dynamic(() => import('@/components/about/AboutStoryOrigin').then((m) => m.AboutStoryOrigin), {
  loading: () => (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="h-64 w-full rounded-2xl bg-muted/30 animate-pulse" />
    </div>
  ),
});

const AboutStoryDifferentiation = dynamic(
  () => import('@/components/about/AboutStoryDifferentiation').then((m) => m.AboutStoryDifferentiation),
  {
    loading: () => (
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="h-72 w-full rounded-2xl bg-muted/30 animate-pulse" />
      </div>
    ),
  },
);

const AboutStoryProof = dynamic(() => import('@/components/about/AboutStoryProof').then((m) => m.AboutStoryProof), {
  loading: () => (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="h-56 w-full rounded-2xl bg-muted/30 animate-pulse" />
    </div>
  ),
});

const AboutStoryTrust = dynamic(() => import('@/components/about/AboutStoryTrust').then((m) => m.AboutStoryTrust), {
  loading: () => (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="h-64 w-full rounded-2xl bg-muted/30 animate-pulse" />
    </div>
  ),
});

const AboutStoryClose = dynamic(() => import('@/components/about/AboutStoryClose').then((m) => m.AboutStoryClose), {
  loading: () => (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="h-48 w-full max-w-4xl mx-auto rounded-2xl bg-muted/30 animate-pulse" />
    </div>
  ),
});

/**
 * About page as a scroll-based journey: hook → problem → insight → origin → differentiation → proof → trust → close CTA.
 * Above-the-fold story blocks load immediately; deeper sections lazy-load for smaller initial JS.
 */
export function AboutPageClient() {
  return (
    <div className="relative isolate bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 -z-10 opacity-[0.08] dark:opacity-[0.12] animate-mesh filter blur-[80px]" aria-hidden />

      <AboutStoryHook />
      <AboutStoryProblem />
      <AboutStoryInsight />
      <AboutStoryOrigin />
      <AboutStoryDifferentiation />
      <AboutStoryProof />
      <AboutStoryTrust />
      <AboutStoryClose />

      <AboutScrollTelemetry />
    </div>
  );
}
