/**
 * Validation Schemas Barrel Export
 *
 * Central export point for all Zod validation schemas.
 *
 * @example
 * import {
 *   RegisterSchema,
 *   LoginSchema,
 *   CreateSprintSchema,
 *   VoteRatingsSchema,
 * } from '@/lib/validation';
 */

// =============================================================================
// Auth Schemas
// =============================================================================

export {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
  RequestPasswordResetSchema,
  ConfirmPasswordResetSchema,
  type RegisterInput,
  type LoginInput,
  type UpdateProfileInput,
  type RequestPasswordResetInput,
  type ConfirmPasswordResetInput,
} from './auth';

// =============================================================================
// Challenge Schemas
// =============================================================================

export {
  CreateChallengeSchema,
  UpdateChallengeSchema,
  SearchChallengeQuerySchema,
  ChallengeListQuerySchema,
  type CreateChallengeInput,
  type UpdateChallengeInput,
  type SearchChallengeQuery,
  type ChallengeListQuery,
} from './challenges';

// =============================================================================
// Sprint Schemas
// =============================================================================

export {
  SprintStatusEnum,
  CreateSprintSchema,
  UpdateSprintSchema,
  SprintQuerySchema,
  SprintExpandQuerySchema,
  type SprintStatusValue,
  type CreateSprintInput,
  type UpdateSprintInput,
  type SprintQuery,
  type SprintExpandQuery,
} from './sprints';

// =============================================================================
// Submission Schemas
// =============================================================================

export {
  SubmissionStatusEnum,
  CreateSubmissionSchema,
  UpdateSubmissionSchema,
  SubmissionQuerySchema,
  SubmissionExpandQuerySchema,
  type SubmissionStatusValue,
  type CreateSubmissionInput,
  type UpdateSubmissionInput,
  type SubmissionQuery,
  type SubmissionExpandQuery,
} from './submissions';

// =============================================================================
// Vote Schemas
// =============================================================================

export {
  VoteRatingsSchema,
  CreateVoteSchema,
  UpdateVoteSchema,
  VoteQuerySchema,
  type VoteRatings,
  type CreateVoteInput,
  type UpdateVoteInput,
  type VoteQuery,
} from './votes';

// =============================================================================
// Feedback Schemas
// =============================================================================

export {
  CreateFeedbackSchema,
  UpdateFeedbackSchema,
  FeedbackQuerySchema,
  FeedbackExpandQuerySchema,
  type CreateFeedbackInput,
  type UpdateFeedbackInput,
  type FeedbackQuery,
  type FeedbackExpandQuery,
} from './feedback';
