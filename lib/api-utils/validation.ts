/**
 * Request Validation Helpers
 *
 * Utilities for validating incoming API requests using Zod schemas.
 */

import { z, type ZodSchema } from 'zod';
import { NextRequest } from 'next/server';

// =============================================================================
// Common Schemas
// =============================================================================

/**
 * Standard pagination query parameters schema.
 */
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

/**
 * ID parameter schema (for route params).
 */
export const IdParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export type IdParam = z.infer<typeof IdParamSchema>;

// =============================================================================
// Request Validator Class
// =============================================================================

/**
 * Request validation utility class.
 *
 * Provides methods for validating request body, query params, and route params.
 *
 * @example
 * // Validate request body
 * const data = await RequestValidator.validateBody(request, CreateSprintSchema);
 *
 * @example
 * // Validate query parameters
 * const { page, perPage } = RequestValidator.validateQuery(request, PaginationQuerySchema);
 *
 * @example
 * // Validate route params
 * const { id } = await RequestValidator.validateParams(params, IdParamSchema);
 */
export class RequestValidator {
  /**
   * Validate the request body against a Zod schema.
   * Throws ZodError if validation fails (handled by APIErrorHandler).
   *
   * @param request - The NextRequest object
   * @param schema - Zod schema to validate against
   * @returns Validated and typed data
   */
  static async validateBody<T>(
    request: NextRequest,
    schema: ZodSchema<T>
  ): Promise<T> {
    const body = await request.json();
    return schema.parse(body);
  }

  /**
   * Validate query parameters against a Zod schema.
   * Automatically handles coercion for numbers and booleans.
   *
   * @param request - The NextRequest object
   * @param schema - Zod schema to validate against
   * @returns Validated and typed query parameters
   */
  static validateQuery<T>(
    request: NextRequest,
    schema: ZodSchema<T>
  ): T {
    const { searchParams } = new URL(request.url);
    const queryObj: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    return schema.parse(queryObj);
  }

  /**
   * Validate route parameters against a Zod schema.
   * Handles the async params pattern in Next.js 15+.
   *
   * @param params - Route parameters (may be a Promise in Next.js 15+)
   * @param schema - Zod schema to validate against
   * @returns Validated and typed route parameters
   */
  static async validateParams<T>(
    params: Promise<Record<string, string>> | Record<string, string>,
    schema: ZodSchema<T>
  ): Promise<T> {
    const resolvedParams = await params;
    return schema.parse(resolvedParams);
  }

  /**
   * Parse pagination from query parameters with defaults.
   * Convenience method for common pagination pattern.
   *
   * @param request - The NextRequest object
   * @returns Pagination parameters with defaults applied
   */
  static getPagination(request: NextRequest): PaginationQuery {
    return this.validateQuery(request, PaginationQuerySchema);
  }

  /**
   * Get a single query parameter value.
   * Returns undefined if not present.
   *
   * @param request - The NextRequest object
   * @param key - Query parameter key
   * @returns Parameter value or undefined
   */
  static getQueryParam(request: NextRequest, key: string): string | undefined {
    const { searchParams } = new URL(request.url);
    return searchParams.get(key) ?? undefined;
  }

  /**
   * Check if a query parameter exists.
   *
   * @param request - The NextRequest object
   * @param key - Query parameter key
   * @returns True if parameter exists
   */
  static hasQueryParam(request: NextRequest, key: string): boolean {
    const { searchParams } = new URL(request.url);
    return searchParams.has(key);
  }
}
