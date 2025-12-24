/**
 * AuthProvider Component
 *
 * Initializes PocketBase authentication state from cookies on mount.
 * This ensures the PocketBase client is properly authenticated when
 * the app loads or refreshes.
 *
 * The cookie is set during login (see lib/api/auth.ts) and needs to
 * be loaded back into the PocketBase authStore on the client side.
 */

'use client';

import { useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { useAuthStore } from '@/lib/stores/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Load auth state from cookie into PocketBase authStore
    // PocketBase stores auth in a cookie named 'pb_auth' and can automatically load it
    pb.authStore.loadFromCookie(document.cookie);

    // Sync with Zustand store if auth is valid
    if (pb.authStore.isValid && pb.authStore.record) {
      const setAuth = useAuthStore.getState().setAuth;
      setAuth(pb.authStore.record as any, pb.authStore.token);
    } else {
      // Clear Zustand store if auth is invalid
      const clearAuth = useAuthStore.getState().clearAuth;
      clearAuth();
    }

    // Subscribe to PocketBase auth changes to keep Zustand in sync
    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (token && record) {
        const setAuth = useAuthStore.getState().setAuth;
        setAuth(record as any, token);
      } else {
        const clearAuth = useAuthStore.getState().clearAuth;
        clearAuth();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
