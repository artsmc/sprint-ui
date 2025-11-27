'use client';

/**
 * CreateAccountForm Component
 *
 * Client Component for user registration form.
 * Features:
 * - Name, email, password fields with validation
 * - Zustand store persistence for name/email (not password)
 * - TanStack Query mutation for registration with auto-login
 * - Field-level and form-level error handling
 */

import { useState, useCallback } from 'react';
import { FeatherMail, FeatherLock, FeatherUser, FeatherAlertCircle } from '@subframe/core';
import { TextField } from '@/app/ui/components/TextField';
import { Button } from '@/app/ui/components/Button';
import { LinkButton } from '@/app/ui/components/LinkButton';
import { Alert } from '@/app/ui/components/Alert';
import { useRegister } from '@/lib/hooks/useRegister';
import { type RegisterError } from '@/lib/utils/apiErrorMapper';
import { useRegisterFormStore } from '@/lib/stores/registerForm';
import { validateForm, type FormErrors } from '@/lib/validation/formValidation';

export default function CreateAccountForm() {
  // Zustand store for form persistence (name/email only)
  const { name: storedName, email: storedEmail, setField } = useRegisterFormStore();

  // Local form state - initialized directly from store
  // Using functions to get initial values prevents hydration mismatch
  const [name, setLocalName] = useState(() => storedName);
  const [email, setLocalEmail] = useState(() => storedEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // TanStack Query mutation
  const registerMutation = useRegister();

  // Persist name to Zustand store
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalName(value);
      setField('name', value);
      // Clear error when user types
      if (errors.name) {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
    },
    [setField, errors.name]
  );

  // Persist email to Zustand store
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalEmail(value);
      setField('email', value);
      // Clear error when user types
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    },
    [setField, errors.email]
  );

  // Password is NOT persisted for security
  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      // Clear error when user types
      if (errors.password) {
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    },
    [errors.password]
  );

  // Mark field as touched on blur
  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      setTouched({ name: true, email: true, password: true });

      // Client-side validation
      const validationErrors = validateForm(name, email, password);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Clear previous errors
      setErrors({});

      // Trigger mutation
      registerMutation.mutate(
        { name, email, password },
        {
          onError: (error: RegisterError) => {
            // Map API errors to form fields
            if (error.type === 'field' && error.fields) {
              setErrors({
                name: error.fields.name?.[0],
                email: error.fields.email?.[0],
                password: error.fields.password?.[0],
              });
            }
          },
        }
      );
    },
    [name, email, password, registerMutation]
  );

  // Determine which error to show for each field
  const getFieldError = (field: keyof FormErrors): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  // Get general error message (non-field errors)
  const generalError =
    registerMutation.error?.type === 'general' ? registerMutation.error.message : undefined;

  return (
    <div className="flex h-full flex-col justify-center px-8 py-12 lg:px-12">
      <div className="w-full max-w-md">
        <h1 className="text-heading-1 font-heading-1 text-default-font mb-2">Create Account</h1>
        <p className="text-body font-body text-subtext-color mb-8">
          Already have an account?{' '}
          <LinkButton variant="brand" className="inline" onClick={() => window.location.href = '/login'}>
            Sign in
          </LinkButton>
        </p>

        {generalError && (
          <Alert
            variant="error"
            icon={<FeatherAlertCircle />}
            title="Registration failed"
            description={generalError}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Full Name"
            icon={<FeatherUser />}
            error={!!getFieldError('name')}
            helpText={getFieldError('name')}
          >
            <TextField.Input
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              onBlur={() => handleBlur('name')}
              autoComplete="name"
              disabled={registerMutation.isPending}
            />
          </TextField>

          <TextField
            label="Email"
            icon={<FeatherMail />}
            error={!!getFieldError('email')}
            helpText={getFieldError('email')}
          >
            <TextField.Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              autoComplete="email"
              disabled={registerMutation.isPending}
            />
          </TextField>

          <TextField
            label="Password"
            icon={<FeatherLock />}
            error={!!getFieldError('password')}
            helpText={getFieldError('password') || 'At least 8 characters'}
          >
            <TextField.Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              autoComplete="new-password"
              disabled={registerMutation.isPending}
            />
          </TextField>

          <Button
            type="submit"
            variant="brand-primary"
            size="large"
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
            className="mt-4 w-full"
          >
            Create Account
          </Button>
        </form>

        <p className="text-caption font-caption text-subtext-color mt-6 text-center">
          By creating an account, you agree to our{' '}
          <LinkButton variant="neutral" size="small" className="inline">
            Terms of Service
          </LinkButton>{' '}
          and{' '}
          <LinkButton variant="neutral" size="small" className="inline">
            Privacy Policy
          </LinkButton>
        </p>
      </div>
    </div>
  );
}
