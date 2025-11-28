/**
 * useLastSprintRetrospective Hook
 *
 * TanStack Query hook for fetching and managing the last sprint retrospective data.
 * Handles loading states, error handling, and automatic refetching.
 *
 * @module lib/hooks/use-last-sprint-retrospective
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  getLastSprintRetrospective,
  type LastSprintRetrospectiveData,
} from '@/lib/api/retrospectives';

// =============================================================================
// Types
// =============================================================================

/**
 * Error type for retrospective data failures.
 */
export interface LastSprintRetrospectiveError {
  /** Error message to display to the user */
  message: string;
  /** Original error for debugging */
  cause?: unknown;
}

/**
 * Result returned by the useLastSprintRetrospective hook.
 */
export interface UseLastSprintRetrospectiveResult {
  /** The fetched retrospective data */
  data: LastSprintRetrospectiveData | null | undefined;
  /** Whether the data is currently being fetched */
  isLoading: boolean;
  /** Whether the initial load is in progress */
  isInitialLoading: boolean;
  /** Whether a refetch is in progress */
  isRefetching: boolean;
  /** Whether the fetch was successful */
  isSuccess: boolean;
  /** Whether the fetch failed */
  isError: boolean;
  /** Error details if the fetch failed */
  error: LastSprintRetrospectiveError | null;
  /** Function to manually refetch data */
  refetch: () => Promise<void>;
}

/**
 * Options for the useLastSprintRetrospective hook.
 */
export interface UseLastSprintRetrospectiveOptions {
  /** Whether to enable automatic refetching (default: true) */
  enabled?: boolean;
  /** Stale time in milliseconds (default: 10 minutes) */
  staleTime?: number;
  /** Refetch interval in milliseconds (default: disabled) */
  refetchInterval?: number;
}

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Query key factory for last sprint retrospective queries.
 */
export const lastSprintRetrospectiveKeys = {
  all: ['last-sprint-retrospective'] as const,
};

// =============================================================================
// Error Mapping
// =============================================================================

/**
 * Map API errors to user-friendly error messages.
 *
 * @param error - The original error from the API
 * @returns A LastSprintRetrospectiveError with a user-friendly message
 */
function mapError(error: unknown): LastSprintRetrospectiveError {
  if (error instanceof Error) {
    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        message: 'No retrospective data found.',
        cause: error,
      };
    }

    if (error.message.includes('Challenge data not found')) {
      return {
        message: 'Challenge information is missing for the retrospective.',
        cause: error,
      };
    }

    return {
      message: error.message,
      cause: error,
    };
  }

  return {
    message: 'Failed to load retrospective data. Please try again.',
    cause: error,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for fetching the last sprint retrospective data.
 *
 * Uses TanStack Query for caching, automatic refetching, and state management.
 * Fetches the most recent completed sprint's retrospective summary along with
 * the sprint and challenge details.
 *
 * @param options - Configuration options
 * @returns UseLastSprintRetrospectiveResult with data and loading states
 *
 * @example
 * ```tsx
 * function LastSprintRetrospective() {
 *   const {
 *     data,
 *     isLoading,
 *     error,
 *     refetch,
 *   } = useLastSprintRetrospective();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error.message} />;
 *   if (!data) return <EmptyState />;
 *
 *   return (
 *     <div>
 *       <h2>Sprint #{data.sprint.sprint_number}</h2>
 *       <p>{data.challenge.title}</p>
 *       <p>Submissions: {data.summary.submissions_count}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLastSprintRetrospective(
  options: UseLastSprintRetrospectiveOptions = {}
): UseLastSprintRetrospectiveResult {
  const {
    enabled = true,
    staleTime = 10 * 60 * 1000, // 10 minutes
    refetchInterval,
  } = options;

  // Query for fetching retrospective data
  const query = useQuery<
    LastSprintRetrospectiveData | null,
    LastSprintRetrospectiveError
  >({
    queryKey: lastSprintRetrospectiveKeys.all,
    queryFn: async () => {
      try {
        return await getLastSprintRetrospective();
      } catch (error) {
        throw mapError(error);
      }
    },
    enabled,
    staleTime,
    refetchInterval,
    retry: (failureCount, error) => {
      // Don't retry on 404 or missing data errors
      if (
        error.message.includes('not found') ||
        error.message.includes('missing')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Refetch wrapper
  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isInitialLoading: query.isLoading && query.data === undefined,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error ?? null,
    refetch,
  };
}

export default useLastSprintRetrospective;
