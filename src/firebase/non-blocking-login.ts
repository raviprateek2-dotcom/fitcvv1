
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
import { doc, getFirestore, setDoc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import type { UserProfile } from './provider';


/**
 * Creates a new user profile document in Firestore.
 * All users default to 'premium' status.
 */
async function createUserProfile(user: import('firebase/auth').User) {
  const db = getFirestore(getApp());
  const userDocRef = doc(db, `users/${user.uid}`);

  const newUserProfile: UserProfile = {
    email: user.email || '',
    subscription: 'premium',
    profilePhotoUrl: user.photoURL || '',
  };

  // Set the document. We use the blocking setDoc here because it's part of the critical auth flow.
  await setDoc(userDocRef, newUserProfile, { merge: false });
}


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error) => {
    console.error('Anonymous sign-in failed:', error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(authInstance, email, password)
      .then(async (userCredential) => {
        await createUserProfile(userCredential.user);
        resolve();
      })
      .catch(reject);
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(authInstance, email, password)
      .then(() => resolve())
      .catch(reject);
  });
}

/** Initiate Google Sign-In (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  return new Promise((resolve, reject) => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authInstance, provider)
      .then(async (result) => {
        const db = getFirestore(getApp());
        const userDocRef = doc(db, `users/${result.user.uid}`);

        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          await createUserProfile(result.user);
        }

        resolve()
      })
      .catch(reject)
  });
}

/**
 * Initiates a sign-out operation.
 */
export function signOutNonBlocking(authInstance: Auth): void {
  firebaseSignOut(authInstance).catch((error) => {
    console.error('Sign-out failed:', error);
  });
}
