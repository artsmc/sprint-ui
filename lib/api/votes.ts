/**
 * Votes Service
 *
 * API service for vote operations.
 * Handles casting, updating, and retrieving votes on submissions.
 * Each vote consists of 4 rating categories: clarity, usability, visual craft, originality.
 */

import pb from '@/lib/pocketbase';
import type { Vote, VoteStats, VoteWithRelations } from '@/lib/types';
import { Collections } from '@/lib/types';
import { getCurrentUser } from '@/lib/api/auth';
import { filterEquals, filterAnd } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Rating values for a vote.
 * Each category is rated on a scale of 1-5.
 */
export interface VoteRatings {
  rating_clarity: number;
  rating_usability: number;
  rating_visual_craft: number;
  rating_originality: number;
}

/**
 * Input data for creating a vote.
 */
export interface CreateVoteData extends VoteRatings {
  sprint_id: string;
  submission_id: string;
}

/**
 * Input data for updating a vote.
 */
export type UpdateVoteData = Partial<VoteRatings>;

// =============================================================================
// Vote CRUD Operations
// =============================================================================

/**
 * Cast a vote on a submission.
 * Creates a new vote record with the current user as the voter.
 *
 * @param sprintId - The sprint ID the vote belongs to
 * @param submissionId - The submission ID being voted on
 * @param ratings - The rating values for each category (1-5)
 * @returns The created vote record
 * @throws Error if not authenticated or if rating values are invalid
 */
export async function createVote(
  sprintId: string,
  submissionId: string,
  ratings: VoteRatings
): Promise<Vote> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  validateRatings(ratings);

  const voteData: CreateVoteData & { voter_id: string } = {
    sprint_id: sprintId,
    submission_id: submissionId,
    voter_id: user.id,
    ...ratings,
  };

  return pb.collection(Collections.VOTES).create<Vote>(voteData);
}

/**
 * Update an existing vote.
 *
 * @param id - The vote ID to update
 * @param ratings - The rating values to update (partial allowed)
 * @returns The updated vote record
 * @throws Error if rating values are invalid
 */
export async function updateVote(
  id: string,
  ratings: UpdateVoteData
): Promise<Vote> {
  if (Object.keys(ratings).length > 0) {
    validateRatings(ratings);
  }

  return pb.collection(Collections.VOTES).update<Vote>(id, ratings);
}

/**
 * Delete a vote.
 *
 * @param id - The vote ID to delete
 * @returns True if deletion was successful
 */
export async function deleteVote(id: string): Promise<boolean> {
  await pb.collection(Collections.VOTES).delete(id);
  return true;
}

/**
 * Get a vote by ID.
 *
 * @param id - The vote ID
 * @returns The vote record
 */
export async function getVote(id: string): Promise<Vote> {
  return pb.collection(Collections.VOTES).getOne<Vote>(id);
}

/**
 * Get a vote by ID with expanded relations.
 *
 * @param id - The vote ID
 * @returns The vote record with expanded sprint, submission, and voter
 */
export async function getVoteWithRelations(id: string): Promise<VoteWithRelations> {
  return pb.collection(Collections.VOTES).getOne<VoteWithRelations>(id, {
    expand: 'sprint_id,submission_id,voter_id',
  });
}

// =============================================================================
// Vote Query Functions
// =============================================================================

/**
 * Get all votes for a submission.
 *
 * @param submissionId - The submission ID
 * @returns Array of votes on the submission
 */
export async function getVotesBySubmission(submissionId: string): Promise<Vote[]> {
  const result = await pb.collection(Collections.VOTES).getFullList<Vote>({
    filter: filterEquals('submission_id', submissionId),
    sort: '-created',
  });

  return result;
}

/**
 * Get a specific user's vote on a submission.
 * If no userId is provided, uses the current authenticated user.
 *
 * @param submissionId - The submission ID
 * @param userId - Optional user ID (defaults to current user)
 * @returns The user's vote or null if not found
 */
export async function getUserVote(
  submissionId: string,
  userId?: string
): Promise<Vote | null> {
  const voterId = userId ?? getCurrentUser()?.id;
  if (!voterId) {
    return null;
  }

  try {
    const result = await pb.collection(Collections.VOTES).getFirstListItem<Vote>(
      filterAnd([
        filterEquals('submission_id', submissionId),
        filterEquals('voter_id', voterId),
      ])
    );
    return result;
  } catch {
    // getFirstListItem throws when no record is found
    return null;
  }
}

/**
 * Check if a user has voted on a submission.
 * If no userId is provided, uses the current authenticated user.
 *
 * @param submissionId - The submission ID
 * @param userId - Optional user ID (defaults to current user)
 * @returns True if the user has voted, false otherwise
 */
export async function hasUserVoted(
  submissionId: string,
  userId?: string
): Promise<boolean> {
  const vote = await getUserVote(submissionId, userId);
  return vote !== null;
}

/**
 * Get all votes cast by a user in a specific sprint.
 * If no userId is provided, uses the current authenticated user.
 *
 * @param sprintId - The sprint ID
 * @param userId - Optional user ID (defaults to current user)
 * @returns Array of votes cast by the user in the sprint
 */
export async function getUserVotesForSprint(
  sprintId: string,
  userId?: string
): Promise<Vote[]> {
  const voterId = userId ?? getCurrentUser()?.id;
  if (!voterId) {
    return [];
  }

  const result = await pb.collection(Collections.VOTES).getFullList<Vote>({
    filter: filterAnd([
      filterEquals('sprint_id', sprintId),
      filterEquals('voter_id', voterId),
    ]),
    sort: '-created',
  });

  return result;
}

/**
 * Get the total number of votes on a submission.
 *
 * @param submissionId - The submission ID
 * @returns The vote count
 */
export async function getVoteCount(submissionId: string): Promise<number> {
  const result = await pb.collection(Collections.VOTES).getList<Vote>(1, 1, {
    filter: filterEquals('submission_id', submissionId),
  });

  return result.totalItems;
}

// =============================================================================
// Vote Statistics
// =============================================================================

/**
 * Calculate vote statistics for a submission.
 * Computes average ratings for each category and overall.
 *
 * @param submissionId - The submission ID
 * @returns Vote statistics including averages per category and total votes
 */
export async function getVoteStats(submissionId: string): Promise<VoteStats> {
  const votes = await getVotesBySubmission(submissionId);

  if (votes.length === 0) {
    return {
      submission_id: submissionId,
      total_votes: 0,
      avg_clarity: 0,
      avg_usability: 0,
      avg_visual_craft: 0,
      avg_originality: 0,
      avg_overall: 0,
    };
  }

  const totalVotes = votes.length;

  const sumClarity = votes.reduce((sum, v) => sum + v.rating_clarity, 0);
  const sumUsability = votes.reduce((sum, v) => sum + v.rating_usability, 0);
  const sumVisualCraft = votes.reduce((sum, v) => sum + v.rating_visual_craft, 0);
  const sumOriginality = votes.reduce((sum, v) => sum + v.rating_originality, 0);

  const avgClarity = sumClarity / totalVotes;
  const avgUsability = sumUsability / totalVotes;
  const avgVisualCraft = sumVisualCraft / totalVotes;
  const avgOriginality = sumOriginality / totalVotes;

  const avgOverall = (avgClarity + avgUsability + avgVisualCraft + avgOriginality) / 4;

  return {
    submission_id: submissionId,
    total_votes: totalVotes,
    avg_clarity: roundToTwoDecimals(avgClarity),
    avg_usability: roundToTwoDecimals(avgUsability),
    avg_visual_craft: roundToTwoDecimals(avgVisualCraft),
    avg_originality: roundToTwoDecimals(avgOriginality),
    avg_overall: roundToTwoDecimals(avgOverall),
  };
}

/**
 * Get vote statistics for multiple submissions.
 * Useful for leaderboards and batch processing.
 *
 * @param submissionIds - Array of submission IDs
 * @returns Map of submission ID to vote statistics
 */
export async function getVoteStatsForSubmissions(
  submissionIds: string[]
): Promise<Map<string, VoteStats>> {
  const statsMap = new Map<string, VoteStats>();

  const statsPromises = submissionIds.map(async (id) => {
    const stats = await getVoteStats(id);
    return { id, stats };
  });

  const results = await Promise.all(statsPromises);

  for (const { id, stats } of results) {
    statsMap.set(id, stats);
  }

  return statsMap;
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Validate that rating values are within the valid range (1-5).
 *
 * @param ratings - The ratings to validate
 * @throws Error if any rating is out of range
 */
function validateRatings(ratings: Partial<VoteRatings>): void {
  const ratingFields: (keyof VoteRatings)[] = [
    'rating_clarity',
    'rating_usability',
    'rating_visual_craft',
    'rating_originality',
  ];

  for (const field of ratingFields) {
    const value = ratings[field];
    if (value !== undefined) {
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error(
          `Invalid ${field}: must be an integer between 1 and 5, got ${value}`
        );
      }
    }
  }
}

/**
 * Round a number to two decimal places.
 *
 * @param value - The value to round
 * @returns The rounded value
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
