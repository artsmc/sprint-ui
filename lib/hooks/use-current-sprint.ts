/**
 * useCurrentSprint Hook
 *
 * TanStack Query hook for fetching and managing current sprint data.
 * Handles loading states, error handling, automatic refetching, and admin mutations.
 *
 * @module lib/hooks/use-current-sprint
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  getCurrentSprint,
  getSprintStatistics,
  endSprint,
  extendSprint,
  getSprintLastUpdate,
} from '@/lib/api/sprints';
import type { Sprint, SprintStatistics, SprintLastUpdate } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Error type for current sprint failures.
 */
export interface CurrentSprintError {
  /** Error message to display to the user */
  message: string;
  /** Original error for debugging */
  cause?: unknown;
}

/**
 * Combined current sprint data with statistics and metadata.
 */
export interface CurrentSprintData {
  /** The current sprint (active, voting, or retro) */
  sprint: Sprint;
  /** Sprint statistics (submissions, participation) */
  statistics: SprintStatistics;
  /** Last update metadata */
  lastUpdate: SprintLastUpdate | null;
}

/**
 * Result returned by the useCurrentSprint hook.
 */
export interface UseCurrentSprintResult {
  /** The fetched sprint data with statistics */
  data: CurrentSprintData | undefined;
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
  error: CurrentSprintError | null;
  /** Function to manually refetch data */
  refetch: () => Promise<void>;
  /** Mutation for ending the sprint */
  endSprintMutation: {
    mutate: (userId?: string) => void;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: CurrentSprintError | null;
  };
  /** Mutation for extending the sprint */
  extendSprintMutation: {
    mutate: (extensionDays: number) => void;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: CurrentSprintError | null;
  };
}

/**
 * Options for the useCurrentSprint hook.
 */
export interface UseCurrentSprintOptions {
  /** Whether to enable automatic refetching (default: true) */
  enabled?: boolean;
  /** Stale time in milliseconds (default: 30 seconds) */
  staleTime?: number;
  /** Refetch interval in milliseconds (default: 30 seconds) */
  refetchInterval?: number;
}

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Query key factory for current sprint queries.
 */
export const currentSprintKeys = {
  all: ['current-sprint'] as const,
  detail: () => [...currentSprintKeys.all, 'detail'] as const,
  statistics: (sprintId: string) =>
    [...currentSprintKeys.all, 'statistics', sprintId] as const,
  lastUpdate: (sprintId: string) =>
    [...currentSprintKeys.all, 'lastUpdate', sprintId] as const,
};

// =============================================================================
// Error Mapping
// =============================================================================

/**
 * Map API errors to user-friendly error messages.
 *
 * @param error - The original error from the API
 * @returns A CurrentSprintError with a user-friendly message
 */
function mapError(error: unknown): CurrentSprintError {
  if (error instanceof Error) {
    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        message: 'No active sprint found.',
        cause: error,
      };
    }

    if (error.message.includes('authenticated')) {
      return {
        message: 'Please log in to view sprint details.',
        cause: error,
      };
    }

    if (error.message.includes('Cannot extend')) {
      return {
        message: 'Unable to extend sprint. Please check the sprint status.',
        cause: error,
      };
    }

    if (error.message.includes('Cannot end')) {
      return {
        message: 'Unable to end sprint. Please check the sprint status.',
        cause: error,
      };
    }

    return {
      message: error.message,
      cause: error,
    };
  }

  return {
    message: 'Failed to load sprint data. Please try again.',
    cause: error,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for fetching current sprint data with statistics.
 *
 * Uses TanStack Query for caching, automatic refetching, and state management.
 * Provides mutations for admin actions (end sprint, extend sprint).
 *
 * @param options - Configuration options
 * @returns UseCurrentSprintResult with data, loading states, and mutations
 *
 * @example
 * ```tsx
 * function CurrentSprintStatus() {
 *   const {
 *     data,
 *     isLoading,
 *     error,
 *     endSprintMutation,
 *     extendSprintMutation,
 *   } = useCurrentSprint();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error.message} />;
 *   if (!data) return <NoSprintMessage />;
 *
 *   return (
 *     <div>
 *       <SprintHeader sprint={data.sprint} />
 *       <SprintStats stats={data.statistics} />
 *       <SprintActions
 *         onEnd={() => endSprintMutation.mutate()}
 *         onExtend={() => extendSprintMutation.mutate(3)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useCurrentSprint(
  options: UseCurrentSprintOptions = {}
): UseCurrentSprintResult {
  const {
    enabled = true,
    staleTime = 30 * 1000, // 30 seconds
    refetchInterval = 30 * 1000, // 30 seconds
  } = options;

  const queryClient = useQueryClient();

  // Query for fetching current sprint
  const sprintQuery = useQuery<Sprint | null, CurrentSprintError>({
    queryKey: currentSprintKeys.detail(),
    queryFn: async () => {
      try {
        return await getCurrentSprint();
      } catch (error) {
        throw mapError(error);
      }
    },
    enabled,
    staleTime,
    refetchInterval,
    retry: (failureCount, error) => {
      // Don't retry on 404 or auth errors
      if (
        error.message.includes('not found') ||
        error.message.includes('log in')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const sprint = sprintQuery.data;

  // Query for fetching sprint statistics (only when sprint exists)
  const statisticsQuery = useQuery<SprintStatistics, CurrentSprintError>({
    queryKey: currentSprintKeys.statistics(sprint?.id ?? ''),
    queryFn: async () => {
      if (!sprint) {
        throw new Error('No sprint available');
      }
      try {
        return await getSprintStatistics(sprint.id);
      } catch (error) {
        throw mapError(error);
      }
    },
    enabled: enabled && !!sprint,
    staleTime,
    refetchInterval,
  });

  // Query for fetching last update metadata (only when sprint exists)
  const lastUpdateQuery = useQuery<
    SprintLastUpdate | null,
    CurrentSprintError
  >({
    queryKey: currentSprintKeys.lastUpdate(sprint?.id ?? ''),
    queryFn: async () => {
      if (!sprint) {
        return null;
      }
      try {
        return await getSprintLastUpdate(sprint.id);
      } catch (error) {
        throw mapError(error);
      }
    },
    enabled: enabled && !!sprint,
    staleTime,
  });

  // Mutation for ending the sprint
  const endSprintMutation = useMutation<Sprint, CurrentSprintError, string | undefined>({
    mutationFn: async (userId) => {
      if (!sprint) {
        throw new Error('No sprint available to end');
      }
      try {
        return await endSprint(sprint.id, userId);
      } catch (error) {
        throw mapError(error);
      }
    },
    onSuccess: () => {
      // Invalidate all sprint-related queries
      queryClient.invalidateQueries({ queryKey: currentSprintKeys.all });
    },
  });

  // Mutation for extending the sprint
  const extendSprintMutation = useMutation<Sprint, CurrentSprintError, number>({
    mutationFn: async (extensionDays) => {
      if (!sprint) {
        throw new Error('No sprint available to extend');
      }
      try {
        return await extendSprint(sprint.id, extensionDays);
      } catch (error) {
        throw mapError(error);
      }
    },
    onSuccess: () => {
      // Invalidate all sprint-related queries
      queryClient.invalidateQueries({ queryKey: currentSprintKeys.all });
    },
  });

  // Refetch wrapper
  const refetch = useCallback(async () => {
    const result = await sprintQuery.refetch();
    if (result.data) {
      await Promise.all([
        statisticsQuery.refetch(),
        lastUpdateQuery.refetch(),
      ]);
    }
  }, [sprintQuery, statisticsQuery, lastUpdateQuery]);

  // Combine data
  const combinedData: CurrentSprintData | undefined =
    sprint && statisticsQuery.data
      ? {
          sprint,
          statistics: statisticsQuery.data,
          lastUpdate: lastUpdateQuery.data ?? null,
        }
      : undefined;

  // Combined loading state
  const isLoading =
    sprintQuery.isLoading ||
    (!!sprint && (statisticsQuery.isLoading || lastUpdateQuery.isLoading));

  // Combined error state
  const isError =
    sprintQuery.isError ||
    (!!sprint && (statisticsQuery.isError || lastUpdateQuery.isError));

  const error =
    sprintQuery.error ||
    statisticsQuery.error ||
    lastUpdateQuery.error ||
    null;

  return {
    data: combinedData,
    isLoading,
    isInitialLoading: isLoading && !combinedData,
    isRefetching:
      sprintQuery.isRefetching ||
      statisticsQuery.isRefetching ||
      lastUpdateQuery.isRefetching,
    isSuccess: !!combinedData && statisticsQuery.isSuccess,
    isError,
    error,
    refetch,
    endSprintMutation: {
      mutate: endSprintMutation.mutate,
      isLoading: endSprintMutation.isPending,
      isSuccess: endSprintMutation.isSuccess,
      isError: endSprintMutation.isError,
      error: endSprintMutation.error ?? null,
    },
    extendSprintMutation: {
      mutate: extendSprintMutation.mutate,
      isLoading: extendSprintMutation.isPending,
      isSuccess: extendSprintMutation.isSuccess,
      isError: extendSprintMutation.isError,
      error: extendSprintMutation.error ?? null,
    },
  };
}

export default useCurrentSprint;
