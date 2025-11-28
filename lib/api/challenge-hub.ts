/**
 * Challenge Hub Data Service
 *
 * Aggregates data from multiple API services for the Challenge Hub page.
 * Provides optimized parallel fetching and composed data structures.
 *
 * @module lib/api/challenge-hub
 *
 * @swagger
 * tags:
 *   - name: Challenge Hub
 *     description: Aggregated data endpoints for the Challenge Hub page
 */

import pb from '@/lib/pocketbase';
import { getActiveSprint } from '@/lib/api/sprints';
import { getUserXPTotal } from '@/lib/api/xp';
import { getUserBadgesWithDetails } from '@/lib/api/badges';
import { getUserSkillProgress, type UserSkillProgressWithSkill } from '@/lib/api/skills';
import { getSprintAwardsWithDetails, getRetroSummary } from '@/lib/api/retrospectives';
import { isUserParticipant } from '@/lib/api/participants';
import { calculateLevel } from '@/lib/utils';
import type {
  Sprint,
  SprintRetroSummary,
  UserBadgeWithRelations,
  SprintAwardWithRelations,
} from '@/lib/types';
import { Collections } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Aggregated data structure for the Challenge Hub page.
 *
 * @swagger
 * components:
 *   schemas:
 *     ChallengeHubData:
 *       type: object
 *       description: Complete data package for Challenge Hub page rendering
 *       properties:
 *         activeSprint:
 *           $ref: '#/components/schemas/Sprint'
 *           nullable: true
 *           description: Currently active sprint, or null if none
 *         userXPTotal:
 *           type: integer
 *           description: User's total XP across all sprints
 *           example: 1250
 *         userLevel:
 *           type: integer
 *           description: Calculated user level based on total XP
 *           example: 5
 *         userBadges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserBadgeWithRelations'
 *           description: User's earned badges with badge details
 *         userSkillProgress:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserSkillProgressWithSkill'
 *           description: User's skill progress with skill details
 *         sprintAwards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SprintAwardWithRelations'
 *           description: Awards from current or last completed sprint
 *         retroSummary:
 *           $ref: '#/components/schemas/SprintRetroSummary'
 *           nullable: true
 *           description: Retrospective summary from last completed sprint
 *         isParticipant:
 *           type: boolean
 *           description: Whether the user is participating in the active sprint
 */
export interface ChallengeHubData {
  /** Currently active sprint, or null if none exists */
  activeSprint: Sprint | null;
  /** User's total XP across all sprints */
  userXPTotal: number;
  /** Calculated user level based on total XP */
  userLevel: number;
  /** User's earned badges with badge details expanded */
  userBadges: UserBadgeWithRelations[];
  /** User's skill progress with skill details expanded */
  userSkillProgress: UserSkillProgressWithSkill[];
  /** Awards from current or last completed sprint */
  sprintAwards: SprintAwardWithRelations[];
  /** Retrospective summary from last completed sprint, or null */
  retroSummary: SprintRetroSummary | null;
  /** Whether the user is participating in the active sprint */
  isParticipant: boolean;
}

/**
 * Options for customizing Challenge Hub data fetching.
 *
 * @swagger
 * components:
 *   schemas:
 *     ChallengeHubOptions:
 *       type: object
 *       properties:
 *         includeRetro:
 *           type: boolean
 *           default: true
 *           description: Whether to fetch retrospective summary
 *         includeAwards:
 *           type: boolean
 *           default: true
 *           description: Whether to fetch sprint awards
 *         skillLimit:
 *           type: integer
 *           default: 10
 *           description: Maximum number of skills to return
 */
export interface ChallengeHubOptions {
  /** Whether to fetch retrospective summary (default: true) */
  includeRetro?: boolean;
  /** Whether to fetch sprint awards (default: true) */
  includeAwards?: boolean;
  /** Maximum number of skills to return (default: 10) */
  skillLimit?: number;
}

// =============================================================================
// Main Data Fetching Function
// =============================================================================

/**
 * Fetch all aggregated data needed for the Challenge Hub page.
 *
 * Optimizes performance by executing independent queries in parallel
 * using Promise.all(), then fetching dependent data sequentially.
 *
 * @swagger
 * /api/challenge-hub:
 *   get:
 *     summary: Get Challenge Hub data
 *     description: |
 *       Fetches all data required for the Challenge Hub page in an optimized manner.
 *       Uses parallel queries for independent data and sequential queries for dependent data.
 *
 *       **Data Fetched in Parallel:**
 *       - Active sprint
 *       - User's total XP
 *       - User's badges
 *       - User's skill progress
 *
 *       **Data Fetched Sequentially (depends on active sprint):**
 *       - User participation status
 *       - Sprint awards
 *       - Retrospective summary
 *     tags:
 *       - Challenge Hub
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch data for
 *       - name: includeRetro
 *         in: query
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to include retrospective summary
 *       - name: includeAwards
 *         in: query
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to include sprint awards
 *     responses:
 *       200:
 *         description: Successfully retrieved Challenge Hub data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengeHubData'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 * @param userId - The ID of the user to fetch data for
 * @param options - Optional configuration for data fetching
 * @returns Promise resolving to ChallengeHubData object
 * @throws Error if user ID is invalid or data fetching fails
 *
 * @example
 * ```typescript
 * // Basic usage
 * const data = await getChallengeHubData('user-123');
 *
 * // With options
 * const data = await getChallengeHubData('user-123', {
 *   includeRetro: false,
 *   skillLimit: 5
 * });
 * ```
 */
export async function getChallengeHubData(
  userId: string,
  options: ChallengeHubOptions = {}
): Promise<ChallengeHubData> {
  const {
    includeRetro = true,
    includeAwards = true,
  } = options;

  // ==========================================================================
  // Phase 1: Parallel fetch for independent data
  // ==========================================================================
  const [
    activeSprint,
    userXPTotal,
    userBadges,
    userSkillProgress,
  ] = await Promise.all([
    getActiveSprint().catch(() => null),
    getUserXPTotal(userId),
    getUserBadgesWithDetails(userId),
    getUserSkillProgress(userId),
  ]);

  // ==========================================================================
  // Phase 2: Dependent queries (need activeSprint result)
  // ==========================================================================

  // Check if user is participating in active sprint
  const isParticipant = activeSprint
    ? await isUserParticipant(activeSprint.id, userId)
    : false;

  // Fetch sprint awards from active sprint or last completed
  let sprintAwards: SprintAwardWithRelations[] = [];
  if (includeAwards) {
    if (activeSprint) {
      sprintAwards = await getSprintAwardsWithDetails(activeSprint.id);
    } else {
      sprintAwards = await getLastCompletedSprintAwards();
    }
  }

  // Fetch retrospective summary from last completed sprint
  let retroSummary: SprintRetroSummary | null = null;
  if (includeRetro) {
    retroSummary = await getLastCompletedSprintRetro();
  }

  // ==========================================================================
  // Phase 3: Calculate derived values
  // ==========================================================================
  const userLevel = calculateLevel(userXPTotal);

  return {
    activeSprint,
    userXPTotal,
    userLevel,
    userBadges,
    userSkillProgress,
    sprintAwards,
    retroSummary,
    isParticipant,
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get awards from the last completed sprint.
 *
 * Finds the most recently completed sprint and returns its awards
 * with full relation expansion (user, submission details).
 *
 * @swagger
 * /api/challenge-hub/last-completed-awards:
 *   get:
 *     summary: Get awards from last completed sprint
 *     description: |
 *       Retrieves awards from the most recently completed sprint.
 *       Returns an empty array if no completed sprints exist.
 *     tags:
 *       - Challenge Hub
 *     responses:
 *       200:
 *         description: Successfully retrieved awards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SprintAwardWithRelations'
 *
 * @returns Promise resolving to array of SprintAwardWithRelations
 *
 * @example
 * ```typescript
 * const awards = await getLastCompletedSprintAwards();
 * if (awards.length > 0) {
 *   console.log(`Found ${awards.length} awards from last sprint`);
 * }
 * ```
 */
export async function getLastCompletedSprintAwards(): Promise<SprintAwardWithRelations[]> {
  try {
    // Find the most recently completed sprint
    const lastSprint = await pb
      .collection(Collections.SPRINTS)
      .getFirstListItem<Sprint>("status='completed'", {
        sort: '-created',
      });

    if (!lastSprint) {
      return [];
    }

    // Fetch awards for that sprint
    return await getSprintAwardsWithDetails(lastSprint.id);
  } catch {
    // No completed sprints found
    return [];
  }
}

/**
 * Get retrospective summary from the last completed sprint.
 *
 * Finds the most recently completed sprint and returns its
 * retrospective summary if one exists.
 *
 * @swagger
 * /api/challenge-hub/last-completed-retro:
 *   get:
 *     summary: Get retrospective summary from last completed sprint
 *     description: |
 *       Retrieves the retrospective summary from the most recently completed sprint.
 *       Returns null if no completed sprints exist or if the sprint has no retro summary.
 *     tags:
 *       - Challenge Hub
 *     responses:
 *       200:
 *         description: Successfully retrieved retrospective summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SprintRetroSummary'
 *               nullable: true
 *
 * @returns Promise resolving to SprintRetroSummary or null
 *
 * @example
 * ```typescript
 * const retro = await getLastCompletedSprintRetro();
 * if (retro) {
 *   console.log(`Retro summary: ${retro.summary}`);
 * }
 * ```
 */
export async function getLastCompletedSprintRetro(): Promise<SprintRetroSummary | null> {
  try {
    // Find the most recently completed sprint
    const lastSprint = await pb
      .collection(Collections.SPRINTS)
      .getFirstListItem<Sprint>("status='completed'", {
        sort: '-created',
      });

    if (!lastSprint) {
      return null;
    }

    // Fetch retro summary for that sprint
    return await getRetroSummary(lastSprint.id);
  } catch {
    // No completed sprints or no retro summary found
    return null;
  }
}

/**
 * Get the sprint that should be displayed in the Challenge Hub.
 *
 * Returns the active sprint if one exists, otherwise returns
 * the most recently completed sprint for displaying past results.
 *
 * @swagger
 * /api/challenge-hub/display-sprint:
 *   get:
 *     summary: Get the sprint to display in Challenge Hub
 *     description: |
 *       Returns the active sprint if one exists, otherwise returns the most
 *       recently completed sprint. This is useful for determining what sprint
 *       data to show when there's no active challenge.
 *     tags:
 *       - Challenge Hub
 *     responses:
 *       200:
 *         description: Successfully retrieved display sprint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *               nullable: true
 *
 * @returns Promise resolving to Sprint or null
 *
 * @example
 * ```typescript
 * const sprint = await getDisplaySprint();
 * if (sprint) {
 *   console.log(`Displaying sprint: ${sprint.id}`);
 * } else {
 *   console.log('No sprints to display');
 * }
 * ```
 */
export async function getDisplaySprint(): Promise<Sprint | null> {
  // First, try to get the active sprint
  const activeSprint = await getActiveSprint().catch(() => null);

  if (activeSprint) {
    return activeSprint;
  }

  // Fall back to last completed sprint
  try {
    return await pb
      .collection(Collections.SPRINTS)
      .getFirstListItem<Sprint>("status='completed'", {
        sort: '-created',
      });
  } catch {
    return null;
  }
}

/**
 * Check if the Challenge Hub has any data to display.
 *
 * Returns true if there's either an active sprint or a completed
 * sprint with retrospective data.
 *
 * @swagger
 * /api/challenge-hub/has-content:
 *   get:
 *     summary: Check if Challenge Hub has displayable content
 *     description: |
 *       Returns true if there's an active sprint or any completed sprints.
 *       Useful for determining whether to show the Challenge Hub or a
 *       "no content" placeholder.
 *     tags:
 *       - Challenge Hub
 *     responses:
 *       200:
 *         description: Content availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasContent:
 *                   type: boolean
 *                 hasActiveSprint:
 *                   type: boolean
 *                 hasCompletedSprints:
 *                   type: boolean
 *
 * @returns Promise resolving to content availability object
 *
 * @example
 * ```typescript
 * const { hasContent, hasActiveSprint } = await hasDisplayableContent();
 * if (!hasContent) {
 *   return <NoContentPlaceholder />;
 * }
 * ```
 */
export async function hasDisplayableContent(): Promise<{
  hasContent: boolean;
  hasActiveSprint: boolean;
  hasCompletedSprints: boolean;
}> {
  const [activeSprint, completedCount] = await Promise.all([
    getActiveSprint().catch(() => null),
    pb.collection(Collections.SPRINTS)
      .getList<Sprint>(1, 1, { filter: "status='completed'" })
      .then((result) => result.totalItems)
      .catch(() => 0),
  ]);

  return {
    hasContent: activeSprint !== null || completedCount > 0,
    hasActiveSprint: activeSprint !== null,
    hasCompletedSprints: completedCount > 0,
  };
}
