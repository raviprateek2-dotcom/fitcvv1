'use client';

const STORAGE_KEY = 'fitcv-first-pdf-celebrated';

/**
 * First successful PDF export delight (Rev2): brand confetti when motion is allowed.
 * Marks storage once; returns true on the first-ever successful call (for toast copy).
 */
export function celebrateFirstPdfDownload(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return false;
    localStorage.setItem(STORAGE_KEY, '1');

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return true;
    }

    const brand = ['#2D6A9F', '#3DAA8A', '#4A8DC4', '#E8EEF4'];

    void import('canvas-confetti')
      .then(({ default: confetti }) => {
        confetti({
          particleCount: 100,
          spread: 78,
          origin: { y: 0.72 },
          colors: brand,
          scalar: 0.95,
        });
        window.setTimeout(() => {
          confetti({
            particleCount: 55,
            angle: 60,
            spread: 48,
            origin: { x: 0.12, y: 0.76 },
            colors: brand,
          });
        }, 220);
        window.setTimeout(() => {
          confetti({
            particleCount: 55,
            angle: 120,
            spread: 48,
            origin: { x: 0.88, y: 0.76 },
            colors: brand,
          });
        }, 380);
      })
      .catch(() => {});

    return true;
  } catch {
    return false;
  }
}
