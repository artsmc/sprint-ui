/**
 * Submissions Service
 *
 * API service for submission operations.
 * Handles creating, updating, deleting, and querying design submissions.
 */

import pb from '@/lib/pocketbase';
import type {
  Submission,
  SubmissionStatus,
  SubmissionWithRelations,
  ListResult,
  Sprint,
  User,
  Challenge,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { getCurrentUser } from '@/lib/api/auth';
import { filterEquals, filterAnd } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Data required to create a new submission.
 */
export interface CreateSubmissionData {
  title: string;
  short_description?: string;
  main_problem_focused?: string;
  key_constraints?: string;
  figma_url?: string;
}

/**
 * Data for updating an existing submission.
 */
export interface UpdateSubmissionData {
  title?: string;
  short_description?: string;
  main_problem_focused?: string;
  key_constraints?: string;
  figma_url?: string;
}

/**
 * Submission with full nested relation expansions including challenge.
 */
export interface SubmissionWithFullRelations extends Submission {
  expand?: {
    sprint_id?: Sprint & {
      expand?: {
        challenge_id?: Challenge;
      };
    };
    user_id?: User;
  };
}

/**
 * Options for listing submissions.
 */
export interface ListSubmissionsOptions {
  page?: number;
  perPage?: number;
  sort?: string;
}

// =============================================================================
// Submission CRUD Operations
// =============================================================================

/**
 * Create a new draft submission for the current user.
 *
 * @param sprintId - The ID of the sprint to submit to
 * @param data - The submission data
 * @returns The created submission record
 * @throws Error if user is not authenticated
 */
export async function createSubmission(
  sprintId: string,
  data: CreateSubmissionData
): Promise<Submission> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const submissionData = {
    sprint_id: sprintId,
    user_id: user.id,
    title: data.title,
    short_description: data.short_description || null,
    main_problem_focused: data.main_problem_focused || null,
    key_constraints: data.key_constraints || null,
    figma_url: data.figma_url || null,
    status: 'draft' as SubmissionStatus,
    submitted_at: null,
  };

  return pb.collection(Collections.SUBMISSIONS).create<Submission>(submissionData);
}

/**
 * Get a submission by its ID.
 *
 * @param id - The submission ID
 * @returns The submission record
 */
export async function getSubmission(id: string): Promise<Submission> {
  return pb.collection(Collections.SUBMISSIONS).getOne<Submission>(id);
}

/**
 * Get a submission with user, sprint, and challenge expanded.
 *
 * @param id - The submission ID
 * @returns The submission with expanded relations
 */
export async function getSubmissionWithRelations(
  id: string
): Promise<SubmissionWithFullRelations> {
  return pb.collection(Collections.SUBMISSIONS).getOne<SubmissionWithFullRelations>(id, {
    expand: 'user_id,sprint_id,sprint_id.challenge_id',
  });
}

/**
 * Update an existing submission.
 * Only the submission owner can update, and only during active phase.
 *
 * @param id - The submission ID
 * @param data - The data to update
 * @returns The updated submission record
 * @throws Error if user is not authenticated or not the owner
 */
export async function updateSubmission(
  id: string,
  data: UpdateSubmissionData
): Promise<Submission> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Verify ownership
  const submission = await getSubmission(id);
  if (submission.user_id !== user.id) {
    throw new Error('You can only update your own submissions');
  }

  // Only allow updates to draft submissions
  if (submission.status !== 'draft') {
    throw new Error('Cannot update a submitted design');
  }

  return pb.collection(Collections.SUBMISSIONS).update<Submission>(id, data);
}

/**
 * Submit a design by changing its status to 'submitted'.
 * Sets the submitted_at timestamp to the current time.
 *
 * @param id - The submission ID
 * @returns The updated submission record
 * @throws Error if user is not authenticated, not the owner, or already submitted
 */
export async function submitDesign(id: string): Promise<Submission> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Verify ownership
  const submission = await getSubmission(id);
  if (submission.user_id !== user.id) {
    throw new Error('You can only submit your own designs');
  }

  // Check if already submitted
  if (submission.status === 'submitted') {
    throw new Error('Design has already been submitted');
  }

  return pb.collection(Collections.SUBMISSIONS).update<Submission>(id, {
    status: 'submitted' as SubmissionStatus,
    submitted_at: new Date().toISOString(),
  });
}

/**
 * Delete a draft submission.
 * Only the submission owner can delete, and only draft submissions.
 *
 * @param id - The submission ID
 * @throws Error if user is not authenticated, not the owner, or submission is not a draft
 */
export async function deleteSubmission(id: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Verify ownership
  const submission = await getSubmission(id);
  if (submission.user_id !== user.id) {
    throw new Error('You can only delete your own submissions');
  }

  // Only allow deleting draft submissions
  if (submission.status !== 'draft') {
    throw new Error('Cannot delete a submitted design');
  }

  await pb.collection(Collections.SUBMISSIONS).delete(id);
}

// =============================================================================
// Sprint-Based Queries
// =============================================================================

/**
 * Get all submissions for a sprint.
 *
 * @param sprintId - The sprint ID
 * @param options - Pagination and sorting options
 * @returns Paginated list of submissions
 */
export async function getSubmissionsBySprint(
  sprintId: string,
  options: ListSubmissionsOptions = {}
): Promise<ListResult<SubmissionWithRelations>> {
  const { page = 1, perPage = 50, sort = '-created' } = options;

  return pb.collection(Collections.SUBMISSIONS).getList<SubmissionWithRelations>(page, perPage, {
    filter: filterEquals('sprint_id', sprintId),
    sort,
    expand: 'user_id,sprint_id',
  });
}

/**
 * Get only submitted (not draft) submissions for a sprint.
 * Used for voting phase where only submitted designs are visible.
 *
 * @param sprintId - The sprint ID
 * @param options - Pagination and sorting options
 * @returns Paginated list of submitted submissions
 */
export async function getSubmittedSubmissionsBySprint(
  sprintId: string,
  options: ListSubmissionsOptions = {}
): Promise<ListResult<SubmissionWithRelations>> {
  const { page = 1, perPage = 50, sort = '-submitted_at' } = options;

  return pb.collection(Collections.SUBMISSIONS).getList<SubmissionWithRelations>(page, perPage, {
    filter: filterAnd([
      filterEquals('sprint_id', sprintId),
      filterEquals('status', 'submitted'),
    ]),
    sort,
    expand: 'user_id,sprint_id',
  });
}

// =============================================================================
// User-Based Queries
// =============================================================================

/**
 * Get all submissions for a user.
 * If no userId is provided, gets submissions for the current user.
 *
 * @param userId - Optional user ID. Defaults to current user.
 * @param options - Pagination and sorting options
 * @returns Paginated list of user submissions
 * @throws Error if no userId provided and user is not authenticated
 */
export async function getUserSubmissions(
  userId?: string,
  options: ListSubmissionsOptions = {}
): Promise<ListResult<SubmissionWithRelations>> {
  const targetUserId = userId || getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  const { page = 1, perPage = 50, sort = '-created' } = options;

  return pb.collection(Collections.SUBMISSIONS).getList<SubmissionWithRelations>(page, perPage, {
    filter: filterEquals('user_id', targetUserId),
    sort,
    expand: 'user_id,sprint_id',
  });
}

/**
 * Get a user's submission for a specific sprint.
 * If no userId is provided, gets the current user's submission.
 *
 * @param sprintId - The sprint ID
 * @param userId - Optional user ID. Defaults to current user.
 * @returns The user's submission for the sprint, or null if none exists
 * @throws Error if no userId provided and user is not authenticated
 */
export async function getUserSubmissionForSprint(
  sprintId: string,
  userId?: string
): Promise<SubmissionWithRelations | null> {
  const targetUserId = userId || getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  try {
    const result = await pb
      .collection(Collections.SUBMISSIONS)
      .getFirstListItem<SubmissionWithRelations>(
        filterAnd([
          filterEquals('sprint_id', sprintId),
          filterEquals('user_id', targetUserId),
        ]),
        {
          expand: 'user_id,sprint_id',
        }
      );
    return result;
  } catch (error) {
    // PocketBase throws a 404 error when no record is found
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

/**
 * Check if a user has a submitted (not draft) design for a sprint.
 * If no userId is provided, checks for the current user.
 *
 * @param sprintId - The sprint ID
 * @param userId - Optional user ID. Defaults to current user.
 * @returns True if the user has submitted a design, false otherwise
 * @throws Error if no userId provided and user is not authenticated
 */
export async function hasUserSubmitted(
  sprintId: string,
  userId?: string
): Promise<boolean> {
  const targetUserId = userId || getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  try {
    await pb
      .collection(Collections.SUBMISSIONS)
      .getFirstListItem<Submission>(
        filterAnd([
          filterEquals('sprint_id', sprintId),
          filterEquals('user_id', targetUserId),
          filterEquals('status', 'submitted'),
        ])
      );
    return true;
  } catch (error) {
    // PocketBase throws a 404 error when no record is found
    if (error instanceof Error && error.message.includes('404')) {
      return false;
    }
    throw error;
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get the count of submissions for a sprint.
 *
 * @param sprintId - The sprint ID
 * @param onlySubmitted - If true, only count submitted designs
 * @returns The number of submissions
 */
export async function getSubmissionCount(
  sprintId: string,
  onlySubmitted: boolean = false
): Promise<number> {
  const filter = onlySubmitted
    ? filterAnd([
        filterEquals('sprint_id', sprintId),
        filterEquals('status', 'submitted'),
      ])
    : filterEquals('sprint_id', sprintId);

  const result = await pb.collection(Collections.SUBMISSIONS).getList<Submission>(1, 1, {
    filter,
  });

  return result.totalItems;
}

/**
 * Check if a user can still edit their submission.
 * Returns true if the submission is a draft and belongs to the user.
 *
 * @param id - The submission ID
 * @param userId - Optional user ID. Defaults to current user.
 * @returns True if the submission can be edited
 */
export async function canEditSubmission(
  id: string,
  userId?: string
): Promise<boolean> {
  const targetUserId = userId || getCurrentUser()?.id;
  if (!targetUserId) {
    return false;
  }

  try {
    const submission = await getSubmission(id);
    return submission.user_id === targetUserId && submission.status === 'draft';
  } catch {
    return false;
  }
}
