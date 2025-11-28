/**
 * useLogin Hook
 *
 * TanStack Query mutation hook for user login.
 * Handles authentication, state management, and redirect.
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, type LoginData, type AuthResponse } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth';
import { useLoginFormStore } from '@/lib/stores/loginForm';
import { mapLoginError, type LoginError } from '@/lib/utils/apiErrorMapper';
import type { User } from '@/lib/types';

// Re-export LoginError type for consumers
export type { LoginError } from '@/lib/utils/apiErrorMapper';

// =============================================================================
// Types
// =============================================================================

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for user login.
 *
 * Features:
 * - Authenticates user via PocketBase
 * - Stores auth state in Zustand
 * - Clears form persistence on success
 * - Redirects to challenge-hub
 *
 * @returns TanStack Query mutation object
 */
export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearForm = useLoginFormStore((state) => state.clearForm);

  return useMutation<LoginResult, LoginError, LoginInput>({
    mutationFn: async (data: LoginInput): Promise<LoginResult> => {
      // Prepare login data
      const loginData: LoginData = {
        email: data.email.toLowerCase().trim(),
        password: data.password,
      };

      try {
        // Call the login API
        const authData: AuthResponse = await login(loginData);

        return {
          user: authData.record,
          token: authData.token,
        };
      } catch (error: unknown) {
        // Map API errors to form-friendly format
        throw mapLoginError(error);
      }
    },

    onSuccess: (data: LoginResult) => {
      // 1. Store auth state in Zustand
      setAuth(data.user, data.token);

      // 2. Clear form persistence (email from sessionStorage)
      clearForm();

      // 3. Redirect to challenge hub
      router.push('/challenge-hub');
    },
  });
}
