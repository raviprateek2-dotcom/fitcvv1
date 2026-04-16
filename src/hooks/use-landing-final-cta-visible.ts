'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the landing page final CTA (`#get-started`) is in view.
 * Used to avoid competing floating CTAs / exit prompts when the user already reached the close.
 */
export function useLandingFinalCtaVisible(threshold = 0.15): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById('get-started');
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setVisible(Boolean(entry?.isIntersecting));
      },
      { root: null, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return visible;
}
