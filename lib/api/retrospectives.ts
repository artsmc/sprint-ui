/**
 * Retrospectives Service
 *
 * API service for retrospective-related operations.
 * Handles retro summaries, resources, and sprint awards.
 */

import pb from '@/lib/pocketbase';
import type {
  SprintRetroSummary,
  SprintRetroResource,
  ResourceType,
  SprintAward,
  AwardType,
  SprintAwardWithRelations,
  ListResult,
} from '@/lib/types';
import { Collections } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Data required to create a retro summary.
 */
export interface CreateRetroSummaryData {
  submissions_count: number;
  votes_count: number;
  comments_count: number;
  what_was_good?: string;
  what_can_improve?: string;
  what_was_asked?: string;
}

/**
 * Data for updating a retro summary.
 */
export interface UpdateRetroSummaryData {
  submissions_count?: number;
  votes_count?: number;
  comments_count?: number;
  what_was_good?: string;
  what_can_improve?: string;
  what_was_asked?: string;
}

/**
 * Data required to create a retro resource.
 */
export interface CreateRetroResourceData {
  title: string;
  url: string;
  resource_type: ResourceType;
}

// =============================================================================
// Retro Summary Functions
// =============================================================================

/**
 * Create a retrospective summary for a sprint.
 * Admin-only operation.
 *
 * @param sprintId - The sprint ID to create the summary for
 * @param data - Summary data including counts and text content
 * @returns The created retro summary record
 */
export async function createRetroSummary(
  sprintId: string,
  data: CreateRetroSummaryData
): Promise<SprintRetroSummary> {
  const summaryData = {
    sprint_id: sprintId,
    submissions_count: data.submissions_count,
    votes_count: data.votes_count,
    comments_count: data.comments_count,
    what_was_good: data.what_was_good ?? null,
    what_can_improve: data.what_can_improve ?? null,
    what_was_asked: data.what_was_asked ?? null,
  };

  return pb
    .collection(Collections.SPRINT_RETRO_SUMMARIES)
    .create<SprintRetroSummary>(summaryData);
}

/**
 * Update an existing retrospective summary.
 * Admin-only operation.
 *
 * @param id - The retro summary record ID
 * @param data - Partial summary data to update
 * @returns The updated retro summary record
 */
export async function updateRetroSummary(
  id: string,
  data: UpdateRetroSummaryData
): Promise<SprintRetroSummary> {
  return pb
    .collection(Collections.SPRINT_RETRO_SUMMARIES)
    .update<SprintRetroSummary>(id, data);
}

/**
 * Get the retrospective summary for a sprint.
 *
 * @param sprintId - The sprint ID to get the summary for
 * @returns The retro summary or null if not found
 */
export async function getRetroSummary(
  sprintId: string
): Promise<SprintRetroSummary | null> {
  try {
    return await pb
      .collection(Collections.SPRINT_RETRO_SUMMARIES)
      .getFirstListItem<SprintRetroSummary>(`sprint_id = "${sprintId}"`);
  } catch (error) {
    // PocketBase throws when no record is found
    if (
      error instanceof Error &&
      error.message.includes('The requested resource wasn\'t found')
    ) {
      return null;
    }
    throw error;
  }
}

// =============================================================================
// Retro Resource Functions
// =============================================================================

/**
 * Create a retrospective resource for a sprint.
 * Admin-only operation.
 *
 * @param sprintId - The sprint ID to add the resource to
 * @param data - Resource data including title, URL, and type
 * @returns The created retro resource record
 */
export async function createRetroResource(
  sprintId: string,
  data: CreateRetroResourceData
): Promise<SprintRetroResource> {
  const resourceData = {
    sprint_id: sprintId,
    title: data.title,
    url: data.url,
    resource_type: data.resource_type,
  };

  return pb
    .collection(Collections.SPRINT_RETRO_RESOURCES)
    .create<SprintRetroResource>(resourceData);
}

/**
 * Get all retrospective resources for a sprint.
 *
 * @param sprintId - The sprint ID to get resources for
 * @returns Array of retro resources for the sprint
 */
export async function getRetroResources(
  sprintId: string
): Promise<SprintRetroResource[]> {
  const result = await pb
    .collection(Collections.SPRINT_RETRO_RESOURCES)
    .getFullList<SprintRetroResource>({
      filter: `sprint_id = "${sprintId}"`,
      sort: 'created',
    });

  return result;
}

/**
 * Delete a retrospective resource.
 * Admin-only operation.
 *
 * @param id - The retro resource record ID to delete
 * @returns True if deleted successfully
 */
export async function deleteRetroResource(id: string): Promise<boolean> {
  await pb.collection(Collections.SPRINT_RETRO_RESOURCES).delete(id);
  return true;
}

// =============================================================================
// Sprint Award Functions
// =============================================================================

/**
 * Create a sprint award for a submission/user.
 * Admin-only operation.
 *
 * @param sprintId - The sprint ID for the award
 * @param awardType - The type of award being given
 * @param submissionId - The submission ID receiving the award
 * @param userId - The user ID receiving the award
 * @returns The created sprint award record
 */
export async function createSprintAward(
  sprintId: string,
  awardType: AwardType,
  submissionId: string,
  userId: string
): Promise<SprintAward> {
  const awardData = {
    sprint_id: sprintId,
    award_type: awardType,
    submission_id: submissionId,
    user_id: userId,
  };

  return pb
    .collection(Collections.SPRINT_AWARDS)
    .create<SprintAward>(awardData);
}

/**
 * Get all awards for a sprint.
 *
 * @param sprintId - The sprint ID to get awards for
 * @returns Array of sprint awards
 */
export async function getSprintAwards(sprintId: string): Promise<SprintAward[]> {
  const result = await pb
    .collection(Collections.SPRINT_AWARDS)
    .getFullList<SprintAward>({
      filter: `sprint_id = "${sprintId}"`,
      sort: 'created',
    });

  return result;
}

/**
 * Get all awards for a sprint with expanded submission and user details.
 *
 * @param sprintId - The sprint ID to get awards for
 * @returns Array of sprint awards with expanded relations
 */
export async function getSprintAwardsWithDetails(
  sprintId: string
): Promise<SprintAwardWithRelations[]> {
  const result = await pb
    .collection(Collections.SPRINT_AWARDS)
    .getFullList<SprintAwardWithRelations>({
      filter: `sprint_id = "${sprintId}"`,
      expand: 'submission_id,user_id',
      sort: 'created',
    });

  return result;
}

/**
 * Get all awards earned by a user across all sprints.
 * If no userId is provided, returns awards for the current authenticated user.
 *
 * @param userId - Optional user ID (defaults to current user)
 * @returns Array of sprint awards with expanded relations
 */
export async function getUserAwards(
  userId?: string
): Promise<SprintAwardWithRelations[]> {
  const targetUserId = userId ?? pb.authStore.record?.id;

  if (!targetUserId) {
    throw new Error('No user ID provided and no authenticated user');
  }

  const result = await pb
    .collection(Collections.SPRINT_AWARDS)
    .getFullList<SprintAwardWithRelations>({
      filter: `user_id = "${targetUserId}"`,
      expand: 'sprint_id,submission_id',
      sort: '-created',
    });

  return result;
}

/**
 * Get a specific award type for a sprint.
 * Useful for checking if an award has already been given.
 *
 * @param sprintId - The sprint ID to check
 * @param awardType - The type of award to find
 * @returns The sprint award or null if not found
 */
export async function getAwardByType(
  sprintId: string,
  awardType: AwardType
): Promise<SprintAward | null> {
  try {
    return await pb
      .collection(Collections.SPRINT_AWARDS)
      .getFirstListItem<SprintAward>(
        `sprint_id = "${sprintId}" && award_type = "${awardType}"`
      );
  } catch (error) {
    // PocketBase throws when no record is found
    if (
      error instanceof Error &&
      error.message.includes('The requested resource wasn\'t found')
    ) {
      return null;
    }
    throw error;
  }
}

// =============================================================================
// Batch Operations
// =============================================================================

/**
 * Create multiple awards for a sprint at once.
 * Admin-only operation.
 *
 * @param sprintId - The sprint ID for the awards
 * @param awards - Array of award details to create
 * @returns Array of created sprint awards
 */
export async function createMultipleAwards(
  sprintId: string,
  awards: Array<{
    awardType: AwardType;
    submissionId: string;
    userId: string;
  }>
): Promise<SprintAward[]> {
  const createdAwards: SprintAward[] = [];

  for (const award of awards) {
    const created = await createSprintAward(
      sprintId,
      award.awardType,
      award.submissionId,
      award.userId
    );
    createdAwards.push(created);
  }

  return createdAwards;
}

/**
 * Delete a sprint award.
 * Admin-only operation.
 *
 * @param id - The sprint award record ID to delete
 * @returns True if deleted successfully
 */
export async function deleteSprintAward(id: string): Promise<boolean> {
  await pb.collection(Collections.SPRINT_AWARDS).delete(id);
  return true;
}

// =============================================================================
// Query Helpers
// =============================================================================

/**
 * Get paginated awards for a user.
 *
 * @param userId - The user ID to get awards for
 * @param page - Page number (1-indexed)
 * @param perPage - Number of items per page
 * @returns Paginated list result of awards
 */
export async function getUserAwardsPaginated(
  userId: string,
  page: number = 1,
  perPage: number = 10
): Promise<ListResult<SprintAwardWithRelations>> {
  return pb
    .collection(Collections.SPRINT_AWARDS)
    .getList<SprintAwardWithRelations>(page, perPage, {
      filter: `user_id = "${userId}"`,
      expand: 'sprint_id,submission_id',
      sort: '-created',
    });
}

/**
 * Check if a user has received a specific award type in a sprint.
 *
 * @param sprintId - The sprint ID to check
 * @param userId - The user ID to check
 * @param awardType - The type of award to check for
 * @returns True if the user has the award, false otherwise
 */
export async function hasUserAward(
  sprintId: string,
  userId: string,
  awardType: AwardType
): Promise<boolean> {
  try {
    await pb.collection(Collections.SPRINT_AWARDS).getFirstListItem(
      `sprint_id = "${sprintId}" && user_id = "${userId}" && award_type = "${awardType}"`
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get award counts by type for a sprint.
 * Returns a map of award types to their count (should be 0 or 1 for each).
 *
 * @param sprintId - The sprint ID to get counts for
 * @returns Map of award types to count
 */
export async function getAwardCountsByType(
  sprintId: string
): Promise<Record<AwardType, number>> {
  const awards = await getSprintAwards(sprintId);

  const counts: Record<AwardType, number> = {
    top_visual: 0,
    top_usability: 0,
    top_clarity: 0,
    top_originality: 0,
    feedback_mvp: 0,
    most_improved: 0,
    participation_champion: 0,
  };

  for (const award of awards) {
    counts[award.award_type]++;
  }

  return counts;
}

/**
 * Get the total number of awards a user has earned.
 *
 * @param userId - The user ID to count awards for
 * @returns The total number of awards
 */
export async function getUserAwardCount(userId: string): Promise<number> {
  const result = await pb
    .collection(Collections.SPRINT_AWARDS)
    .getList<SprintAward>(1, 1, {
      filter: `user_id = "${userId}"`,
    });

  return result.totalItems;
}
