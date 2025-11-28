/**
 * useUserProfileSidebar Hook
 *
 * TanStack Query hook for fetching and managing user profile sidebar data.
 * Handles loading states, error handling, and automatic refetching.
 *
 * @module lib/hooks/use-user-profile-sidebar
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
  getUserProfileSidebarData,
  type UserProfileSidebarData,
  type HighlightTabType,
} from '@/lib/api/user-profile-sidebar';

// =============================================================================
// Types
// =============================================================================

/**
 * Error type for user profile sidebar failures.
 */
export interface UserProfileSidebarError {
  /** Error message to display to the user */
  message: string;
  /** Original error for debugging */
  cause?: unknown;
}

/**
 * Result returned by the useUserProfileSidebar hook.
 */
export interface UseUserProfileSidebarResult {
  /** The fetched sidebar data */
  data: UserProfileSidebarData | undefined;
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
  error: UserProfileSidebarError | null;
  /** Function to manually refetch data */
  refetch: () => Promise<void>;
  /** Currently active highlight tab */
  activeHighlightTab: HighlightTabType;
  /** Function to change the active highlight tab */
  setActiveHighlightTab: (tab: HighlightTabType) => void;
}

/**
 * Options for the useUserProfileSidebar hook.
 */
export interface UseUserProfileSidebarOptions {
  /** The user ID to fetch data for (required) */
  userId: string | undefined;
  /** Whether to enable automatic refetching (default: true) */
  enabled?: boolean;
  /** Stale time in milliseconds (default: 5 minutes) */
  staleTime?: number;
  /** Refetch interval in milliseconds (default: disabled) */
  refetchInterval?: number;
}

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Query key factory for user profile sidebar queries.
 */
export const userProfileSidebarKeys = {
  all: ['user-profile-sidebar'] as const,
  detail: (userId: string) => [...userProfileSidebarKeys.all, userId] as const,
};

// =============================================================================
// Error Mapping
// =============================================================================

/**
 * Map API errors to user-friendly error messages.
 *
 * @param error - The original error from the API
 * @returns A UserProfileSidebarError with a user-friendly message
 */
function mapError(error: unknown): UserProfileSidebarError {
  if (error instanceof Error) {
    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        message: 'User profile not found.',
        cause: error,
      };
    }

    if (error.message.includes('authenticated')) {
      return {
        message: 'Please log in to view your profile.',
        cause: error,
      };
    }

    return {
      message: error.message,
      cause: error,
    };
  }

  return {
    message: 'Failed to load profile data. Please try again.',
    cause: error,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for fetching user profile sidebar data.
 *
 * Uses TanStack Query for caching, automatic refetching, and state management.
 * Also manages the active highlight tab state locally.
 *
 * @param options - Configuration options
 * @returns UseUserProfileSidebarResult with data, loading states, and tab management
 *
 * @example
 * ```tsx
 * function ProfileSidebar() {
 *   const {
 *     data,
 *     isLoading,
 *     error,
 *     activeHighlightTab,
 *     setActiveHighlightTab,
 *   } = useUserProfileSidebar({ userId: currentUser?.id });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error.message} />;
 *   if (!data) return null;
 *
 *   return (
 *     <div>
 *       <ProfileCard user={data.user} level={data.level} />
 *       <HighlightsTabs
 *         activeTab={activeHighlightTab}
 *         onTabChange={setActiveHighlightTab}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserProfileSidebar(
  options: UseUserProfileSidebarOptions
): UseUserProfileSidebarResult {
  const {
    userId,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchInterval,
  } = options;

  // Local state for active highlight tab
  const [activeHighlightTab, setActiveHighlightTab] =
    useState<HighlightTabType>('recognition');

  // Query for fetching sidebar data
  const query = useQuery<UserProfileSidebarData, UserProfileSidebarError>({
    queryKey: userProfileSidebarKeys.detail(userId ?? ''),
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      try {
        return await getUserProfileSidebarData(userId);
      } catch (error) {
        throw mapError(error);
      }
    },
    enabled: enabled && !!userId,
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

  // Refetch wrapper
  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isInitialLoading: query.isLoading && !query.data,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error ?? null,
    refetch,
    activeHighlightTab,
    setActiveHighlightTab,
  };
}

export default useUserProfileSidebar;
