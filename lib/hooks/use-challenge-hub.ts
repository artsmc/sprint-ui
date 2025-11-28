/**
 * useChallengeHub Hook
 *
 * TanStack Query hook for fetching and managing Challenge Hub page data.
 * Provides all data needed for the left column components: ActiveChallengeCard,
 * SprintProgressTracker, and SkillGrowthSection.
 *
 * @module lib/hooks/use-challenge-hub
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import pb from '@/lib/pocketbase';
import { getChallengeHubData, type ChallengeHubData } from '@/lib/api/challenge-hub';
import { getSprintWithChallenge } from '@/lib/api/sprints';
import type {
  Challenge,
  UserSprintTask,
  SprintTaskType,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { filterEquals, filterAnd } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Task definition with XP value and display information.
 */
export interface TaskDefinition {
  /** Unique task type identifier */
  id: SprintTaskType;
  /** Display name for the task */
  name: string;
  /** XP reward for completing this task */
  xp: number;
  /** Brief description of the task */
  description: string;
}

/**
 * Task with completion status for display.
 */
export interface TaskWithStatus extends TaskDefinition {
  /** Whether the task has been completed */
  completed: boolean;
  /** When the task was completed, if applicable */
  completedAt: string | null;
}

/**
 * Sprint task progress data.
 */
export interface SprintTaskProgress {
  /** List of tasks with completion status */
  tasks: TaskWithStatus[];
  /** Total XP earned from completed tasks */
  totalXP: number;
  /** Maximum possible XP for all tasks */
  maxXP: number;
  /** Number of completed tasks */
  completedCount: number;
}

/**
 * Error type for challenge hub failures.
 */
export interface ChallengeHubError {
  /** Error message to display to the user */
  message: string;
  /** Original error for debugging */
  cause?: unknown;
}

/**
 * Extended challenge hub data with challenge details and task progress.
 */
export interface ChallengeHubFullData extends ChallengeHubData {
  /** Challenge details for the active sprint */
  challenge: Challenge | null;
  /** Sprint task progress for the current user */
  taskProgress: SprintTaskProgress;
}

/**
 * Result returned by the useChallengeHub hook.
 */
export interface UseChallengeHubResult {
  /** The fetched challenge hub data */
  data: ChallengeHubFullData | undefined;
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
  error: ChallengeHubError | null;
  /** Function to manually refetch data */
  refetch: () => Promise<void>;
}

/**
 * Options for the useChallengeHub hook.
 */
export interface UseChallengeHubOptions {
  /** The user ID to fetch data for */
  userId: string | undefined;
  /** Whether to enable automatic refetching (default: true) */
  enabled?: boolean;
  /** Stale time in milliseconds (default: 2 minutes) */
  staleTime?: number;
  /** Refetch interval in milliseconds (default: disabled) */
  refetchInterval?: number;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Sprint task definitions with XP values.
 * Order represents the expected task completion flow.
 */
export const SPRINT_TASKS: TaskDefinition[] = [
  {
    id: 'read_brief',
    name: 'Read the brief',
    xp: 10,
    description: 'Review the challenge requirements',
  },
  {
    id: 'upload_design',
    name: 'Upload your design',
    xp: 50,
    description: 'Submit your design solution',
  },
  {
    id: 'vote_on_peers',
    name: 'Vote on peer designs',
    xp: 20,
    description: 'Review and vote for the best designs',
  },
  {
    id: 'leave_feedback',
    name: 'Leave feedback',
    xp: 30,
    description: 'Provide constructive feedback to peers',
  },
  {
    id: 'reflection',
    name: 'Complete reflection',
    xp: 15,
    description: 'Reflect on what you learned',
  },
];

/**
 * Total XP available for completing all sprint tasks.
 */
export const MAX_SPRINT_TASK_XP = SPRINT_TASKS.reduce(
  (sum, task) => sum + task.xp,
  0
);

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Query key factory for challenge hub queries.
 */
export const challengeHubKeys = {
  all: ['challenge-hub'] as const,
  detail: (userId: string) => [...challengeHubKeys.all, userId] as const,
  tasks: (sprintId: string, userId: string) =>
    [...challengeHubKeys.all, 'tasks', sprintId, userId] as const,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Fetch user's sprint tasks for a specific sprint.
 */
async function getUserSprintTasks(
  sprintId: string,
  userId: string
): Promise<UserSprintTask[]> {
  try {
    const filter = filterAnd([
      filterEquals('sprint_id', sprintId),
      filterEquals('user_id', userId),
    ]);

    return await pb
      .collection(Collections.USER_SPRINT_TASKS)
      .getFullList<UserSprintTask>({
        filter,
      });
  } catch {
    return [];
  }
}

/**
 * Build task progress data from user's completed tasks.
 */
function buildTaskProgress(userTasks: UserSprintTask[]): SprintTaskProgress {
  const completedTaskTypes = new Set(userTasks.map((t) => t.task_type));

  const tasks: TaskWithStatus[] = SPRINT_TASKS.map((taskDef) => {
    const userTask = userTasks.find((t) => t.task_type === taskDef.id);
    return {
      ...taskDef,
      completed: completedTaskTypes.has(taskDef.id),
      completedAt: userTask?.completed_at ?? null,
    };
  });

  const completedTasks = tasks.filter((t) => t.completed);
  const totalXP = completedTasks.reduce((sum, t) => sum + t.xp, 0);

  return {
    tasks,
    totalXP,
    maxXP: MAX_SPRINT_TASK_XP,
    completedCount: completedTasks.length,
  };
}

/**
 * Map API errors to user-friendly error messages.
 */
function mapError(error: unknown): ChallengeHubError {
  if (error instanceof Error) {
    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        message: 'Data not found.',
        cause: error,
      };
    }

    if (error.message.includes('authenticated')) {
      return {
        message: 'Please log in to view the Challenge Hub.',
        cause: error,
      };
    }

    return {
      message: error.message,
      cause: error,
    };
  }

  return {
    message: 'Failed to load Challenge Hub data. Please try again.',
    cause: error,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for fetching Challenge Hub page data.
 *
 * Uses TanStack Query for caching, automatic refetching, and state management.
 * Combines data from multiple sources:
 * - getChallengeHubData for base challenge hub data
 * - Sprint challenge details
 * - User's sprint task progress
 *
 * @param options - Configuration options
 * @returns UseChallengeHubResult with data and loading states
 *
 * @example
 * ```tsx
 * function ChallengeHubPage() {
 *   const { data, isLoading, error } = useChallengeHub({ userId: user?.id });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error.message} />;
 *   if (!data?.activeSprint) return <NoActiveSprintState />;
 *
 *   return (
 *     <div>
 *       <ActiveChallengeCard
 *         sprint={data.activeSprint}
 *         challenge={data.challenge!}
 *         isParticipant={data.isParticipant}
 *       />
 *       <SprintProgressTracker
 *         tasks={data.taskProgress.tasks}
 *         totalXP={data.taskProgress.totalXP}
 *         maxXP={data.taskProgress.maxXP}
 *       />
 *       <SkillGrowthSection skillProgress={data.userSkillProgress} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useChallengeHub(
  options: UseChallengeHubOptions
): UseChallengeHubResult {
  const {
    userId,
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes
    refetchInterval,
  } = options;

  // Query for fetching all challenge hub data
  const query = useQuery<ChallengeHubFullData, ChallengeHubError>({
    queryKey: challengeHubKeys.detail(userId ?? ''),
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      try {
        // Fetch base challenge hub data
        const hubData = await getChallengeHubData(userId);

        // Fetch challenge details if there's an active sprint
        let challenge: Challenge | null = null;
        if (hubData.activeSprint) {
          const sprintWithChallenge = await getSprintWithChallenge(
            hubData.activeSprint.id
          );
          challenge = sprintWithChallenge.expand?.challenge_id ?? null;
        }

        // Fetch task progress if there's an active sprint
        let taskProgress: SprintTaskProgress = {
          tasks: SPRINT_TASKS.map((t) => ({
            ...t,
            completed: false,
            completedAt: null,
          })),
          totalXP: 0,
          maxXP: MAX_SPRINT_TASK_XP,
          completedCount: 0,
        };

        if (hubData.activeSprint && hubData.isParticipant) {
          const userTasks = await getUserSprintTasks(
            hubData.activeSprint.id,
            userId
          );
          taskProgress = buildTaskProgress(userTasks);
        }

        return {
          ...hubData,
          challenge,
          taskProgress,
        };
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
  };
}

export default useChallengeHub;
