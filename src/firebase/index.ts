'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Analytics } from 'firebase/analytics';

// Store the dynamic import promise to ensure Firestore is only imported once.
let firestorePromise: Promise<typeof import('firebase/firestore')> | null = null;
let analyticsPromise: Promise<typeof import('firebase/analytics')> | null = null;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Firebase App Hosting can wire config into initializeApp() with no args. Everywhere else
      // (local dev, Vercel, CI `next build`) that call throws — we then use explicit config below.
      firebaseApp = initializeApp();
    } catch {
      firebaseApp = initializeApp(firebaseConfig);
      if (process.env.NODE_ENV === 'development') {
        console.info('[firebase] Using firebase/config (App Hosting auto-init not available).');
      }
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  // Lazily load Firestore
  const getFirestoreInstance = async (): Promise<Firestore> => {
    if (!firestorePromise) {
      firestorePromise = import('firebase/firestore');
    }
    const { getFirestore } = await firestorePromise;
    return getFirestore(firebaseApp);
  };

  const getAnalyticsInstance = async (): Promise<Analytics | null> => {
    if (typeof window === 'undefined') return null;
    if (!analyticsPromise) {
      analyticsPromise = import('firebase/analytics');
    }
    const { getAnalytics, isSupported } = await analyticsPromise;
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(firebaseApp);
    }
    return null;
  };

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    getFirestore: getFirestoreInstance,
    getAnalytics: getAnalyticsInstance,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/get-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';