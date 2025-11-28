/**
 * XP and Level Calculation Utilities
 *
 * Provides functions for calculating user levels, XP thresholds,
 * progress percentages, and user titles based on accumulated XP.
 *
 * @module lib/utils/xp-calculations
 */

/**
 * XP thresholds for each level.
 * Each index represents the minimum XP required to reach that level.
 *
 * Level 1: 0-99 XP
 * Level 2: 100-249 XP
 * Level 3: 250-499 XP
 * Level 4: 500-999 XP
 * Level 5: 1000-1999 XP
 * Level 6: 2000-4999 XP
 * Level 7: 5000-9999 XP
 * Level 8: 10000+ XP
 */
export const LEVEL_THRESHOLDS: readonly number[] = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  500, // Level 4
  1000, // Level 5
  2000, // Level 6
  5000, // Level 7
  10000, // Level 8
] as const;

/**
 * User titles based on level.
 * Maps level numbers (1-8) to descriptive designer titles.
 */
export const LEVEL_TITLES: Readonly<Record<number, string>> = {
  1: 'Design Novice',
  2: 'Creative Explorer',
  3: 'Interaction Alchemist',
  4: 'UX Specialist',
  5: 'Design Master',
  6: 'Visual Virtuoso',
  7: 'Design Architect',
  8: 'Design Legend',
} as const;

/**
 * Maximum level a user can achieve.
 */
export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

/**
 * Calculate user level from total XP.
 *
 * Determines the user's current level based on their accumulated XP.
 * Levels range from 1 (0-99 XP) to 8 (10000+ XP).
 *
 * @param totalXP - The user's total accumulated XP points
 * @returns The user's current level (1-8)
 *
 * @example
 * ```typescript
 * calculateLevel(0);    // Returns 1
 * calculateLevel(99);   // Returns 1
 * calculateLevel(100);  // Returns 2
 * calculateLevel(10000); // Returns 8
 * ```
 */
export function calculateLevel(totalXP: number): number {
  // Handle edge case of negative XP
  if (totalXP < 0) {
    return 1;
  }

  // Find the highest level threshold that the user has passed
  for (let level = LEVEL_THRESHOLDS.length - 1; level >= 0; level--) {
    if (totalXP >= LEVEL_THRESHOLDS[level]) {
      return level + 1; // Levels are 1-indexed
    }
  }

  // Default to level 1 (should never reach here with valid thresholds)
  return 1;
}

/**
 * Get XP threshold required to reach the next level.
 *
 * Returns the XP amount needed to advance from the current level
 * to the next level. For max level, returns the max level threshold.
 *
 * @param currentLevel - The user's current level (1-8)
 * @returns The XP threshold for the next level
 *
 * @example
 * ```typescript
 * getXPForNextLevel(1);  // Returns 100 (XP needed for level 2)
 * getXPForNextLevel(7);  // Returns 10000 (XP needed for level 8)
 * getXPForNextLevel(8);  // Returns 10000 (max level, no next)
 * ```
 */
export function getXPForNextLevel(currentLevel: number): number {
  // Handle edge cases
  if (currentLevel < 1) {
    return LEVEL_THRESHOLDS[0];
  }

  // If at max level, return the max threshold
  if (currentLevel >= MAX_LEVEL) {
    return LEVEL_THRESHOLDS[MAX_LEVEL - 1];
  }

  // Return threshold for next level (currentLevel is 1-indexed, array is 0-indexed)
  return LEVEL_THRESHOLDS[currentLevel];
}

/**
 * Get XP threshold required for the current level.
 *
 * Returns the minimum XP amount required to be at the current level.
 *
 * @param currentLevel - The user's current level (1-8)
 * @returns The XP threshold for the current level
 *
 * @example
 * ```typescript
 * getXPForCurrentLevel(1);  // Returns 0
 * getXPForCurrentLevel(2);  // Returns 100
 * getXPForCurrentLevel(8);  // Returns 10000
 * ```
 */
export function getXPForCurrentLevel(currentLevel: number): number {
  // Handle edge cases
  if (currentLevel < 1) {
    return 0;
  }

  if (currentLevel > MAX_LEVEL) {
    return LEVEL_THRESHOLDS[MAX_LEVEL - 1];
  }

  // Return threshold for current level (currentLevel is 1-indexed, array is 0-indexed)
  return LEVEL_THRESHOLDS[currentLevel - 1];
}

/**
 * Calculate progress percentage toward next level.
 *
 * Computes how far the user has progressed within their current level
 * toward reaching the next level, expressed as a percentage (0-100).
 *
 * @param totalXP - The user's total accumulated XP points
 * @param currentLevel - The user's current level (1-8)
 * @returns Progress percentage (0-100), capped at 100 for max level
 *
 * @example
 * ```typescript
 * calculateLevelProgress(0, 1);    // Returns 0 (just started level 1)
 * calculateLevelProgress(50, 1);   // Returns 50 (halfway through level 1)
 * calculateLevelProgress(99, 1);   // Returns 99 (almost level 2)
 * calculateLevelProgress(10000, 8); // Returns 100 (max level)
 * ```
 */
export function calculateLevelProgress(
  totalXP: number,
  currentLevel: number
): number {
  // Handle edge cases
  if (totalXP < 0 || currentLevel < 1) {
    return 0;
  }

  // At max level, return 100%
  if (currentLevel >= MAX_LEVEL) {
    return 100;
  }

  const currentLevelXP = getXPForCurrentLevel(currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;

  // Prevent division by zero
  if (xpNeededForLevel <= 0) {
    return 100;
  }

  const progress = Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100);

  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, progress));
}

/**
 * Get user title based on level.
 *
 * Returns a descriptive title for the user based on their current level.
 * Titles become more prestigious as the level increases.
 *
 * @param level - The user's current level (1-8)
 * @returns The user's title string
 *
 * @example
 * ```typescript
 * getUserTitle(1);  // Returns 'Design Novice'
 * getUserTitle(5);  // Returns 'Design Master'
 * getUserTitle(8);  // Returns 'Design Legend'
 * ```
 */
export function getUserTitle(level: number): string {
  // Handle edge cases
  if (level < 1) {
    return LEVEL_TITLES[1];
  }

  if (level > MAX_LEVEL) {
    return LEVEL_TITLES[MAX_LEVEL];
  }

  return LEVEL_TITLES[level] || 'Designer';
}

/**
 * Format XP progress display string.
 *
 * Creates a formatted string showing the user's current XP
 * and the XP needed for the next level in the format "current/target XP".
 *
 * @param totalXP - The user's total accumulated XP points
 * @param currentLevel - The user's current level (1-8)
 * @returns Formatted string like "720/1000 XP"
 *
 * @example
 * ```typescript
 * formatXPProgress(0, 1);      // Returns "0/100 XP"
 * formatXPProgress(720, 5);    // Returns "720/2000 XP"
 * formatXPProgress(10500, 8);  // Returns "10500/10000 XP"
 * ```
 */
export function formatXPProgress(totalXP: number, currentLevel: number): string {
  const nextLevelXP = getXPForNextLevel(currentLevel);
  return `${Math.max(0, totalXP)}/${nextLevelXP} XP`;
}
