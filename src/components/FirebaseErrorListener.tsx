'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It throws any received error to be caught by Next.js's global-error.tsx during development.
 * In production, it logs the error to the console without crashing the app.
 */
export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In development, we want to see the rich error overlay.
      if (process.env.NODE_ENV === 'development') {
        setError(error);
      } else {
        // In production, we log the error but don't crash the app.
        // This could be replaced with a call to a logging service.
        console.error('Firestore Permission Error:', error.message);
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // On re-render, if an error exists in state (and we are in dev), throw it.
  if (error) {
    throw error;
  }

  // This component renders nothing.
  return null;
}
