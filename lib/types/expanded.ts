/**
 * Expanded Type Definitions
 *
 * Types for PocketBase records with expanded relations.
 * Use these when querying with the `expand` parameter.
 *
 * @example
 * const sprint = await pb.collection('sprints').getOne<SprintWithChallenge>(id, {
 *   expand: 'challenge_id'
 * });
 * console.log(sprint.expand?.challenge_id.title);
 */

import type {
  User,
  Challenge,
  Sprint,
  SprintParticipant,
  Submission,
  SubmissionAsset,
  Skill,
  Vote,
  Feedback,
  Badge,
  UserBadge,
  SprintAward,
} from './pocketbase';

// =============================================================================
// Sprint Expanded Types
// =============================================================================

/**
 * Sprint with expanded challenge relation.
 */
export interface SprintWithChallenge extends Sprint {
  expand?: {
    challenge_id: Challenge;
  };
}

/**
 * Sprint with all expandable relations.
 */
export interface SprintWithRelations extends Sprint {
  expand?: {
    challenge_id?: Challenge;
    started_by_id?: User;
    ended_by_id?: User;
  };
}

// =============================================================================
// Sprint Participant Expanded Types
// =============================================================================

/**
 * Sprint participant with expanded relations.
 */
export interface SprintParticipantWithRelations extends SprintParticipant {
  expand?: {
    sprint_id?: Sprint;
    user_id?: User;
  };
}

// =============================================================================
// Submission Expanded Types
// =============================================================================

/**
 * Submission with expanded relations.
 */
export interface SubmissionWithRelations extends Submission {
  expand?: {
    sprint_id?: Sprint;
    user_id?: User;
  };
}

/**
 * Submission with sprint and challenge expanded.
 */
export interface SubmissionWithSprintAndChallenge extends Submission {
  expand?: {
    sprint_id?: SprintWithChallenge;
    user_id?: User;
  };
}

/**
 * Submission asset with expanded submission.
 */
export interface SubmissionAssetWithSubmission extends SubmissionAsset {
  expand?: {
    submission_id?: Submission;
  };
}

// =============================================================================
// Vote Expanded Types
// =============================================================================

/**
 * Vote with expanded submission.
 */
export interface VoteWithSubmission extends Vote {
  expand?: {
    submission_id?: Submission;
  };
}

/**
 * Vote with all expandable relations.
 */
export interface VoteWithRelations extends Vote {
  expand?: {
    sprint_id?: Sprint;
    submission_id?: Submission;
    voter_id?: User;
  };
}

// =============================================================================
// Feedback Expanded Types
// =============================================================================

/**
 * Feedback with expanded author.
 * Note: author_id may be hidden if is_anonymous is true.
 */
export interface FeedbackWithAuthor extends Feedback {
  expand?: {
    author_id?: User;
  };
}

/**
 * Feedback with all expandable relations.
 */
export interface FeedbackWithRelations extends Feedback {
  expand?: {
    sprint_id?: Sprint;
    submission_id?: Submission;
    author_id?: User;
  };
}

// =============================================================================
// Badge Expanded Types
// =============================================================================

/**
 * User badge with expanded relations.
 */
export interface UserBadgeWithRelations extends UserBadge {
  expand?: {
    user_id?: User;
    badge_id?: Badge;
    sprint_id?: Sprint;
  };
}

// =============================================================================
// Award Expanded Types
// =============================================================================

/**
 * Sprint award with expanded relations.
 */
export interface SprintAwardWithRelations extends SprintAward {
  expand?: {
    sprint_id?: Sprint;
    submission_id?: Submission;
    user_id?: User;
  };
}

// =============================================================================
// Aggregation Types
// =============================================================================

/**
 * Aggregated vote statistics for a submission.
 * Computed by the application from individual votes.
 */
export interface VoteStats {
  submission_id: string;
  total_votes: number;
  avg_clarity: number;
  avg_usability: number;
  avg_visual_craft: number;
  avg_originality: number;
  avg_overall: number;
}

/**
 * User XP summary.
 * Computed by aggregating XP events.
 */
export interface UserXPSummary {
  user_id: string;
  total_xp: number;
  xp_by_source: Record<string, number>;
  xp_by_sprint: Record<string, number>;
}

/**
 * User skill summary with level and XP.
 */
export interface UserSkillSummary {
  user_id: string;
  skill_id: string;
  skill_name: string;
  skill_slug: string;
  level: number;
  xp: number;
}

/**
 * Sprint leaderboard entry.
 */
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  submission_id: string;
  submission_title: string;
  vote_stats: VoteStats;
}

// =============================================================================
// List Response Types
// =============================================================================

/**
 * PocketBase list response wrapper.
 */
export interface ListResult<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
