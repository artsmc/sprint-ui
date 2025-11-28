/**
 * useRegister Hook
 *
 * TanStack Query mutation hook for user registration.
 * Handles registration, auto-login, and state management.
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { register, login, type RegisterData, type AuthResponse } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth';
import { useRegisterFormStore } from '@/lib/stores/registerForm';
import { mapApiError, type RegisterError } from '@/lib/utils/apiErrorMapper';
import type { User } from '@/lib/types';

// Re-export RegisterError type for consumers
export type { RegisterError } from '@/lib/utils/apiErrorMapper';

// =============================================================================
// Types
// =============================================================================

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  user: User;
  authData: AuthResponse;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for user registration with auto-login.
 *
 * Features:
 * - Registers user via PocketBase
 * - Auto-logs in after successful registration
 * - Stores auth state in Zustand
 * - Clears form persistence on success
 * - Redirects to dashboard
 *
 * @returns TanStack Query mutation object
 */
export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearForm = useRegisterFormStore((state) => state.clearForm);

  return useMutation<RegisterResult, RegisterError, RegisterInput>({
    mutationFn: async (data: RegisterInput): Promise<RegisterResult> => {
      // Prepare registration data
      const registerData: RegisterData = {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        passwordConfirm: data.password,
        name: data.name.trim(),
      };

      try {
        // 1. Register the user
        const user = await register(registerData);

        // 2. Auto-login immediately after registration
        const authData = await login({
          email: registerData.email,
          password: registerData.password,
        });

        return { user, authData };
      } catch (error: unknown) {
        // Map API errors to form-friendly format
        throw mapApiError(error);
      }
    },

    onSuccess: (data: RegisterResult) => {
      // 3. Store auth state in Zustand
      setAuth(data.authData.record, data.authData.token);

      // 4. Clear form persistence (name/email from sessionStorage)
      clearForm();

      // 5. Redirect to challenge hub
      router.push('/challenge-hub');
    },
  });
}
