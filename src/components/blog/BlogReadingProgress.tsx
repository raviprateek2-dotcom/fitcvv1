'use client';

import { useEffect, useState } from 'react';

/** Thin fixed progress bar for article scroll (Rev2: ~3px, accent). */
export function BlogReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      const next = height <= 0 ? 0 : Math.min(100, (scrollTop / height) * 100);
      setPct(next);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[120] h-[3px] bg-border/60"
      aria-hidden
    >
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
