'use client';

import { useEffect } from 'react';
import { captureException } from '@sentry/browser';

/**
 * Root layout errors only — must include html/body (Next.js replaces the root layout).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          background: '#0a0a0a',
          color: '#fafafa',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Something went wrong</h1>
        <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '24rem' }}>
          A critical error occurred. Try again, or refresh the page.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            borderRadius: '0.5rem',
            border: 'none',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: '#22c55e',
            color: '#052e16',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
