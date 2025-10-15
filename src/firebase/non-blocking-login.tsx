
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error) => {
    // Although anonymous sign-in rarely fails with permissions,
    // we handle it for consistency.
    console.error('Anonymous sign-in failed:', error);
    // You could potentially emit a specific type of error here if needed.
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  // We return the promise here to allow the calling component to handle specific errors (e.g., email-already-in-use)
  // and update its UI state (e.g., stop a loading spinner).
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(authInstance, email, password)
      .then(() => resolve()) // Resolve on success, auth state change will handle the rest.
      .catch(reject); // Reject with the error for the component to handle.
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
    // Similar to sign-up, returning the promise for error handling.
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(authInstance, email, password)
            .then(() => resolve()) // On success, the onAuthStateChanged listener will take over.
            .catch(reject); // On failure, let the component show a specific message.
    });
}

/** Initiate Google Sign-In (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
    return new Promise((resolve, reject) => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(authInstance, provider)
        .then(() => resolve())
        .catch(reject)
    });
}

/**
 * Initiates a sign-out operation.
 * Does NOT await the operation.
 */
export function signOutNonBlocking(authInstance: Auth): void {
  firebaseSignOut(authInstance).catch((error) => {
    console.error('Sign-out failed:', error);
    // Handle sign-out errors, e.g., by notifying the user or logging.
  });
}
