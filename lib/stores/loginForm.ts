/**
 * Login Form Store
 *
 * Manages login form state with sessionStorage persistence.
 * SECURITY: Only stores email. Password is NEVER persisted.
 * Data is cleared when the browser tab closes.
 *
 * @example
 * const { email, setEmail, clearForm } = useLoginFormStore();
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LoginFormState {
  email: string;
  setEmail: (email: string) => void;
  clearForm: () => void;
}

export const useLoginFormStore = create<LoginFormState>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email) => set({ email }),
      clearForm: () => set({ email: '' }),
    }),
    {
      name: 'login-form',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
