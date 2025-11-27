/**
 * PocketBase Type Definitions
 *
 * This file contains TypeScript interfaces for all 19 PocketBase collections.
 * Generated based on pb_schema.json and TR.md specifications.
 *
 * @see /job-queue/feature-pocketbase-schema/docs/TR.md
 */

// =============================================================================
// Base Types
// =============================================================================

/**
 * Base record type for all PocketBase collections.
 * All records have these fields automatically managed by PocketBase.
 */
export interface BaseRecord {
  id: string;
  created: string; // ISO 8601 datetime
  updated: string; // ISO 8601 datetime
}

// =============================================================================
// Auth Collection
// =============================================================================

/**
 * User (Auth Collection)
 *
 * Extends PocketBase's built-in auth collection with custom fields.
 */
export interface User extends BaseRecord {
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  avatar: string; // filename, access via pb.files.getUrl()
  role: UserRole;
}

export type UserRole = 'designer' | 'admin';

// =============================================================================
// Core Collections
// =============================================================================

/**
 * Challenge
 *
 * Represents a UI design challenge prompt. 100 challenges are seeded.
 */
export interface Challenge extends BaseRecord {
  challenge_number: number;
  title: string;
  brief: string; // HTML string from Editor field
}

/**
 * Sprint
 *
 * Represents a biweekly design sprint period.
 */
export interface Sprint extends BaseRecord {
  sprint_number: number;
  name: string;
  challenge_id: string; // relation ID to challenges
  status: SprintStatus;
  start_at: string | null; // ISO 8601 datetime
  end_at: string | null; // ISO 8601 datetime
  voting_end_at: string | null; // ISO 8601 datetime
  retro_day: string | null; // ISO 8601 date
  duration_days: number;
  started_by_id: string | null; // relation ID to users
  ended_by_id: string | null; // relation ID to users
}

export type SprintStatus =
  | 'scheduled'
  | 'active'
  | 'voting'
  | 'retro'
  | 'completed'
  | 'cancelled';

/**
 * Sprint Participant
 *
 * Junction table linking users to sprints they've joined.
 */
export interface SprintParticipant extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  user_id: string; // relation ID to users
  joined_at: string; // ISO 8601 datetime
}

// =============================================================================
// Submission Collections
// =============================================================================

/**
 * Submission
 *
 * A designer's submission for a sprint challenge.
 */
export interface Submission extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  user_id: string; // relation ID to users
  title: string;
  short_description: string | null;
  main_problem_focused: string | null; // HTML from Editor
  key_constraints: string | null; // HTML from Editor
  figma_url: string | null;
  status: SubmissionStatus;
  submitted_at: string | null; // ISO 8601 datetime
}

export type SubmissionStatus = 'draft' | 'submitted';

/**
 * Submission Asset
 *
 * File attachments for a submission (images, PDFs, zips).
 */
export interface SubmissionAsset extends BaseRecord {
  submission_id: string; // relation ID to submissions
  asset_type: AssetType;
  file: string; // filename
  thumbnail: string | null; // filename (images only)
  sort_order: number;
}

export type AssetType = 'image' | 'pdf' | 'zip';

// =============================================================================
// Skill Collections
// =============================================================================

/**
 * Skill
 *
 * Design skills that can be tagged on submissions. 20 skills are seeded.
 */
export interface Skill extends BaseRecord {
  name: string;
  slug: string;
  description: string | null;
}

/**
 * Submission Skill Tag
 *
 * Junction table linking submissions to skills.
 */
export interface SubmissionSkillTag extends BaseRecord {
  submission_id: string; // relation ID to submissions
  skill_id: string; // relation ID to skills
  is_primary: boolean;
}

/**
 * User Skill Progress
 *
 * Tracks a user's level and XP for each skill.
 */
export interface UserSkillProgress extends BaseRecord {
  user_id: string; // relation ID to users
  skill_id: string; // relation ID to skills
  sprint_id: string | null; // relation ID to sprints
  level: number;
  xp: number;
}

// =============================================================================
// Voting & Feedback Collections
// =============================================================================

/**
 * Vote
 *
 * A user's vote on a submission with 4 rating categories.
 */
export interface Vote extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  submission_id: string; // relation ID to submissions
  voter_id: string; // relation ID to users
  rating_clarity: number; // 1-5
  rating_usability: number; // 1-5
  rating_visual_craft: number; // 1-5
  rating_originality: number; // 1-5
}

/**
 * Feedback
 *
 * Structured feedback on a submission.
 */
export interface Feedback extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  submission_id: string; // relation ID to submissions
  author_id: string; // relation ID to users (hidden if is_anonymous)
  works_well: string | null; // HTML from Editor
  to_improve: string | null; // HTML from Editor
  question: string | null; // HTML from Editor
  is_anonymous: boolean;
}

/**
 * Feedback Helpful Mark
 *
 * Tracks which users found a piece of feedback helpful.
 */
export interface FeedbackHelpfulMark extends BaseRecord {
  feedback_id: string; // relation ID to feedback
  marked_by_id: string; // relation ID to users
}

// =============================================================================
// XP & Gamification Collections
// =============================================================================

/**
 * XP Event
 *
 * Ledger of XP-earning events for users.
 */
export interface XPEvent extends BaseRecord {
  user_id: string; // relation ID to users
  sprint_id: string; // relation ID to sprints
  source_type: XPSourceType;
  source_id: string | null; // ID of the source record
  amount: number;
}

export type XPSourceType =
  | 'read_brief'
  | 'submit_design'
  | 'vote'
  | 'feedback'
  | 'reflection'
  | 'helpful_feedback';

/**
 * User Sprint Task
 *
 * Checklist of tasks a user can complete during a sprint.
 */
export interface UserSprintTask extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  user_id: string; // relation ID to users
  task_type: SprintTaskType;
  completed_at: string | null; // ISO 8601 datetime
}

export type SprintTaskType =
  | 'read_brief'
  | 'upload_design'
  | 'vote_on_peers'
  | 'leave_feedback'
  | 'reflection';

/**
 * Badge
 *
 * Achievement badge definitions. 15 badges are seeded.
 */
export interface Badge extends BaseRecord {
  slug: string;
  name: string;
  description: string | null;
  icon_name: string | null;
}

/**
 * User Badge
 *
 * Badges awarded to users.
 */
export interface UserBadge extends BaseRecord {
  user_id: string; // relation ID to users
  badge_id: string; // relation ID to badges
  sprint_id: string | null; // relation ID to sprints (if awarded for a specific sprint)
  awarded_at: string; // ISO 8601 datetime
}

// =============================================================================
// Retrospective Collections
// =============================================================================

/**
 * Sprint Retro Summary
 *
 * AI-generated summary of a sprint's retrospective.
 */
export interface SprintRetroSummary extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  submissions_count: number;
  votes_count: number;
  comments_count: number;
  what_was_good: string | null; // HTML from Editor
  what_can_improve: string | null; // HTML from Editor
  what_was_asked: string | null; // HTML from Editor
}

/**
 * Sprint Retro Resource
 *
 * Educational resources shared during retrospective.
 */
export interface SprintRetroResource extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  title: string;
  url: string;
  resource_type: ResourceType;
}

export type ResourceType = 'article' | 'video' | 'documentation' | 'tool';

/**
 * Sprint Award
 *
 * Awards given to submissions/users during retrospective.
 */
export interface SprintAward extends BaseRecord {
  sprint_id: string; // relation ID to sprints
  award_type: AwardType;
  submission_id: string; // relation ID to submissions
  user_id: string; // relation ID to users
}

export type AwardType =
  | 'top_visual'
  | 'top_usability'
  | 'top_clarity'
  | 'top_originality'
  | 'feedback_mvp'
  | 'most_improved'
  | 'participation_champion';

// =============================================================================
// Collection Name Constants
// =============================================================================

/**
 * Collection names for use with PocketBase API calls.
 */
export const Collections = {
  USERS: 'users',
  CHALLENGES: 'challenges',
  SPRINTS: 'sprints',
  SPRINT_PARTICIPANTS: 'sprint_participants',
  SUBMISSIONS: 'submissions',
  SUBMISSION_ASSETS: 'submission_assets',
  SKILLS: 'skills',
  SUBMISSION_SKILL_TAGS: 'submission_skill_tags',
  USER_SKILL_PROGRESS: 'user_skill_progress',
  VOTES: 'votes',
  FEEDBACK: 'feedback',
  FEEDBACK_HELPFUL_MARKS: 'feedback_helpful_marks',
  XP_EVENTS: 'xp_events',
  USER_SPRINT_TASKS: 'user_sprint_tasks',
  BADGES: 'badges',
  USER_BADGES: 'user_badges',
  SPRINT_RETRO_SUMMARIES: 'sprint_retro_summaries',
  SPRINT_RETRO_RESOURCES: 'sprint_retro_resources',
  SPRINT_AWARDS: 'sprint_awards',
} as const;

export type CollectionName = (typeof Collections)[keyof typeof Collections];
