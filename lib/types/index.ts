/**
 * Type Exports
 *
 * Barrel export for all PocketBase types.
 *
 * @example
 * import type { User, Sprint, Submission } from '@/lib/types';
 * import { Collections } from '@/lib/types';
 */

import type { User } from './pocketbase';

// Base types and collection interfaces
export type {
  BaseRecord,
  User,
  UserRole,
  Challenge,
  Sprint,
  SprintStatus,
  SprintParticipant,
  Submission,
  SubmissionStatus,
  SubmissionAsset,
  AssetType,
  Skill,
  SubmissionSkillTag,
  UserSkillProgress,
  Vote,
  Feedback,
  FeedbackHelpfulMark,
  XPEvent,
  XPSourceType,
  UserSprintTask,
  SprintTaskType,
  Badge,
  UserBadge,
  SprintRetroSummary,
  SprintRetroResource,
  ResourceType,
  SprintAward,
  AwardType,
  CollectionName,
} from './pocketbase';

// Collection name constants
export { Collections } from './pocketbase';

// Expanded types with relations
export type {
  SprintWithChallenge,
  SprintWithRelations,
  SprintParticipantWithRelations,
  SubmissionWithRelations,
  SubmissionWithSprintAndChallenge,
  SubmissionAssetWithSubmission,
  VoteWithSubmission,
  VoteWithRelations,
  FeedbackWithAuthor,
  FeedbackWithRelations,
  UserBadgeWithRelations,
  SprintAwardWithRelations,
  VoteStats,
  UserXPSummary,
  UserSkillSummary,
  LeaderboardEntry,
  ListResult,
} from './expanded';

/**
 * Sprint statistics for monitoring sprint participation and progress.
 * Used to display real-time sprint metrics in the Current Sprint Status component.
 */
export interface SprintStatistics {
  /** Number of participants who have submitted their designs */
  submissionsCount: number;
  /** Number of participants who haven't submitted yet */
  yetToSubmitCount: number;
  /** Percentage of participants who have submitted (0-100) */
  participationRate: number;
  /** Total number of participants in the sprint */
  totalParticipants: number;
}

/**
 * Metadata about the last update to a sprint.
 * Tracks who last modified the sprint and when for audit purposes.
 */
export interface SprintLastUpdate {
  /** User who last updated the sprint (started or ended it) */
  updatedBy: User | null;
  /** ISO 8601 timestamp of the last update */
  updatedAt: string;
}
