'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const FinalCtaVisibleContext = createContext<boolean | undefined>(undefined);

/**
 * Single observer for `#get-started` so floating home CTAs / exit intent do not attach three separate observers.
 */
export function LandingFinalCtaVisibilityProvider({ children }: { children: ReactNode }) {
  const [finalCtaVisible, setFinalCtaVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById('get-started');
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setFinalCtaVisible(Boolean(entry?.isIntersecting));
      },
      { root: null, threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <FinalCtaVisibleContext.Provider value={finalCtaVisible}>{children}</FinalCtaVisibleContext.Provider>;
}

export function useLandingFinalCtaVisible(): boolean {
  const value = useContext(FinalCtaVisibleContext);
  if (value === undefined) {
    throw new Error('useLandingFinalCtaVisible must be used within LandingFinalCtaVisibilityProvider');
  }
  return value;
}
