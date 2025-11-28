/**
 * User Profile Sidebar Data Service
 *
 * API service for fetching aggregated user profile data displayed in the
 * Challenge Hub sidebar. Includes user info, XP/level, streaks, badges,
 * and sprint highlights.
 *
 * @module lib/api/user-profile-sidebar
 */

import pb from '@/lib/pocketbase';
import { getUserXPTotal } from '@/lib/api/xp';
import { getUserBadgesWithDetails } from '@/lib/api/badges';
import { getSprintAwardsWithDetails } from '@/lib/api/retrospectives';
import { getActiveSprint } from '@/lib/api/sprints';
import { calculateLevel } from '@/lib/utils';
import type {
  User,
  Sprint,
  UserBadgeWithRelations,
  SprintAwardWithRelations,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { filterEquals, filterAnd } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * User streak data for profile display.
 */
export interface UserStreakData {
  /** Number of consecutive sprints participated in */
  sprintStreak: number;
  /** Number of consecutive sprints with feedback given */
  feedbackStreak: number;
}

/**
 * Highlight tab types for the sidebar.
 */
export type HighlightTabType = 'recognition' | 'participation' | 'skills';

/**
 * Complete user profile sidebar data.
 */
export interface UserProfileSidebarData {
  /** User profile information */
  user: User;
  /** User's total XP */
  xpTotal: number;
  /** User's current level (1-8) */
  level: number;
  /** User's streak data */
  streaks: UserStreakData;
  /** User's earned badges with details */
  badges: UserBadgeWithRelations[];
  /** Sprint awards (for recognition highlights) */
  sprintAwards: SprintAwardWithRelations[];
  /** Active sprint info */
  activeSprint: Sprint | null;
}

// =============================================================================
// Streak Calculation Functions
// =============================================================================

/**
 * Calculate a user's sprint participation streak.
 *
 * Counts consecutive sprints where the user participated,
 * starting from the most recent completed sprint.
 *
 * @param userId - The user ID to calculate streak for
 * @returns The number of consecutive sprints participated
 */
export async function calculateSprintStreak(userId: string): Promise<number> {
  try {
    // Get all sprints the user participated in, ordered by sprint number descending
    const participations = await pb
      .collection(Collections.SPRINT_PARTICIPANTS)
      .getFullList({
        filter: filterEquals('user_id', userId),
        expand: 'sprint_id',
        sort: '-created',
      });

    if (participations.length === 0) {
      return 0;
    }

    // Get all completed sprints in order
    const completedSprints = await pb
      .collection(Collections.SPRINTS)
      .getFullList<Sprint>({
        filter: "status = 'completed' || status = 'active' || status = 'voting' || status = 'retro'",
        sort: '-sprint_number',
      });

    if (completedSprints.length === 0) {
      return participations.length > 0 ? 1 : 0;
    }

    // Create a set of sprint IDs the user participated in
    const participatedSprintIds = new Set(
      participations.map((p) => p.sprint_id)
    );

    // Count consecutive sprints from the most recent
    let streak = 0;
    for (const sprint of completedSprints) {
      if (participatedSprintIds.has(sprint.id)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch {
    return 0;
  }
}

/**
 * Calculate a user's feedback streak.
 *
 * Counts consecutive sprints where the user provided feedback,
 * starting from the most recent completed sprint.
 *
 * @param userId - The user ID to calculate streak for
 * @returns The number of consecutive sprints with feedback given
 */
export async function calculateFeedbackStreak(userId: string): Promise<number> {
  try {
    // Get all feedback the user has given
    const feedbackRecords = await pb
      .collection(Collections.FEEDBACK)
      .getFullList({
        filter: filterEquals('author_id', userId),
        sort: '-created',
      });

    if (feedbackRecords.length === 0) {
      return 0;
    }

    // Get sprint IDs where user gave feedback
    const feedbackSprintIds = new Set(
      feedbackRecords.map((f) => f.sprint_id)
    );

    // Get all completed sprints in order
    const completedSprints = await pb
      .collection(Collections.SPRINTS)
      .getFullList<Sprint>({
        filter: "status = 'completed' || status = 'active' || status = 'voting' || status = 'retro'",
        sort: '-sprint_number',
      });

    if (completedSprints.length === 0) {
      return feedbackSprintIds.size > 0 ? 1 : 0;
    }

    // Count consecutive sprints from the most recent
    let streak = 0;
    for (const sprint of completedSprints) {
      if (feedbackSprintIds.has(sprint.id)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch {
    return 0;
  }
}

/**
 * Get user streak data (sprint and feedback streaks).
 *
 * @param userId - The user ID to get streaks for
 * @returns UserStreakData with both streak counts
 */
export async function getUserStreaks(userId: string): Promise<UserStreakData> {
  const [sprintStreak, feedbackStreak] = await Promise.all([
    calculateSprintStreak(userId),
    calculateFeedbackStreak(userId),
  ]);

  return {
    sprintStreak,
    feedbackStreak,
  };
}

// =============================================================================
// Main Data Fetching Function
// =============================================================================

/**
 * Fetch all data needed for the user profile sidebar.
 *
 * Optimizes performance by executing independent queries in parallel.
 *
 * @param userId - The user ID to fetch data for
 * @returns Promise resolving to UserProfileSidebarData
 * @throws Error if user not found
 *
 * @example
 * ```typescript
 * const sidebarData = await getUserProfileSidebarData('user-123');
 * console.log(`${sidebarData.user.name} is level ${sidebarData.level}`);
 * ```
 */
export async function getUserProfileSidebarData(
  userId: string
): Promise<UserProfileSidebarData> {
  // Phase 1: Parallel fetch for independent data
  const [user, xpTotal, badges, streaks, activeSprint] = await Promise.all([
    pb.collection(Collections.USERS).getOne<User>(userId),
    getUserXPTotal(userId),
    getUserBadgesWithDetails(userId),
    getUserStreaks(userId),
    getActiveSprint().catch(() => null),
  ]);

  // Phase 2: Fetch sprint awards (depends on active sprint or last completed)
  let sprintAwards: SprintAwardWithRelations[] = [];
  if (activeSprint) {
    sprintAwards = await getSprintAwardsWithDetails(activeSprint.id);
  } else {
    // Try to get awards from the last completed sprint
    try {
      const lastSprint = await pb
        .collection(Collections.SPRINTS)
        .getFirstListItem<Sprint>("status='completed'", {
          sort: '-created',
        });
      if (lastSprint) {
        sprintAwards = await getSprintAwardsWithDetails(lastSprint.id);
      }
    } catch {
      // No completed sprints
    }
  }

  // Calculate level from XP
  const level = calculateLevel(xpTotal);

  return {
    user,
    xpTotal,
    level,
    streaks,
    badges,
    sprintAwards,
    activeSprint,
  };
}
