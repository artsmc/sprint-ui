/**
 * useStartSprint Hook
 *
 * TanStack Query hook for starting new sprints.
 * Handles available challenges, date validation, and sprint creation.
 *
 * @module lib/hooks/use-start-sprint
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  getAvailableChallenges,
  getRandomAvailableChallenge,
} from '@/lib/api/challenges';
import {
  createSprint,
  validateSprintDates,
  getNextSprintNumber,
  CreateSprintData,
  ValidationResult,
} from '@/lib/api/sprints';
import type { Challenge, Sprint } from '@/lib/types';
import { currentSprintKeys } from './use-current-sprint';
import pb from '@/lib/pocketbase';

// =============================================================================
// Types
// =============================================================================

/**
 * Error type for start sprint failures.
 */
export interface StartSprintError {
  /** Error message to display to the user */
  message: string;
  /** Original error for debugging */
  cause?: unknown;
}

/**
 * Result returned by the useStartSprint hook.
 */
export interface UseStartSprintResult {
  /** Available challenges query */
  availableChallenges: {
    data: Challenge[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: StartSprintError | null;
    refetch: () => void;
  };
  /** Function to select a random challenge */
  selectRandomChallenge: () => Promise<Challenge | null>;
  /** Function to validate sprint dates */
  validateDates: (startDate: Date, endDate: Date) => Promise<ValidationResult>;
  /** Mutation for creating a sprint */
  createSprintMutation: {
    mutate: (data: CreateSprintData) => void;
    mutateAsync: (data: CreateSprintData) => Promise<Sprint>;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: StartSprintError | null;
    data: Sprint | undefined;
  };
  /** Function to get next sprint number */
  getNextNumber: () => Promise<number>;
}

/**
 * Options for the useStartSprint hook.
 */
export interface UseStartSprintOptions {
  /** The year to check for available challenges (defaults to current year) */
  year?: number;
  /** Whether to enable automatic refetching (default: true) */
  enabled?: boolean;
}

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Query key factory for start sprint queries.
 */
export const startSprintKeys = {
  all: ['start-sprint'] as const,
  availableChallenges: (year: number) =>
    [...startSprintKeys.all, 'available-challenges', year] as const,
};

// =============================================================================
// Error Mapping
// =============================================================================

/**
 * Map API errors to user-friendly error messages.
 *
 * @param error - The original error from the API
 * @returns A StartSprintError with a user-friendly message
 */
function mapError(error: unknown): StartSprintError {
  if (error instanceof Error) {
    if (error.message.includes('No available challenges')) {
      return {
        message:
          'All challenges have been used this year. New challenges will be available on January 1 of next year.',
        cause: error,
      };
    }

    if (error.message.includes('authenticated')) {
      return {
        message: 'Please log in as an admin to start a sprint.',
        cause: error,
      };
    }

    if (error.message.includes('overlap')) {
      return {
        message: error.message,
        cause: error,
      };
    }

    return {
      message: error.message,
      cause: error,
    };
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    cause: error,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for starting new sprints.
 *
 * Uses TanStack Query for caching, automatic refetching, and state management.
 * Provides queries for available challenges and mutations for sprint creation.
 *
 * @param options - Configuration options
 * @returns UseStartSprintResult with data, loading states, and mutations
 *
 * @example
 * ```tsx
 * function StartNextSprint() {
 *   const {
 *     availableChallenges,
 *     selectRandomChallenge,
 *     validateDates,
 *     createSprintMutation,
 *   } = useStartSprint();
 *
 *   if (availableChallenges.isLoading) return <LoadingSpinner />;
 *   if (availableChallenges.error) return <ErrorMessage />;
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <ChallengeSelector
 *         challenges={availableChallenges.data}
 *         onRandomSelect={selectRandomChallenge}
 *       />
 *       <button type="submit">Start Sprint</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useStartSprint(
  options: UseStartSprintOptions = {}
): UseStartSprintResult {
  const { year = new Date().getFullYear(), enabled = true } = options;

  const queryClient = useQueryClient();
  const [isValidating, setIsValidating] = useState(false);

  // Query for fetching available challenges
  const availableChallengesQuery = useQuery<Challenge[], StartSprintError>({
    queryKey: startSprintKeys.availableChallenges(year),
    queryFn: async () => {
      try {
        return await getAvailableChallenges(year);
      } catch (error) {
        throw mapError(error);
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on "no challenges available" error
      if (error.message.includes('All challenges have been used')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Function to select a random challenge
  const selectRandomChallenge = useCallback(async (): Promise<Challenge | null> => {
    try {
      return await getRandomAvailableChallenge(year);
    } catch (error) {
      console.error('Failed to select random challenge:', error);
      return null;
    }
  }, [year]);

  // Function to validate sprint dates
  const validateDates = useCallback(
    async (startDate: Date, endDate: Date): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        return await validateSprintDates(startDate, endDate);
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  // Function to get next sprint number
  const getNextNumber = useCallback(async (): Promise<number> => {
    try {
      return await getNextSprintNumber();
    } catch (error) {
      console.error('Failed to get next sprint number:', error);
      return 1;
    }
  }, []);

  // Mutation for creating a sprint
  const createSprintMutation = useMutation<
    Sprint,
    StartSprintError,
    CreateSprintData
  >({
    mutationFn: async (data: CreateSprintData) => {
      try {
        // Validate dates if start_at and end_at are provided
        if (data.start_at && data.end_at) {
          const validation = await validateSprintDates(
            new Date(data.start_at),
            new Date(data.end_at)
          );
          if (!validation.valid) {
            throw new Error(validation.error);
          }
        }

        // Use Next.js API endpoint which handles authentication properly
        const token = pb.authStore.token;
        if (!token) {
          throw new Error('Authentication required. Please log in to create a sprint.');
        }

        const response = await fetch('/api/v1/sprints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: `HTTP ${response.status}: ${response.statusText}`
          }));

          // Handle API error structure: { error: { code, message, details } }
          if (errorData.error) {
            const apiError = errorData.error;

            // If there are validation details, format them nicely
            if (apiError.details && Array.isArray(apiError.details)) {
              const detailMessages = apiError.details
                .map((d: any) => `${d.path}: ${d.message}`)
                .join(', ');
              throw new Error(`${apiError.message}: ${detailMessages}`);
            }

            throw new Error(apiError.message || 'Failed to create sprint');
          }

          throw new Error(errorData.message || 'Failed to create sprint');
        }

        const result = await response.json();
        return result;
      } catch (error) {
        throw mapError(error);
      }
    },
    onSuccess: () => {
      // Invalidate all sprint-related queries
      queryClient.invalidateQueries({ queryKey: currentSprintKeys.all });
      // Invalidate available challenges query
      queryClient.invalidateQueries({
        queryKey: startSprintKeys.availableChallenges(year),
      });
    },
  });

  return {
    availableChallenges: {
      data: availableChallengesQuery.data,
      isLoading: availableChallengesQuery.isLoading,
      isError: availableChallengesQuery.isError,
      error: availableChallengesQuery.error ?? null,
      refetch: availableChallengesQuery.refetch,
    },
    selectRandomChallenge,
    validateDates,
    createSprintMutation: {
      mutate: createSprintMutation.mutate,
      mutateAsync: createSprintMutation.mutateAsync,
      isLoading: createSprintMutation.isPending,
      isSuccess: createSprintMutation.isSuccess,
      isError: createSprintMutation.isError,
      error: createSprintMutation.error ?? null,
      data: createSprintMutation.data,
    },
    getNextNumber,
  };
}

export default useStartSprint;
