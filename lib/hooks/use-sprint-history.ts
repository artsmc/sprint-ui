/**
 * useSprintHistory Hook
 *
 * TanStack Query hook for fetching and managing sprint history data.
 * Handles pagination, filtering by status, loading states, and error handling.
 *
 * @module lib/hooks/use-sprint-history
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { getSprintHistory } from '@/lib/api/sprints';
import type { SprintWithRelations, SprintStatus, ListResult } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Error type for sprint history failures.
 */
export interface SprintHistoryError {
  /** Error message to display to the user */
  message: string;
  /** Original error for debugging */
  cause?: unknown;
}

/**
 * Result returned by the useSprintHistory hook.
 */
export interface UseSprintHistoryResult {
  /** The fetched sprint history data */
  data: ListResult<SprintWithRelations> | undefined;
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
  error: SprintHistoryError | null;
  /** Function to manually refetch data */
  refetch: () => Promise<void>;
  /** Current page number */
  page: number;
  /** Current status filter */
  statusFilter: SprintStatus | undefined;
  /** Function to change page */
  setPage: (page: number) => void;
  /** Function to change status filter */
  setStatusFilter: (status: SprintStatus | undefined) => void;
}

/**
 * Options for the useSprintHistory hook.
 */
export interface UseSprintHistoryOptions {
  /** Number of items per page (default: 20) */
  perPage?: number;
  /** Initial page number (default: 1) */
  initialPage?: number;
  /** Initial status filter (default: undefined) */
  initialStatusFilter?: SprintStatus;
  /** Whether to enable automatic refetching (default: true) */
  enabled?: boolean;
  /** Stale time in milliseconds (default: 5 minutes) */
  staleTime?: number;
}

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Query key factory for sprint history queries.
 */
export const sprintHistoryKeys = {
  all: ['sprint-history'] as const,
  lists: () => [...sprintHistoryKeys.all, 'list'] as const,
  list: (page: number, perPage: number, statusFilter?: SprintStatus) =>
    [...sprintHistoryKeys.lists(), { page, perPage, statusFilter }] as const,
};

// =============================================================================
// Error Mapping
// =============================================================================

/**
 * Map API errors to user-friendly error messages.
 *
 * @param error - The original error from the API
 * @returns A SprintHistoryError with a user-friendly message
 */
function mapError(error: unknown): SprintHistoryError {
  if (error instanceof Error) {
    if (error.message.includes('authenticated')) {
      return {
        message: 'Please log in to view sprint history.',
        cause: error,
      };
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        cause: error,
      };
    }

    return {
      message: error.message,
      cause: error,
    };
  }

  return {
    message: 'Failed to load sprint history. Please try again.',
    cause: error,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for fetching sprint history with pagination and filtering.
 *
 * Uses TanStack Query for caching, automatic refetching, and state management.
 * Provides pagination controls and status filtering.
 *
 * @param options - Configuration options
 * @returns UseSprintHistoryResult with data, loading states, and controls
 *
 * @example
 * ```tsx
 * function SprintHistoryTable() {
 *   const {
 *     data,
 *     isLoading,
 *     error,
 *     page,
 *     setPage,
 *     statusFilter,
 *     setStatusFilter,
 *   } = useSprintHistory();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error.message} />;
 *   if (!data || data.items.length === 0) return <EmptyState />;
 *
 *   return (
 *     <div>
 *       <FilterDropdown value={statusFilter} onChange={setStatusFilter} />
 *       <Table data={data.items} />
 *       <Pagination
 *         currentPage={page}
 *         totalPages={data.totalPages}
 *         onPageChange={setPage}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useSprintHistory(
  options: UseSprintHistoryOptions = {}
): UseSprintHistoryResult {
  const {
    perPage = 20,
    initialPage = 1,
    initialStatusFilter,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [page, setPage] = useState(initialPage);
  const [statusFilter, setStatusFilter] = useState<SprintStatus | undefined>(
    initialStatusFilter
  );

  // Query for fetching sprint history
  const query = useQuery<
    ListResult<SprintWithRelations>,
    SprintHistoryError
  >({
    queryKey: sprintHistoryKeys.list(page, perPage, statusFilter),
    queryFn: async () => {
      try {
        return await getSprintHistory(page, perPage, statusFilter);
      } catch (error) {
        throw mapError(error);
      }
    },
    enabled,
    staleTime,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('log in')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Refetch wrapper
  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  // Reset to page 1 when status filter changes
  const handleStatusFilterChange = useCallback(
    (newStatusFilter: SprintStatus | undefined) => {
      setStatusFilter(newStatusFilter);
      setPage(1);
    },
    []
  );

  return {
    data: query.data,
    isLoading: query.isLoading,
    isInitialLoading: query.isLoading && !query.data,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error ?? null,
    refetch,
    page,
    statusFilter,
    setPage,
    setStatusFilter: handleStatusFilterChange,
  };
}

export default useSprintHistory;
