/**
 * Skills API Service
 *
 * API service for skill-related operations.
 * Handles skill lookup, submission tagging, and user skill progress tracking.
 */

import pb from '@/lib/pocketbase';
import type {
  Skill,
  SubmissionSkillTag,
  UserSkillProgress,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { getCurrentUser } from '@/lib/api/auth';

// =============================================================================
// Types
// =============================================================================

/**
 * Skill with expanded submission count for top skills query.
 */
export interface SkillWithUsageCount extends Skill {
  usageCount: number;
}

/**
 * Submission skill tag with expanded skill relation.
 */
export interface SubmissionSkillTagWithSkill extends SubmissionSkillTag {
  expand?: {
    skill_id?: Skill;
  };
}

/**
 * User skill progress with expanded skill relation.
 */
export interface UserSkillProgressWithSkill extends UserSkillProgress {
  expand?: {
    skill_id?: Skill;
  };
}

// =============================================================================
// Skill Lookup Functions
// =============================================================================

/**
 * List all available skills.
 *
 * @returns Array of all skill records
 */
export async function listSkills(): Promise<Skill[]> {
  const result = await pb.collection(Collections.SKILLS).getFullList<Skill>({
    sort: 'name',
  });

  return result;
}

/**
 * Get a skill by its ID.
 *
 * @param id - The skill ID
 * @returns The skill record
 * @throws Error if skill not found
 */
export async function getSkill(id: string): Promise<Skill> {
  return pb.collection(Collections.SKILLS).getOne<Skill>(id);
}

/**
 * Get a skill by its slug.
 *
 * @param slug - The skill slug (e.g., 'visual-design', 'accessibility')
 * @returns The skill record
 * @throws Error if skill not found
 */
export async function getSkillBySlug(slug: string): Promise<Skill> {
  return pb.collection(Collections.SKILLS).getFirstListItem<Skill>(
    `slug = "${slug}"`
  );
}

// =============================================================================
// Submission Skill Tag Functions
// =============================================================================

/**
 * Tag a submission with a skill.
 *
 * @param submissionId - The submission ID to tag
 * @param skillId - The skill ID to apply
 * @param isPrimary - Whether this is the primary skill for the submission (default: false)
 * @returns The created submission skill tag record
 */
export async function tagSubmissionWithSkill(
  submissionId: string,
  skillId: string,
  isPrimary: boolean = false
): Promise<SubmissionSkillTag> {
  // If marking as primary, first unset any existing primary tag for this submission
  if (isPrimary) {
    const existingPrimary = await pb
      .collection(Collections.SUBMISSION_SKILL_TAGS)
      .getFullList<SubmissionSkillTag>({
        filter: `submission_id = "${submissionId}" && is_primary = true`,
      });

    // Unset is_primary on any existing primary tags
    for (const tag of existingPrimary) {
      await pb
        .collection(Collections.SUBMISSION_SKILL_TAGS)
        .update<SubmissionSkillTag>(tag.id, { is_primary: false });
    }
  }

  // Check if this skill tag already exists for the submission
  const existingTag = await pb
    .collection(Collections.SUBMISSION_SKILL_TAGS)
    .getFullList<SubmissionSkillTag>({
      filter: `submission_id = "${submissionId}" && skill_id = "${skillId}"`,
    });

  if (existingTag.length > 0) {
    // Update existing tag if isPrimary status needs to change
    if (existingTag[0].is_primary !== isPrimary) {
      return pb
        .collection(Collections.SUBMISSION_SKILL_TAGS)
        .update<SubmissionSkillTag>(existingTag[0].id, { is_primary: isPrimary });
    }
    return existingTag[0];
  }

  // Create new skill tag
  return pb.collection(Collections.SUBMISSION_SKILL_TAGS).create<SubmissionSkillTag>({
    submission_id: submissionId,
    skill_id: skillId,
    is_primary: isPrimary,
  });
}

/**
 * Remove a skill tag from a submission.
 *
 * @param submissionId - The submission ID
 * @param skillId - The skill ID to remove
 * @returns True if the tag was removed, false if it didn't exist
 */
export async function removeSkillTag(
  submissionId: string,
  skillId: string
): Promise<boolean> {
  const existingTags = await pb
    .collection(Collections.SUBMISSION_SKILL_TAGS)
    .getFullList<SubmissionSkillTag>({
      filter: `submission_id = "${submissionId}" && skill_id = "${skillId}"`,
    });

  if (existingTags.length === 0) {
    return false;
  }

  await pb.collection(Collections.SUBMISSION_SKILL_TAGS).delete(existingTags[0].id);
  return true;
}

/**
 * Get all skills tagged on a submission.
 *
 * @param submissionId - The submission ID
 * @returns Array of submission skill tags with expanded skill data
 */
export async function getSubmissionSkills(
  submissionId: string
): Promise<SubmissionSkillTagWithSkill[]> {
  return pb
    .collection(Collections.SUBMISSION_SKILL_TAGS)
    .getFullList<SubmissionSkillTagWithSkill>({
      filter: `submission_id = "${submissionId}"`,
      expand: 'skill_id',
      sort: '-is_primary,created',
    });
}

/**
 * Get the primary skill for a submission.
 *
 * @param submissionId - The submission ID
 * @returns The primary skill tag with expanded skill data, or null if none set
 */
export async function getPrimarySkill(
  submissionId: string
): Promise<SubmissionSkillTagWithSkill | null> {
  const tags = await pb
    .collection(Collections.SUBMISSION_SKILL_TAGS)
    .getFullList<SubmissionSkillTagWithSkill>({
      filter: `submission_id = "${submissionId}" && is_primary = true`,
      expand: 'skill_id',
    });

  return tags.length > 0 ? tags[0] : null;
}

// =============================================================================
// User Skill Progress Functions
// =============================================================================

/**
 * Get a user's progress across all skills.
 *
 * @param userId - The user ID (defaults to current user if not provided)
 * @returns Array of user skill progress records with expanded skill data
 * @throws Error if no userId provided and user is not authenticated
 */
export async function getUserSkillProgress(
  userId?: string
): Promise<UserSkillProgressWithSkill[]> {
  const targetUserId = userId ?? getCurrentUser()?.id;

  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  return pb
    .collection(Collections.USER_SKILL_PROGRESS)
    .getFullList<UserSkillProgressWithSkill>({
      filter: `user_id = "${targetUserId}"`,
      expand: 'skill_id',
      sort: '-xp',
    });
}

/**
 * Get a user's progress for a specific skill.
 *
 * @param skillId - The skill ID
 * @param userId - The user ID (defaults to current user if not provided)
 * @returns The user skill progress record with expanded skill data, or null if no progress exists
 * @throws Error if no userId provided and user is not authenticated
 */
export async function getUserSkillProgressForSkill(
  skillId: string,
  userId?: string
): Promise<UserSkillProgressWithSkill | null> {
  const targetUserId = userId ?? getCurrentUser()?.id;

  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  const progressRecords = await pb
    .collection(Collections.USER_SKILL_PROGRESS)
    .getFullList<UserSkillProgressWithSkill>({
      filter: `user_id = "${targetUserId}" && skill_id = "${skillId}"`,
      expand: 'skill_id',
    });

  return progressRecords.length > 0 ? progressRecords[0] : null;
}

// =============================================================================
// Skill Analytics Functions
// =============================================================================

/**
 * Get the most used skills across all submissions.
 *
 * This function aggregates submission skill tags to find the most commonly used skills.
 *
 * @param limit - Maximum number of skills to return (default: 10)
 * @returns Array of skills with usage counts, sorted by usage descending
 */
export async function getTopSkills(
  limit: number = 10
): Promise<SkillWithUsageCount[]> {
  // Get all skills first
  const skills = await listSkills();

  // Get all skill tags to count usage
  const allTags = await pb
    .collection(Collections.SUBMISSION_SKILL_TAGS)
    .getFullList<SubmissionSkillTag>();

  // Build a map of skill_id -> count
  const usageMap = new Map<string, number>();
  for (const tag of allTags) {
    const currentCount = usageMap.get(tag.skill_id) ?? 0;
    usageMap.set(tag.skill_id, currentCount + 1);
  }

  // Combine skills with their usage counts
  const skillsWithCounts: SkillWithUsageCount[] = skills.map((skill) => ({
    ...skill,
    usageCount: usageMap.get(skill.id) ?? 0,
  }));

  // Sort by usage count descending and limit
  return skillsWithCounts
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}
