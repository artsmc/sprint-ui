/**
 * Authentication Validation Schemas
 *
 * Zod schemas for validating authentication-related requests.
 */

import { z } from 'zod';

// =============================================================================
// Register Schema
// =============================================================================

/**
 * Schema for user registration requests.
 * Validates email format, password strength, and password confirmation.
 */
export const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'),
    passwordConfirm: z.string(),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

// =============================================================================
// Login Schema
// =============================================================================

/**
 * Schema for user login requests.
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// =============================================================================
// Update Profile Schema
// =============================================================================

/**
 * Schema for updating user profile.
 */
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  emailVisibility: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// =============================================================================
// Password Reset Schema
// =============================================================================

/**
 * Schema for password reset request.
 */
export const RequestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type RequestPasswordResetInput = z.infer<
  typeof RequestPasswordResetSchema
>;

/**
 * Schema for confirming password reset.
 */
export const ConfirmPasswordResetSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export type ConfirmPasswordResetInput = z.infer<
  typeof ConfirmPasswordResetSchema
>;
