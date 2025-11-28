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
