/**
 * Auth Service
 *
 * API service for authentication operations.
 * Handles user registration, login, logout, and session management.
 */

import pb from '@/lib/pocketbase';
import type { User, UserRole } from '@/lib/types';
import { Collections } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface RegisterData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  record: User;
}

// =============================================================================
// Authentication Functions
// =============================================================================

/**
 * Register a new user account.
 *
 * @param data - Registration data including email, password, and name
 * @returns The created user record
 */
export async function register(data: RegisterData): Promise<User> {
  const userData = {
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    name: data.name,
    role: data.role || 'designer',
    emailVisibility: true,
  };

  return pb.collection(Collections.USERS).create<User>(userData);
}

/**
 * Login with email and password.
 *
 * @param data - Login credentials
 * @returns Auth response with token and user record
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  const authData = await pb
    .collection(Collections.USERS)
    .authWithPassword<User>(data.email, data.password);

  // Set auth cookie for server-side access
  // The cookie is HttpOnly: false so it can be read by client JS,
  // and SameSite: Lax for CSRF protection
  if (typeof document !== 'undefined') {
    document.cookie = pb.authStore.exportToCookie({
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
  }

  return {
    token: authData.token,
    record: authData.record,
  };
}

/**
 * Logout the current user.
 * Clears the auth store and cookie.
 */
export function logout(): void {
  pb.authStore.clear();

  // Clear auth cookie
  if (typeof document !== 'undefined') {
    document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

/**
 * Refresh the current authentication token.
 *
 * @returns Fresh auth response with new token
 */
export async function refreshAuth(): Promise<AuthResponse> {
  const authData = await pb.collection(Collections.USERS).authRefresh<User>();

  return {
    token: authData.token,
    record: authData.record,
  };
}

// =============================================================================
// Session Helpers
// =============================================================================

/**
 * Get the currently authenticated user.
 *
 * @returns The current user or null if not authenticated
 */
export function getCurrentUser(): User | null {
  if (!pb.authStore.isValid) {
    return null;
  }

  return pb.authStore.record as User | null;
}

/**
 * Check if a user is currently authenticated.
 *
 * @returns True if authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Check if the current user has admin role.
 *
 * @returns True if the current user is an admin, false otherwise
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Get the current auth token.
 *
 * @returns The current token or empty string if not authenticated
 */
export function getToken(): string {
  return pb.authStore.token;
}

// =============================================================================
// User Profile Functions
// =============================================================================

/**
 * Update the current user's profile.
 *
 * @param data - Partial user data to update
 * @returns The updated user record
 */
export async function updateProfile(
  data: Partial<Pick<User, 'name' | 'avatar'>>
): Promise<User> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  return pb.collection(Collections.USERS).update<User>(user.id, data);
}

/**
 * Update the current user's avatar.
 *
 * @param file - The avatar image file
 * @returns The updated user record
 */
export async function updateAvatar(file: File): Promise<User> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('avatar', file);

  return pb.collection(Collections.USERS).update<User>(user.id, formData);
}

/**
 * Get the avatar URL for a user.
 *
 * @param user - The user record
 * @param thumb - Optional thumbnail size (e.g., '100x100')
 * @returns The avatar URL or empty string if no avatar
 */
export function getAvatarUrl(user: User, thumb?: string): string {
  if (!user.avatar) {
    return '';
  }

  return pb.files.getURL(user, user.avatar, { thumb });
}

// =============================================================================
// Password Management
// =============================================================================

/**
 * Request a password reset email.
 *
 * @param email - The user's email address
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await pb.collection(Collections.USERS).requestPasswordReset(email);
}

/**
 * Confirm a password reset with the token from the email.
 *
 * @param token - The reset token from the email
 * @param password - The new password
 * @param passwordConfirm - The new password confirmation
 */
export async function confirmPasswordReset(
  token: string,
  password: string,
  passwordConfirm: string
): Promise<void> {
  await pb
    .collection(Collections.USERS)
    .confirmPasswordReset(token, password, passwordConfirm);
}

// =============================================================================
// Email Verification
// =============================================================================

/**
 * Request email verification.
 *
 * @param email - The user's email address
 */
export async function requestVerification(email: string): Promise<void> {
  await pb.collection(Collections.USERS).requestVerification(email);
}

/**
 * Confirm email verification with the token from the email.
 *
 * @param token - The verification token from the email
 */
export async function confirmVerification(token: string): Promise<void> {
  await pb.collection(Collections.USERS).confirmVerification(token);
}

// =============================================================================
// Auth Store Subscription
// =============================================================================

/**
 * Subscribe to auth state changes.
 *
 * @param callback - Function called when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (token: string, record: User | null) => void
): () => void {
  return pb.authStore.onChange((token, record) => {
    callback(token, record as User | null);
  });
}
