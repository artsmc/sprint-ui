/**
 * Challenge Hub Components
 *
 * Barrel export for all Challenge Hub client components.
 *
 * @module app/challenge-hub/components
 *
 * @example
 * ```tsx
 * import {
 *   CountdownTimer,
 *   JoinSprintButton,
 *   ActiveChallengeCard,
 *   UserProfileCard,
 * } from '@/app/challenge-hub/components';
 * ```
 */

// =============================================================================
// Timer and Action Components
// =============================================================================

export { CountdownTimer } from './countdown-timer';
export type { CountdownTimerProps } from './countdown-timer';

export { JoinSprintButton } from './join-sprint-button';
export type { JoinSprintButtonProps } from './join-sprint-button';

// =============================================================================
// Progress Tracking Components
// =============================================================================

export { SprintProgressTracker } from './sprint-progress-tracker';
export type {
  SprintProgressTrackerProps,
  TaskItem,
} from './sprint-progress-tracker';

// =============================================================================
// Card Components
// =============================================================================

export { ActiveChallengeCard } from './active-challenge-card';
export type { ActiveChallengeCardProps } from './active-challenge-card';

export { UserProfileCard } from './user-profile-card';
export type {
  UserProfileCardProps,
  UserStreaks,
} from './user-profile-card';

// =============================================================================
// Section Components
// =============================================================================

export { SkillGrowthSection } from './skill-growth-section';
export type { SkillGrowthSectionProps } from './skill-growth-section';

export { SprintHighlightsSection } from './sprint-highlights-section';
export type { SprintHighlightsSectionProps } from './sprint-highlights-section';

export { RetrospectiveSummary } from './retrospective-summary';
export type { RetrospectiveSummaryProps } from './retrospective-summary';

// =============================================================================
// Header Components
// =============================================================================

export { ChallengeHubHeader } from './challenge-hub-header';
export type { ChallengeHubHeaderProps } from './challenge-hub-header';
