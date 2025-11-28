/**
 * Streak Calculation Utilities
 *
 * Functions for calculating user streaks based on sprint participation
 * and feedback activity. Streaks incentivize consistent engagement.
 *
 * @module lib/utils/streak-calculations
 */

import pb from '@/lib/pocketbase';
import type { SprintParticipant, Feedback, Sprint } from '@/lib/types';
import { Collections } from '@/lib/types';
import { filterEquals } from '@/lib/utils/filter';

// =============================================================================
// Types
// =============================================================================

/**
 * User streak data for display in profile card.
 */
export interface UserStreaks {
  /** Number of consecutive sprints participated in */
  sprintStreak: number;
  /** Number of consecutive sprints with at least 1 feedback given */
  feedbackStreak: number;
}

/**
 * Sprint participation with sprint number for streak calculation.
 */
interface ParticipationWithSprint extends SprintParticipant {
  expand?: {
    sprint_id?: Sprint;
  };
}

// =============================================================================
// Main Functions
// =============================================================================

/**
 * Calculate sprint participation streak for a user.
 *
 * Counts consecutive sprints (by sprint_number) that the user has participated in,
 * starting from the most recent sprint and going backwards.
 *
 * A streak breaks when:
 * - There's a gap in sprint_number (user missed a sprint)
 * - No more participation records exist
 *
 * @param userId - The ID of the user
 * @returns Promise resolving to the sprint streak count
 *
 * @example
 * ```typescript
 * const streak = await calculateSprintStreak('user-123');
 * console.log(`Sprint streak: ${streak} sprints`);
 * ```
 */
export async function calculateSprintStreak(userId: string): Promise<number> {
  try {
    // Get all participations with expanded sprint data, ordered by sprint_number desc
    const participations = await pb
      .collection(Collections.SPRINT_PARTICIPANTS)
      .getFullList<ParticipationWithSprint>({
        filter: filterEquals('user_id', userId),
        expand: 'sprint_id',
        sort: '-sprint_id.sprint_number',
      });

    if (participations.length === 0) {
      return 0;
    }

    // Extract sprint numbers from participations
    const sprintNumbers: number[] = participations
      .map((p) => p.expand?.sprint_id?.sprint_number)
      .filter((n): n is number => n !== undefined && n !== null)
      .sort((a, b) => b - a); // Sort descending

    if (sprintNumbers.length === 0) {
      return 0;
    }

    // Count consecutive sprint numbers starting from the highest
    let streak = 1;
    for (let i = 1; i < sprintNumbers.length; i++) {
      // Check if this sprint is exactly 1 less than the previous
      if (sprintNumbers[i - 1] - sprintNumbers[i] === 1) {
        streak++;
      } else {
        // Gap found, streak breaks
        break;
      }
    }

    return streak;
  } catch {
    return 0;
  }
}

/**
 * Calculate feedback streak for a user.
 *
 * Counts consecutive sprints (by sprint_number) where the user has given
 * at least one piece of feedback, starting from the most recent and going backwards.
 *
 * A streak breaks when:
 * - There's a sprint where the user gave no feedback
 * - There's a gap in sprint_number
 *
 * @param userId - The ID of the user
 * @returns Promise resolving to the feedback streak count
 *
 * @example
 * ```typescript
 * const streak = await calculateFeedbackStreak('user-123');
 * console.log(`Feedback streak: ${streak} sprints`);
 * ```
 */
export async function calculateFeedbackStreak(userId: string): Promise<number> {
  try {
    // Get all feedback records for this user with expanded sprint data
    const feedbackRecords = await pb
      .collection(Collections.FEEDBACK)
      .getFullList<Feedback & { expand?: { sprint_id?: Sprint } }>({
        filter: filterEquals('author_id', userId),
        expand: 'sprint_id',
        sort: '-sprint_id.sprint_number',
      });

    if (feedbackRecords.length === 0) {
      return 0;
    }

    // Get unique sprint numbers where user gave feedback
    const sprintNumbersSet = new Set<number>();
    for (const feedback of feedbackRecords) {
      const sprintNumber = feedback.expand?.sprint_id?.sprint_number;
      if (sprintNumber !== undefined && sprintNumber !== null) {
        sprintNumbersSet.add(sprintNumber);
      }
    }

    // Convert to sorted array (descending)
    const sprintNumbers = Array.from(sprintNumbersSet).sort((a, b) => b - a);

    if (sprintNumbers.length === 0) {
      return 0;
    }

    // Count consecutive sprint numbers
    let streak = 1;
    for (let i = 1; i < sprintNumbers.length; i++) {
      if (sprintNumbers[i - 1] - sprintNumbers[i] === 1) {
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
 * Get both streaks for a user in a single call.
 *
 * Fetches sprint and feedback streaks in parallel for efficiency.
 *
 * @param userId - The ID of the user
 * @returns Promise resolving to UserStreaks object
 *
 * @example
 * ```typescript
 * const streaks = await getUserStreaks('user-123');
 * console.log(`Sprint: ${streaks.sprintStreak}, Feedback: ${streaks.feedbackStreak}`);
 * ```
 */
export async function getUserStreaks(userId: string): Promise<UserStreaks> {
  const [sprintStreak, feedbackStreak] = await Promise.all([
    calculateSprintStreak(userId),
    calculateFeedbackStreak(userId),
  ]);

  return {
    sprintStreak,
    feedbackStreak,
  };
}
