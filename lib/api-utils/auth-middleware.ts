/**
 * Authentication Middleware
 *
 * Utilities for authenticating API requests and enforcing authorization.
 * Integrates with the existing PocketBase auth system.
 */

import { NextRequest } from 'next/server';
import pb from '@/lib/pocketbase';
import type { User } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Authentication context containing the verified user.
 */
export interface AuthContext {
  user: User;
  token: string;
}

/**
 * Result of authentication attempt.
 */
export type AuthResult =
  | { success: true; context: AuthContext }
  | { success: false; error: string };

// =============================================================================
// Auth Middleware Class
// =============================================================================

/**
 * Authentication middleware utility class.
 *
 * Provides methods for verifying authentication and authorization.
 *
 * @example
 * // Require authentication
 * const authResult = await AuthMiddleware.requireAuth(request);
 * if (!authResult.success) {
 *   return APIErrorHandler.unauthorized(authResult.error);
 * }
 * const { user } = authResult.context;
 *
 * @example
 * // Require admin role
 * const authResult = await AuthMiddleware.requireAdmin(request);
 * if (!authResult.success) {
 *   return APIErrorHandler.forbidden(authResult.error);
 * }
 */
export class AuthMiddleware {
  /**
   * Extract the Bearer token from the Authorization header.
   *
   * @param request - The NextRequest object
   * @returns The token or null if not present
   */
  static extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.slice(7); // Remove 'Bearer ' prefix
  }

  /**
   * Verify authentication and return the user context.
   * Does not throw - returns a result object for explicit handling.
   *
   * @param request - The NextRequest object
   * @returns AuthResult with success status and context or error
   */
  static async requireAuth(request: NextRequest): Promise<AuthResult> {
    const token = this.extractToken(request);

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please provide a Bearer token.',
      };
    }

    try {
      // Set the token in PocketBase auth store
      pb.authStore.save(token, null);

      // Verify the token by refreshing auth
      const authData = await pb.collection('users').authRefresh<User>();

      return {
        success: true,
        context: {
          user: authData.record,
          token: authData.token,
        },
      };
    } catch {
      // Clear invalid token
      pb.authStore.clear();

      return {
        success: false,
        error: 'Invalid or expired authentication token.',
      };
    }
  }

  /**
   * Require admin role for the request.
   * First verifies authentication, then checks admin role.
   *
   * @param request - The NextRequest object
   * @returns AuthResult with success status and context or error
   */
  static async requireAdmin(request: NextRequest): Promise<AuthResult> {
    const authResult = await this.requireAuth(request);

    if (!authResult.success) {
      return authResult;
    }

    if (authResult.context.user.role !== 'admin') {
      return {
        success: false,
        error: 'Admin access required.',
      };
    }

    return authResult;
  }

  /**
   * Verify that the authenticated user owns the resource.
   * Use after requireAuth to check ownership.
   *
   * @param authContext - The auth context from requireAuth
   * @param resourceUserId - The user_id of the resource to check
   * @returns True if the user owns the resource or is admin
   */
  static requireOwnership(
    authContext: AuthContext,
    resourceUserId: string
  ): boolean {
    // Admins can access any resource
    if (authContext.user.role === 'admin') {
      return true;
    }

    // Check if user owns the resource
    return authContext.user.id === resourceUserId;
  }

  /**
   * Get the current user from the request without requiring authentication.
   * Returns null if not authenticated.
   *
   * @param request - The NextRequest object
   * @returns The user or null
   */
  static async getOptionalUser(request: NextRequest): Promise<User | null> {
    const authResult = await this.requireAuth(request);

    if (!authResult.success) {
      return null;
    }

    return authResult.context.user;
  }
}
