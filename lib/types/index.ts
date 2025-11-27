/**
 * Type Exports
 *
 * Barrel export for all PocketBase types.
 *
 * @example
 * import type { User, Sprint, Submission } from '@/lib/types';
 * import { Collections } from '@/lib/types';
 */

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
