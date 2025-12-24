/**
 * Custom Hooks Index
 *
 * Barrel export for all custom React hooks.
 *
 * @module lib/hooks
 */

// Authentication hooks
export { useRegister } from './useRegister';
export type { RegisterInput, RegisterResult } from './useRegister';

export { useLogin } from './useLogin';
export type { LoginInput, LoginResult, LoginError } from './useLogin';

// Countdown timer hook
export { useCountdown, formatCountdownTime, getCountdownUrgencyColor } from './use-countdown';
export type {
  CountdownTime,
  UseCountdownResult,
  UrgencyColor,
} from './use-countdown';

// Sprint participation hooks
export { useJoinSprint, useJoinSprintSimple } from './use-join-sprint';
export type {
  JoinSprintInput,
  JoinSprintError,
  UseJoinSprintResult,
} from './use-join-sprint';

// User profile sidebar hook
export { useUserProfileSidebar, userProfileSidebarKeys } from './use-user-profile-sidebar';
export type {
  UseUserProfileSidebarResult,
  UseUserProfileSidebarOptions,
  UserProfileSidebarError,
} from './use-user-profile-sidebar';

// Challenge hub hook
export {
  useChallengeHub,
  challengeHubKeys,
  SPRINT_TASKS,
  MAX_SPRINT_TASK_XP,
} from './use-challenge-hub';
export type {
  UseChallengeHubResult,
  UseChallengeHubOptions,
  ChallengeHubError,
  ChallengeHubFullData,
  TaskDefinition,
  TaskWithStatus,
  SprintTaskProgress,
} from './use-challenge-hub';

// Last sprint retrospective hook
export {
  useLastSprintRetrospective,
  lastSprintRetrospectiveKeys,
} from './use-last-sprint-retrospective';
export type {
  UseLastSprintRetrospectiveResult,
  UseLastSprintRetrospectiveOptions,
  LastSprintRetrospectiveError,
} from './use-last-sprint-retrospective';

// Current sprint hook
export {
  useCurrentSprint,
  currentSprintKeys,
} from './use-current-sprint';
export type {
  UseCurrentSprintResult,
  UseCurrentSprintOptions,
  CurrentSprintError,
  CurrentSprintData,
} from './use-current-sprint';

// Start sprint hook
export {
  useStartSprint,
  startSprintKeys,
} from './use-start-sprint';
export type {
  UseStartSprintResult,
  UseStartSprintOptions,
  StartSprintError,
} from './use-start-sprint';

// Sprint history hook
export {
  useSprintHistory,
  sprintHistoryKeys,
} from './use-sprint-history';
export type {
  UseSprintHistoryResult,
  UseSprintHistoryOptions,
  SprintHistoryError,
} from './use-sprint-history';
