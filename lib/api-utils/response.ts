/**
 * API Response Helpers
 *
 * Utilities for creating standardized success responses across API routes.
 */

import { NextResponse } from 'next/server';
import type { ListResult } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Standard paginated response structure.
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

// =============================================================================
// Response Helper Class
// =============================================================================

/**
 * API Response utility class.
 *
 * Provides methods for creating standardized success responses.
 *
 * @example
 * // Return success response
 * return APIResponse.success(data);
 *
 * @example
 * // Return created response (201)
 * return APIResponse.created(newRecord);
 *
 * @example
 * // Return paginated response
 * const result = await pb.collection('sprints').getList();
 * return APIResponse.paginated(result);
 */
export class APIResponse {
  /**
   * Return a successful response with data.
   * Default status is 200 OK.
   */
  static success<T>(data: T, status: number = 200): NextResponse<T> {
    return NextResponse.json(data, { status });
  }

  /**
   * Return a 201 Created response with data.
   */
  static created<T>(data: T): NextResponse<T> {
    return NextResponse.json(data, { status: 201 });
  }

  /**
   * Return a 204 No Content response.
   * Used for successful deletions or operations with no return data.
   */
  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }

  /**
   * Return a paginated response from a PocketBase ListResult.
   * Transforms the PocketBase format into our standard format.
   */
  static paginated<T>(listResult: ListResult<T>): NextResponse<PaginatedResponse<T>> {
    return NextResponse.json({
      items: listResult.items,
      page: listResult.page,
      perPage: listResult.perPage,
      totalItems: listResult.totalItems,
      totalPages: listResult.totalPages,
    });
  }

  /**
   * Return a response with cache headers.
   * Useful for public, rarely-changing data like skills and badges.
   *
   * @param data - Response data
   * @param maxAge - Cache max age in seconds (default: 3600 = 1 hour)
   */
  static withCache<T>(data: T, maxAge: number = 3600): NextResponse<T> {
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
      },
    });
  }

  /**
   * Return a response with no-cache headers.
   * Useful for user-specific or frequently-changing data.
   */
  static noCache<T>(data: T): NextResponse<T> {
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
