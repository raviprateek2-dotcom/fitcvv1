'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import type { UserProfile } from './provider';
import { setDocumentNonBlocking } from './non-blocking-updates';


/**
 * Creates a new user profile document in Firestore.
 * This is called after a user is created via email/password or Google sign-in.
 */
async function createUserProfile(user: import('firebase/auth').User) {
    // We need to get a Firestore instance here
    const db = getFirestore(user.app);
    const userDocRef = doc(db, `users/${user.uid}`);
    
    const isDummyUser = user.email === 'test@test.com';
    const newUserProfile: UserProfile = {
      email: user.email || '',
      subscription: isDummyUser ? 'premium' : 'free',
      profilePhotoUrl: user.photoURL || '',
    };
    
    // Set the document. We use the blocking setDoc here because it's part of the critical auth flow.
    await setDoc(userDocRef, newUserProfile, { merge: false });
}


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
      .then(async (userCredential) => {
        // After user creation, create their profile document
        await createUserProfile(userCredential.user);
        resolve(); // Resolve after profile is created.
      })
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
        .then(async (result) => {
             // After user signs in, potentially for the first time, ensure their profile exists.
            const db = getFirestore(result.user.app);
            const userDocRef = doc(db, `users/${result.user.uid}`);
            
            // Check if profile exists, if not, create it.
            const { getDoc } = await import('firebase/firestore');
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
 * Does NOT await the operation.
 */
export function signOutNonBlocking(authInstance: Auth): void {
  firebaseSignOut(authInstance).catch((error) => {
    console.error('Sign-out failed:', error);
    // Handle sign-out errors, e.g., by notifying the user or logging.
  });
}
