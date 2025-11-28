/**
 * Sprint Tasks Service
 *
 * API service for tracking sprint task completion status.
 * Determines which tasks a user has completed during a sprint
 * based on XP events, submissions, votes, and feedback.
 *
 * @module lib/api/sprint-tasks
 */

import pb from '@/lib/pocketbase';
import type {
  XPEvent,
  Submission,
  Vote,
  Feedback,
  XPSourceType,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { filterEquals, filterAnd } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Task item for the Sprint Progress Tracker component.
 */
export interface TaskItem {
  /** Unique identifier for the task */
  id: string;
  /** Display name of the task */
  name: string;
  /** XP reward for completing the task */
  xp: number;
  /** Whether the task has been completed */
  completed: boolean;
}

/**
 * Sprint task completion result with tasks and XP summary.
 */
export interface SprintTaskCompletion {
  /** Array of task items with completion status */
  tasks: TaskItem[];
  /** Total XP earned from completed tasks */
  totalXP: number;
  /** Maximum possible XP from all tasks */
  maxXP: number;
  /** Number of completed tasks */
  completedCount: number;
  /** Total number of tasks */
  totalCount: number;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Task definitions with IDs, names, and XP rewards.
 * Matches FRS.md Section 2.3.3 specifications.
 */
const SPRINT_TASKS: Readonly<Array<{ id: string; name: string; xp: number }>> = [
  { id: 'read_brief', name: 'Read the brief', xp: 10 },
  { id: 'submit_design', name: 'Submit your design', xp: 50 },
  { id: 'vote', name: 'Vote on designs (5+)', xp: 20 },
  { id: 'feedback', name: 'Give feedback (3+)', xp: 30 },
  { id: 'reflection', name: 'Write reflection', xp: 15 },
] as const;

// =============================================================================
// Main Function
// =============================================================================

/**
 * Get sprint task completion status for a user.
 *
 * Checks completion of 5 task types:
 * 1. read_brief - XP event exists with source_type='read_brief'
 * 2. submit_design - Submission exists with status='submitted'
 * 3. vote - At least 5 votes for the sprint
 * 4. feedback - At least 3 feedback records for the sprint
 * 5. reflection - XP event exists with source_type='reflection'
 *
 * @param sprintId - The ID of the sprint to check tasks for
 * @param userId - The ID of the user
 * @returns Promise resolving to SprintTaskCompletion object
 *
 * @example
 * ```typescript
 * const completion = await getSprintTaskCompletion('sprint-123', 'user-456');
 * console.log(`${completion.completedCount}/${completion.totalCount} tasks`);
 * console.log(`${completion.totalXP}/${completion.maxXP} XP earned`);
 * ```
 */
export async function getSprintTaskCompletion(
  sprintId: string,
  userId: string
): Promise<SprintTaskCompletion> {
  // Fetch all required data in parallel for performance
  const [
    readBriefCompleted,
    reflectionCompleted,
    hasSubmission,
    voteCount,
    feedbackCount,
  ] = await Promise.all([
    checkXPEventExists(sprintId, userId, 'read_brief'),
    checkXPEventExists(sprintId, userId, 'reflection'),
    checkSubmissionExists(sprintId, userId),
    getVoteCount(sprintId, userId),
    getFeedbackCount(sprintId, userId),
  ]);

  // Build task completion map
  const completionMap: Record<string, boolean> = {
    read_brief: readBriefCompleted,
    submit_design: hasSubmission,
    vote: voteCount >= 5,
    feedback: feedbackCount >= 3,
    reflection: reflectionCompleted,
  };

  // Map tasks with completion status
  const tasks: TaskItem[] = SPRINT_TASKS.map((task) => ({
    id: task.id,
    name: task.name,
    xp: task.xp,
    completed: completionMap[task.id] ?? false,
  }));

  // Calculate XP totals
  const maxXP = tasks.reduce((sum, task) => sum + task.xp, 0);
  const totalXP = tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.xp, 0);
  const completedCount = tasks.filter((task) => task.completed).length;

  return {
    tasks,
    totalXP,
    maxXP,
    completedCount,
    totalCount: tasks.length,
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Check if an XP event exists for a specific source type.
 *
 * @param sprintId - The sprint ID
 * @param userId - The user ID
 * @param sourceType - The XP source type to check
 * @returns True if an XP event exists
 */
async function checkXPEventExists(
  sprintId: string,
  userId: string,
  sourceType: XPSourceType
): Promise<boolean> {
  try {
    const result = await pb.collection(Collections.XP_EVENTS).getList<XPEvent>(1, 1, {
      filter: filterAnd([
        filterEquals('sprint_id', sprintId),
        filterEquals('user_id', userId),
        filterEquals('source_type', sourceType),
      ]),
      fields: 'id',
    });

    return result.totalItems > 0;
  } catch {
    return false;
  }
}

/**
 * Check if a submission exists with 'submitted' status.
 *
 * @param sprintId - The sprint ID
 * @param userId - The user ID
 * @returns True if a submitted submission exists
 */
async function checkSubmissionExists(
  sprintId: string,
  userId: string
): Promise<boolean> {
  try {
    const result = await pb.collection(Collections.SUBMISSIONS).getList<Submission>(1, 1, {
      filter: filterAnd([
        filterEquals('sprint_id', sprintId),
        filterEquals('user_id', userId),
        filterEquals('status', 'submitted'),
      ]),
      fields: 'id',
    });

    return result.totalItems > 0;
  } catch {
    return false;
  }
}

/**
 * Get the count of votes a user has cast for a sprint.
 *
 * @param sprintId - The sprint ID
 * @param userId - The user ID (as voter)
 * @returns Number of votes cast
 */
async function getVoteCount(
  sprintId: string,
  userId: string
): Promise<number> {
  try {
    const result = await pb.collection(Collections.VOTES).getList<Vote>(1, 1, {
      filter: filterAnd([
        filterEquals('sprint_id', sprintId),
        filterEquals('voter_id', userId),
      ]),
      fields: 'id',
    });

    return result.totalItems;
  } catch {
    return 0;
  }
}

/**
 * Get the count of feedback a user has given for a sprint.
 *
 * @param sprintId - The sprint ID
 * @param userId - The user ID (as author)
 * @returns Number of feedback records
 */
async function getFeedbackCount(
  sprintId: string,
  userId: string
): Promise<number> {
  try {
    const result = await pb.collection(Collections.FEEDBACK).getList<Feedback>(1, 1, {
      filter: filterAnd([
        filterEquals('sprint_id', sprintId),
        filterEquals('author_id', userId),
      ]),
      fields: 'id',
    });

    return result.totalItems;
  } catch {
    return 0;
  }
}

/**
 * Get default (empty) tasks for when user is not participating.
 *
 * @returns SprintTaskCompletion with all tasks incomplete
 */
export function getDefaultSprintTasks(): SprintTaskCompletion {
  const tasks: TaskItem[] = SPRINT_TASKS.map((task) => ({
    id: task.id,
    name: task.name,
    xp: task.xp,
    completed: false,
  }));

  const maxXP = tasks.reduce((sum, task) => sum + task.xp, 0);

  return {
    tasks,
    totalXP: 0,
    maxXP,
    completedCount: 0,
    totalCount: tasks.length,
  };
}
