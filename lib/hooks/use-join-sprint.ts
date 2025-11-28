/**
 * useJoinSprint Hook
 *
 * TanStack Query mutation hook for joining a sprint.
 * Handles loading states, error handling, and page refresh on success.
 *
 * @module lib/hooks/use-join-sprint
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { joinSprint as joinSprintApi } from '@/lib/api/participants';
import type { SprintParticipant } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Input for joining a sprint.
 */
export interface JoinSprintInput {
  /** The ID of the sprint to join */
  sprintId: string;
}

/**
 * Error type for join sprint failures.
 */
export interface JoinSprintError {
  /** Error message to display to the user */
  message: string;
  /** Original error for debugging */
  cause?: unknown;
}

/**
 * Result returned by the useJoinSprint hook.
 */
export interface UseJoinSprintResult {
  /** Whether the mutation is currently in progress */
  isJoining: boolean;
  /** Whether the mutation was successful */
  isSuccess: boolean;
  /** Whether the mutation failed */
  isError: boolean;
  /** Error details if the mutation failed */
  error: JoinSprintError | null;
  /** Function to trigger the join sprint mutation */
  joinSprint: (sprintId: string) => Promise<SprintParticipant | undefined>;
  /** Function to reset the mutation state */
  reset: () => void;
}

// =============================================================================
// Error Mapping
// =============================================================================

/**
 * Map API errors to user-friendly error messages.
 *
 * @param error - The original error from the API
 * @returns A JoinSprintError with a user-friendly message
 */
function mapJoinSprintError(error: unknown): JoinSprintError {
  if (error instanceof Error) {
    // Handle known error messages
    if (error.message === 'Not authenticated') {
      return {
        message: 'You must be logged in to join a sprint.',
        cause: error,
      };
    }

    if (error.message === 'Already participating in this sprint') {
      return {
        message: "You're already participating in this sprint.",
        cause: error,
      };
    }

    // Return the original message for other errors
    return {
      message: error.message,
      cause: error,
    };
  }

  // Fallback for unknown error types
  return {
    message: 'Failed to join sprint. Please try again.',
    cause: error,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for joining a sprint.
 *
 * Uses TanStack Query for mutation management with automatic
 * cache invalidation and page refresh on success.
 *
 * @returns UseJoinSprintResult with mutation state and trigger function
 *
 * @example
 * ```tsx
 * function JoinButton({ sprintId, sprintName }: Props) {
 *   const { joinSprint, isJoining, error } = useJoinSprint();
 *
 *   const handleClick = async () => {
 *     const result = await joinSprint(sprintId);
 *     if (result) {
 *       toast.success(`Joined ${sprintName}!`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleClick} disabled={isJoining}>
 *       {isJoining ? 'Joining...' : 'Join Sprint'}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useJoinSprint(): UseJoinSprintResult {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<SprintParticipant, JoinSprintError, JoinSprintInput>({
    mutationFn: async ({ sprintId }: JoinSprintInput): Promise<SprintParticipant> => {
      try {
        return await joinSprintApi(sprintId);
      } catch (error: unknown) {
        throw mapJoinSprintError(error);
      }
    },

    onSuccess: (_data, variables) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['sprint', variables.sprintId] });
      queryClient.invalidateQueries({ queryKey: ['sprint-participants'] });
      queryClient.invalidateQueries({ queryKey: ['user-sprints'] });

      // Refresh the page to update server components
      router.refresh();
    },
  });

  // Wrapper function for easier API
  const joinSprint = async (sprintId: string): Promise<SprintParticipant | undefined> => {
    try {
      return await mutation.mutateAsync({ sprintId });
    } catch {
      // Error is already captured in mutation.error
      return undefined;
    }
  };

  return {
    isJoining: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ?? null,
    joinSprint,
    reset: mutation.reset,
  };
}

// =============================================================================
// Alternative Hook: Simple State Version (No TanStack Query)
// =============================================================================

/**
 * Simple version of useJoinSprint without TanStack Query dependency.
 *
 * Use this if you don't need query caching or prefer simpler state management.
 *
 * @returns UseJoinSprintResult with mutation state and trigger function
 */
export function useJoinSprintSimple(): UseJoinSprintResult {
  const router = useRouter();

  // Use React's built-in state
  const [isJoining, setIsJoining] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<JoinSprintError | null>(null);

  const joinSprint = async (sprintId: string): Promise<SprintParticipant | undefined> => {
    setIsJoining(true);
    setIsError(false);
    setError(null);

    try {
      const result = await joinSprintApi(sprintId);
      setIsSuccess(true);
      router.refresh();
      return result;
    } catch (err: unknown) {
      const mappedError = mapJoinSprintError(err);
      setIsError(true);
      setError(mappedError);
      return undefined;
    } finally {
      setIsJoining(false);
    }
  };

  const reset = () => {
    setIsJoining(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  return {
    isJoining,
    isSuccess,
    isError,
    error,
    joinSprint,
    reset,
  };
}

// Import useState for the simple version
import { useState } from 'react';
