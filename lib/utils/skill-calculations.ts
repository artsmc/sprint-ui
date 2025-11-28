/**
 * Skill Level Calculation Utilities
 *
 * This module provides functions for calculating skill levels, progress,
 * and retrieving improvement tips for the Challenge Hub feature.
 */

/**
 * XP thresholds for skill levels.
 * Each index corresponds to a level (index 0 = Level 1 threshold, etc.)
 *
 * - Level 1: 0-99 XP
 * - Level 2: 100-249 XP
 * - Level 3: 250-499 XP
 * - Level 4: 500-999 XP
 * - Level 5: 1000-1999 XP
 * - Level 6: 2000+ XP
 */
export const SKILL_LEVEL_THRESHOLDS: readonly number[] = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  500, // Level 4
  1000, // Level 5
  2000, // Level 6
] as const;

/**
 * Improvement tips for each skill, keyed by skill slug.
 * These tips help users understand how to improve in specific design skills.
 */
export const SKILL_TIPS: Readonly<Record<string, string>> = {
  'visual-design': 'Experiment with color theory, typography, and visual hierarchy',
  'interaction-design': 'Study micro-interactions and animation principles',
  'ux-research': 'Conduct user interviews and usability testing',
  'accessibility': 'Design with keyboard navigation and screen readers in mind',
  'information-architecture': 'Practice card sorting and sitemap creation',
  'prototyping': 'Build interactive prototypes with Figma or Framer',
  'usability-testing': 'Run moderated and unmoderated user tests',
  'ui-patterns': 'Study common UI patterns and when to use them',
  'design-systems': 'Learn component-based design and tokens',
  'mobile-design': 'Focus on touch targets and mobile-first thinking',
} as const;

/**
 * Default tip returned when a skill slug is not found in SKILL_TIPS.
 */
const DEFAULT_SKILL_TIP = 'Keep practicing to improve this skill!';

/**
 * Calculates the skill level based on the amount of XP earned for that skill.
 *
 * @param skillXP - The amount of XP earned for the skill (must be >= 0)
 * @returns The skill level (1-6). Level 6 is the maximum.
 *
 * @example
 * ```typescript
 * calculateSkillLevel(0);    // Returns 1
 * calculateSkillLevel(50);   // Returns 1
 * calculateSkillLevel(100);  // Returns 2
 * calculateSkillLevel(2000); // Returns 6
 * calculateSkillLevel(5000); // Returns 6 (max level)
 * ```
 */
export function calculateSkillLevel(skillXP: number): number {
  // Handle edge case of negative XP
  if (skillXP < 0) {
    return 1;
  }

  // Find the highest level threshold that the XP meets or exceeds
  let level = 1;
  for (let i = 0; i < SKILL_LEVEL_THRESHOLDS.length; i++) {
    if (skillXP >= SKILL_LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  return level;
}

/**
 * Calculates the progress percentage within the current skill level.
 *
 * @param skillXP - The total XP earned for the skill
 * @param skillLevel - The current skill level (1-6)
 * @returns Progress percentage (0-100) within the current level.
 *          Returns 100 if at max level.
 *
 * @example
 * ```typescript
 * calculateSkillProgress(50, 1);   // Returns 50 (50% through level 1)
 * calculateSkillProgress(175, 2);  // Returns 50 (50% through level 2)
 * calculateSkillProgress(2000, 6); // Returns 100 (at max level)
 * ```
 */
export function calculateSkillProgress(skillXP: number, skillLevel: number): number {
  // Handle edge cases
  if (skillXP < 0) {
    return 0;
  }

  const maxLevel = SKILL_LEVEL_THRESHOLDS.length;

  // At max level, progress is considered complete
  if (skillLevel >= maxLevel) {
    return 100;
  }

  // Get XP thresholds for current and next level
  const currentLevelThreshold = SKILL_LEVEL_THRESHOLDS[skillLevel - 1] ?? 0;
  const nextLevelThreshold = SKILL_LEVEL_THRESHOLDS[skillLevel] ?? SKILL_LEVEL_THRESHOLDS[maxLevel - 1];

  // Calculate XP earned within current level
  const xpInCurrentLevel = skillXP - currentLevelThreshold;
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;

  // Avoid division by zero
  if (xpNeededForNextLevel <= 0) {
    return 100;
  }

  // Calculate percentage and clamp between 0 and 100
  const progress = Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
  return Math.max(0, Math.min(100, progress));
}

/**
 * Retrieves the improvement tip for a given skill.
 *
 * @param skillSlug - The slug identifier for the skill (e.g., 'visual-design')
 * @returns The improvement tip for the skill, or a default message if not found.
 *
 * @example
 * ```typescript
 * getSkillTip('visual-design');  // Returns 'Experiment with color theory...'
 * getSkillTip('unknown-skill');  // Returns 'Keep practicing to improve this skill!'
 * ```
 */
export function getSkillTip(skillSlug: string): string {
  return SKILL_TIPS[skillSlug] ?? DEFAULT_SKILL_TIP;
}
