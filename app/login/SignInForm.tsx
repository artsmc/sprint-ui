'use client';

/**
 * SignInForm Component
 *
 * Client Component for user login form.
 * Features:
 * - Email and password fields with validation
 * - Zustand store persistence for email (not password)
 * - TanStack Query mutation for authentication
 * - Field-level and form-level error handling
 * - Registration success toast
 * - Already authenticated redirect
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FeatherMail, FeatherLock, FeatherAlertCircle, FeatherCheckCircle } from '@subframe/core';
import { TextField } from '@/app/ui/components/TextField';
import { Button } from '@/app/ui/components/Button';
import { LinkButton } from '@/app/ui/components/LinkButton';
import { Alert } from '@/app/ui/components/Alert';
import { useLogin } from '@/lib/hooks/useLogin';
import { type LoginError } from '@/lib/utils/apiErrorMapper';
import { useLoginFormStore } from '@/lib/stores/loginForm';
import { useAuthStore } from '@/lib/stores/auth';
import { validateLoginForm, type LoginFormErrors } from '@/lib/validation/formValidation';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is already authenticated
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Zustand store for form persistence (email only)
  const { email: storedEmail, setEmail: setStoredEmail } = useLoginFormStore();

  // Local form state - initialized directly from store
  // Using functions to get initial values prevents hydration mismatch
  const [email, setLocalEmail] = useState(() => storedEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  // Check for registration success - initialize from URL param to avoid setState in effect
  const [showRegistrationToast, setShowRegistrationToast] = useState(
    () => searchParams.get('registered') === 'true'
  );

  // TanStack Query mutation
  const loginMutation = useLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/challenge-hub');
    }
  }, [isAuthenticated, router]);

  // Persist email to Zustand store
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalEmail(value);
      setStoredEmail(value);
      // Clear error when user types
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    },
    [setStoredEmail, errors.email]
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
      setTouched({ email: true, password: true });

      // Client-side validation
      const validationErrors = validateLoginForm(email, password);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Clear previous errors
      setErrors({});

      // Trigger mutation
      loginMutation.mutate(
        { email, password },
        {
          onError: (error: LoginError) => {
            // Map API errors to form fields
            if (error.type === 'field' && error.fields) {
              setErrors({
                email: error.fields.email?.[0],
                password: error.fields.password?.[0],
              });
            }
          },
        }
      );
    },
    [email, password, loginMutation]
  );

  // Determine which error to show for each field
  const getFieldError = (field: keyof LoginFormErrors): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  // Get general error message (non-field errors)
  const generalError =
    loginMutation.error?.type === 'general' ? loginMutation.error.message : undefined;

  return (
    <div className="flex h-full flex-col justify-center px-8 py-12 lg:px-12">
      <div className="w-full max-w-md">
        <h1 className="text-heading-1 font-heading-1 text-default-font mb-2">Welcome back</h1>
        <p className="text-body font-body text-subtext-color mb-8">Sign in to your account</p>

        {showRegistrationToast && (
          <Alert
            variant="success"
            icon={<FeatherCheckCircle />}
            title="Account created successfully"
            description="Please sign in with your new account."
            className="mb-6"
            actions={
              <button
                type="button"
                onClick={() => setShowRegistrationToast(false)}
                className="text-success-700 hover:text-success-800 text-sm font-medium"
              >
                Dismiss
              </button>
            }
          />
        )}

        {generalError && (
          <Alert
            variant="error"
            icon={<FeatherAlertCircle />}
            title="Sign in failed"
            description={generalError}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              disabled={loginMutation.isPending}
            />
          </TextField>

          <TextField
            label="Password"
            icon={<FeatherLock />}
            error={!!getFieldError('password')}
            helpText={getFieldError('password')}
          >
            <TextField.Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              autoComplete="current-password"
              disabled={loginMutation.isPending}
            />
          </TextField>

          <div className="flex justify-end">
            <LinkButton
              variant="neutral"
              size="small"
              className="inline"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot password?
            </LinkButton>
          </div>

          <Button
            type="submit"
            variant="brand-primary"
            size="large"
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            className="mt-4 w-full"
          >
            Sign In
          </Button>
        </form>

        <p className="text-body font-body text-subtext-color mt-6 text-center">
          Don&apos;t have an account?{' '}
          <LinkButton
            variant="brand"
            className="inline"
            onClick={() => router.push('/register')}
          >
            Create account
          </LinkButton>
        </p>
      </div>
    </div>
  );
}
