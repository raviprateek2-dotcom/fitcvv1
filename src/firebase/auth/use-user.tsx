
'use client';
import { useFirebase } from '@/firebase/provider';
import type { UserHookResult } from '@/firebase/provider';

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError, userProfile, and isProfileLoading.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError, userProfile, isProfileLoading } = useFirebase();
  return { user, isUserLoading, userError, userProfile, isProfileLoading };
};
