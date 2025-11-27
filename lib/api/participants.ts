/**
 * Participants Service
 *
 * API service for sprint participant operations.
 * Handles joining/leaving sprints and querying participation data.
 */

import pb from '@/lib/pocketbase';
import type {
  SprintParticipant,
  SprintParticipantWithRelations,
  ListResult,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { getCurrentUser } from '@/lib/api/auth';

// =============================================================================
// Types
// =============================================================================

export interface JoinSprintData {
  sprint_id: string;
  user_id: string;
  joined_at: string;
}

// =============================================================================
// Sprint Participation Functions
// =============================================================================

/**
 * Join a sprint as the current authenticated user.
 *
 * Creates a new SprintParticipant record linking the current user to the sprint.
 *
 * @param sprintId - The ID of the sprint to join
 * @returns The created SprintParticipant record
 * @throws Error if user is not authenticated
 * @throws Error if user is already a participant in the sprint
 */
export async function joinSprint(sprintId: string): Promise<SprintParticipant> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Check if already participating
  const existing = await findParticipant(sprintId, user.id);
  if (existing) {
    throw new Error('Already participating in this sprint');
  }

  const participantData: JoinSprintData = {
    sprint_id: sprintId,
    user_id: user.id,
    joined_at: new Date().toISOString(),
  };

  return pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .create<SprintParticipant>(participantData);
}

/**
 * Leave a sprint as the current authenticated user.
 *
 * Deletes the SprintParticipant record for the current user.
 *
 * @param sprintId - The ID of the sprint to leave
 * @throws Error if user is not authenticated
 * @throws Error if user is not a participant in the sprint
 */
export async function leaveSprint(sprintId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const participant = await findParticipant(sprintId, user.id);
  if (!participant) {
    throw new Error('Not participating in this sprint');
  }

  await pb.collection(Collections.SPRINT_PARTICIPANTS).delete(participant.id);
}

// =============================================================================
// Query Functions
// =============================================================================

/**
 * Get all participants in a sprint.
 *
 * @param sprintId - The ID of the sprint
 * @returns List of SprintParticipant records
 */
export async function getSprintParticipants(
  sprintId: string
): Promise<SprintParticipant[]> {
  const result = await pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .getFullList<SprintParticipant>({
      filter: `sprint_id = "${sprintId}"`,
      sort: 'joined_at',
    });

  return result;
}

/**
 * Get all participants in a sprint with expanded user data.
 *
 * @param sprintId - The ID of the sprint
 * @returns List of SprintParticipant records with expanded user relation
 */
export async function getSprintParticipantsWithUsers(
  sprintId: string
): Promise<SprintParticipantWithRelations[]> {
  const result = await pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .getFullList<SprintParticipantWithRelations>({
      filter: `sprint_id = "${sprintId}"`,
      expand: 'user_id',
      sort: 'joined_at',
    });

  return result;
}

/**
 * Get all sprints a user has joined.
 *
 * Returns SprintParticipant records with expanded sprint data.
 * Defaults to the current authenticated user if no userId is provided.
 *
 * @param userId - Optional user ID (defaults to current user)
 * @returns List of SprintParticipant records with expanded sprint relation
 * @throws Error if no userId provided and user is not authenticated
 */
export async function getUserSprints(
  userId?: string
): Promise<SprintParticipantWithRelations[]> {
  const targetUserId = userId ?? getCurrentUser()?.id;

  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  const result = await pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .getFullList<SprintParticipantWithRelations>({
      filter: `user_id = "${targetUserId}"`,
      expand: 'sprint_id',
      sort: '-joined_at',
    });

  return result;
}

/**
 * Check if a user is a participant in a sprint.
 *
 * Defaults to the current authenticated user if no userId is provided.
 *
 * @param sprintId - The ID of the sprint
 * @param userId - Optional user ID (defaults to current user)
 * @returns True if the user is a participant, false otherwise
 * @throws Error if no userId provided and user is not authenticated
 */
export async function isUserParticipant(
  sprintId: string,
  userId?: string
): Promise<boolean> {
  const targetUserId = userId ?? getCurrentUser()?.id;

  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  const participant = await findParticipant(sprintId, targetUserId);
  return participant !== null;
}

/**
 * Get the count of participants in a sprint.
 *
 * Uses PocketBase's getList with minimal data fetch for efficiency.
 *
 * @param sprintId - The ID of the sprint
 * @returns The number of participants in the sprint
 */
export async function getParticipantCount(sprintId: string): Promise<number> {
  const result = await pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .getList<SprintParticipant>(1, 1, {
      filter: `sprint_id = "${sprintId}"`,
      fields: 'id',
    });

  return result.totalItems;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Find a participant record by sprint and user ID.
 *
 * @param sprintId - The ID of the sprint
 * @param userId - The ID of the user
 * @returns The SprintParticipant record or null if not found
 */
async function findParticipant(
  sprintId: string,
  userId: string
): Promise<SprintParticipant | null> {
  try {
    const result = await pb
      .collection(Collections.SPRINT_PARTICIPANTS)
      .getFirstListItem<SprintParticipant>(
        `sprint_id = "${sprintId}" && user_id = "${userId}"`
      );

    return result;
  } catch {
    // PocketBase throws if no record found
    return null;
  }
}

// =============================================================================
// Paginated Query Functions
// =============================================================================

/**
 * Get participants in a sprint with pagination.
 *
 * @param sprintId - The ID of the sprint
 * @param page - Page number (1-based)
 * @param perPage - Number of items per page
 * @returns Paginated list of SprintParticipant records
 */
export async function getSprintParticipantsPaginated(
  sprintId: string,
  page: number = 1,
  perPage: number = 20
): Promise<ListResult<SprintParticipant>> {
  const result = await pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .getList<SprintParticipant>(page, perPage, {
      filter: `sprint_id = "${sprintId}"`,
      sort: 'joined_at',
    });

  return result;
}

/**
 * Get participants with user data in a sprint with pagination.
 *
 * @param sprintId - The ID of the sprint
 * @param page - Page number (1-based)
 * @param perPage - Number of items per page
 * @returns Paginated list of SprintParticipant records with expanded user relation
 */
export async function getSprintParticipantsWithUsersPaginated(
  sprintId: string,
  page: number = 1,
  perPage: number = 20
): Promise<ListResult<SprintParticipantWithRelations>> {
  const result = await pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .getList<SprintParticipantWithRelations>(page, perPage, {
      filter: `sprint_id = "${sprintId}"`,
      expand: 'user_id',
      sort: 'joined_at',
    });

  return result;
}
