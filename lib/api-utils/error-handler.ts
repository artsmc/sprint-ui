/**
 * API Error Handler
 *
 * Utilities for standardized error handling across API routes.
 * Converts various error types into consistent API error responses.
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// =============================================================================
// Types
// =============================================================================

/**
 * Standard API error response structure.
 */
export interface APIError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    status: number;
  };
}

/**
 * Error codes used across the API.
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// =============================================================================
// Error Handler Class
// =============================================================================

/**
 * API Error Handler utility class.
 *
 * Provides methods for creating standardized error responses.
 *
 * @example
 * // Handle unknown errors
 * try {
 *   await someOperation();
 * } catch (error) {
 *   return APIErrorHandler.handleError(error);
 * }
 *
 * @example
 * // Return specific error types
 * return APIErrorHandler.notFound('Sprint not found');
 * return APIErrorHandler.unauthorized();
 */
export class APIErrorHandler {
  /**
   * Handle any error and convert it to a standardized API response.
   * Automatically detects Zod validation errors and PocketBase errors.
   */
  static handleError(error: unknown): NextResponse<APIError> {
    // Zod validation errors (Zod v4 uses 'issues' property)
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Request validation failed',
            details: error.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            })),
            status: 422,
          },
        },
        { status: 422 }
      );
    }

    // PocketBase errors (have status property)
    if (error && typeof error === 'object' && 'status' in error) {
      const pbError = error as {
        status: number;
        message: string;
        data?: unknown;
      };

      const statusCodeMap: Record<number, ErrorCode> = {
        400: ErrorCodes.BAD_REQUEST,
        401: ErrorCodes.UNAUTHORIZED,
        403: ErrorCodes.FORBIDDEN,
        404: ErrorCodes.NOT_FOUND,
        409: ErrorCodes.CONFLICT,
      };

      const code = statusCodeMap[pbError.status] || ErrorCodes.INTERNAL_ERROR;

      return NextResponse.json(
        {
          error: {
            code,
            message: pbError.message || 'An error occurred',
            details: pbError.data,
            status: pbError.status,
          },
        },
        { status: pbError.status }
      );
    }

    // Generic Error instances
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message,
          status: 500,
        },
      },
      { status: 500 }
    );
  }

  /**
   * Return a 400 Bad Request error.
   */
  static badRequest(
    message: string,
    details?: unknown
  ): NextResponse<APIError> {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.BAD_REQUEST,
          message,
          details,
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  /**
   * Return a 401 Unauthorized error.
   */
  static unauthorized(
    message: string = 'Authentication required'
  ): NextResponse<APIError> {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message,
          status: 401,
        },
      },
      { status: 401 }
    );
  }

  /**
   * Return a 403 Forbidden error.
   */
  static forbidden(
    message: string = 'Access denied'
  ): NextResponse<APIError> {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.FORBIDDEN,
          message,
          status: 403,
        },
      },
      { status: 403 }
    );
  }

  /**
   * Return a 404 Not Found error.
   */
  static notFound(
    message: string = 'Resource not found'
  ): NextResponse<APIError> {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.NOT_FOUND,
          message,
          status: 404,
        },
      },
      { status: 404 }
    );
  }

  /**
   * Return a 409 Conflict error.
   */
  static conflict(
    message: string,
    details?: unknown
  ): NextResponse<APIError> {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.CONFLICT,
          message,
          details,
          status: 409,
        },
      },
      { status: 409 }
    );
  }
}
