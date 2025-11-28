/**
 * Utility Functions Index
 *
 * Barrel export for all utility functions.
 */

export {
  escapeFilterValue,
  filterEquals,
  filterContains,
  filterIn,
  filterAnd,
  filterOr,
} from './filter';

export {
  formatCountdownTime,
  getCountdownUrgencyColor,
  formatDateShort,
  type UrgencyColor,
} from './date-formatting';

export {
  SKILL_LEVEL_THRESHOLDS,
  SKILL_TIPS,
  calculateSkillLevel,
  calculateSkillProgress,
  getSkillTip,
} from './skill-calculations';

export {
  LEVEL_THRESHOLDS,
  LEVEL_TITLES,
  MAX_LEVEL,
  calculateLevel,
  getXPForNextLevel,
  getXPForCurrentLevel,
  calculateLevelProgress,
  getUserTitle,
  formatXPProgress,
} from './xp-calculations';

export { cn } from './classnames';

export {
  calculateSprintStreak,
  calculateFeedbackStreak,
  getUserStreaks,
  type UserStreaks,
} from './streak-calculations';
