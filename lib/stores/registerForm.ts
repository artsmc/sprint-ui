/**
 * Register Form Store
 *
 * Manages registration form state with sessionStorage persistence.
 * SECURITY: Only stores name and email. Password is NEVER persisted.
 * Data is cleared when the browser tab closes.
 *
 * @example
 * const { name, email, setField, clearForm } = useRegisterFormStore();
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RegisterFormState {
  name: string;
  email: string;
  setField: (field: 'name' | 'email', value: string) => void;
  clearForm: () => void;
}

export const useRegisterFormStore = create<RegisterFormState>()(
  persist(
    (set) => ({
      name: '',
      email: '',
      setField: (field, value) => set({ [field]: value }),
      clearForm: () => set({ name: '', email: '' }),
    }),
    {
      name: 'register-form',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
