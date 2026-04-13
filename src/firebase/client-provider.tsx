'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { WalkthroughProvider } from '@/components/walkthrough/WalkthroughProvider';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    const services = initializeFirebase();
    if (services.getAnalytics && typeof window !== 'undefined') {
      const run = () => services.getAnalytics?.().catch(console.error);
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => run(), { timeout: 5000 });
      } else {
        setTimeout(run, 2500);
      }
    }
    return services;
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      getFirestore={firebaseServices.getFirestore}
    >
      <WalkthroughProvider>{children}</WalkthroughProvider>
    </FirebaseProvider>
  );
}
