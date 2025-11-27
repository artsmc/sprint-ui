/**
 * Feedback Service
 *
 * API service for feedback operations.
 * Handles creating, updating, deleting, and querying feedback on submissions.
 * Also manages feedback helpful marks for tracking useful feedback.
 */

import pb from '@/lib/pocketbase';
import type {
  Feedback,
  FeedbackHelpfulMark,
  FeedbackWithAuthor,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { getCurrentUser } from '@/lib/api/auth';

// =============================================================================
// Types
// =============================================================================

/**
 * Data required to create feedback.
 */
export interface CreateFeedbackData {
  works_well?: string | null;
  to_improve?: string | null;
  question?: string | null;
  is_anonymous?: boolean;
}

/**
 * Data that can be updated on existing feedback.
 */
export interface UpdateFeedbackData {
  works_well?: string | null;
  to_improve?: string | null;
  question?: string | null;
  is_anonymous?: boolean;
}

// =============================================================================
// Feedback CRUD Functions
// =============================================================================

/**
 * Create feedback for a submission.
 *
 * @param sprintId - The ID of the sprint
 * @param submissionId - The ID of the submission being reviewed
 * @param data - Feedback content (works_well, to_improve, question, is_anonymous)
 * @returns The created feedback record
 * @throws Error if not authenticated
 */
export async function createFeedback(
  sprintId: string,
  submissionId: string,
  data: CreateFeedbackData
): Promise<Feedback> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const feedbackData = {
    sprint_id: sprintId,
    submission_id: submissionId,
    author_id: user.id,
    works_well: data.works_well ?? null,
    to_improve: data.to_improve ?? null,
    question: data.question ?? null,
    is_anonymous: data.is_anonymous ?? false,
  };

  return pb.collection(Collections.FEEDBACK).create<Feedback>(feedbackData);
}

/**
 * Update existing feedback.
 * Only the author can update their feedback.
 *
 * @param id - The feedback ID
 * @param data - Partial feedback data to update
 * @returns The updated feedback record
 * @throws Error if not authenticated or not the author
 */
export async function updateFeedback(
  id: string,
  data: UpdateFeedbackData
): Promise<Feedback> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Verify ownership before update
  const existing = await pb.collection(Collections.FEEDBACK).getOne<Feedback>(id);
  if (existing.author_id !== user.id) {
    throw new Error('Not authorized to update this feedback');
  }

  return pb.collection(Collections.FEEDBACK).update<Feedback>(id, data);
}

/**
 * Delete feedback.
 * Only the author can delete their feedback.
 *
 * @param id - The feedback ID to delete
 * @throws Error if not authenticated or not the author
 */
export async function deleteFeedback(id: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Verify ownership before delete
  const existing = await pb.collection(Collections.FEEDBACK).getOne<Feedback>(id);
  if (existing.author_id !== user.id) {
    throw new Error('Not authorized to delete this feedback');
  }

  await pb.collection(Collections.FEEDBACK).delete(id);
}

// =============================================================================
// Feedback Query Functions
// =============================================================================

/**
 * Get feedback by ID.
 *
 * @param id - The feedback ID
 * @returns The feedback record
 */
export async function getFeedback(id: string): Promise<Feedback> {
  return pb.collection(Collections.FEEDBACK).getOne<Feedback>(id);
}

/**
 * Get feedback with expanded author relation.
 * Note: Author will only be expanded if feedback is not anonymous.
 *
 * @param id - The feedback ID
 * @returns The feedback record with author expansion (if not anonymous)
 */
export async function getFeedbackWithAuthor(id: string): Promise<FeedbackWithAuthor> {
  const feedback = await pb.collection(Collections.FEEDBACK).getOne<FeedbackWithAuthor>(id, {
    expand: 'author_id',
  });

  // If anonymous, remove expanded author for privacy
  if (feedback.is_anonymous && feedback.expand?.author_id) {
    return {
      ...feedback,
      expand: undefined,
    };
  }

  return feedback;
}

/**
 * Get all feedback for a submission.
 *
 * @param submissionId - The submission ID
 * @returns List of all feedback on the submission
 */
export async function getFeedbackBySubmission(
  submissionId: string
): Promise<Feedback[]> {
  const result = await pb.collection(Collections.FEEDBACK).getFullList<Feedback>({
    filter: `submission_id = "${submissionId}"`,
    sort: '-created',
  });

  return result;
}

/**
 * Get a user's feedback on a specific submission.
 * If userId is not provided, uses the current authenticated user.
 *
 * @param submissionId - The submission ID
 * @param userId - Optional user ID (defaults to current user)
 * @returns The user's feedback or null if not found
 */
export async function getUserFeedbackForSubmission(
  submissionId: string,
  userId?: string
): Promise<Feedback | null> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('Not authenticated and no userId provided');
  }

  try {
    const result = await pb.collection(Collections.FEEDBACK).getFirstListItem<Feedback>(
      `submission_id = "${submissionId}" && author_id = "${targetUserId}"`
    );
    return result;
  } catch {
    // PocketBase throws if no record found
    return null;
  }
}

// =============================================================================
// Feedback Helpful Mark Functions
// =============================================================================

/**
 * Mark feedback as helpful.
 * Creates a FeedbackHelpfulMark record for the current user.
 *
 * @param feedbackId - The feedback ID to mark as helpful
 * @returns The created helpful mark record
 * @throws Error if not authenticated or already marked
 */
export async function markFeedbackHelpful(
  feedbackId: string
): Promise<FeedbackHelpfulMark> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Check if already marked
  const existing = await hasUserMarkedHelpful(feedbackId, user.id);
  if (existing) {
    throw new Error('Feedback already marked as helpful');
  }

  const markData = {
    feedback_id: feedbackId,
    marked_by_id: user.id,
  };

  return pb
    .collection(Collections.FEEDBACK_HELPFUL_MARKS)
    .create<FeedbackHelpfulMark>(markData);
}

/**
 * Remove helpful mark from feedback.
 * Deletes the FeedbackHelpfulMark record for the current user.
 *
 * @param feedbackId - The feedback ID to unmark
 * @throws Error if not authenticated or not marked
 */
export async function unmarkFeedbackHelpful(feedbackId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  try {
    const mark = await pb
      .collection(Collections.FEEDBACK_HELPFUL_MARKS)
      .getFirstListItem<FeedbackHelpfulMark>(
        `feedback_id = "${feedbackId}" && marked_by_id = "${user.id}"`
      );

    await pb.collection(Collections.FEEDBACK_HELPFUL_MARKS).delete(mark.id);
  } catch {
    throw new Error('Helpful mark not found');
  }
}

/**
 * Check if a user has marked feedback as helpful.
 * If userId is not provided, uses the current authenticated user.
 *
 * @param feedbackId - The feedback ID
 * @param userId - Optional user ID (defaults to current user)
 * @returns True if the user has marked the feedback as helpful
 */
export async function hasUserMarkedHelpful(
  feedbackId: string,
  userId?: string
): Promise<boolean> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('Not authenticated and no userId provided');
  }

  try {
    await pb
      .collection(Collections.FEEDBACK_HELPFUL_MARKS)
      .getFirstListItem<FeedbackHelpfulMark>(
        `feedback_id = "${feedbackId}" && marked_by_id = "${targetUserId}"`
      );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the count of helpful marks on feedback.
 *
 * @param feedbackId - The feedback ID
 * @returns The number of helpful marks
 */
export async function getHelpfulCount(feedbackId: string): Promise<number> {
  const result = await pb
    .collection(Collections.FEEDBACK_HELPFUL_MARKS)
    .getList<FeedbackHelpfulMark>(1, 1, {
      filter: `feedback_id = "${feedbackId}"`,
    });

  return result.totalItems;
}

// =============================================================================
// Aggregation Functions
// =============================================================================

/**
 * Get the count of feedback on a submission.
 *
 * @param submissionId - The submission ID
 * @returns The number of feedback entries
 */
export async function getFeedbackCount(submissionId: string): Promise<number> {
  const result = await pb.collection(Collections.FEEDBACK).getList<Feedback>(1, 1, {
    filter: `submission_id = "${submissionId}"`,
  });

  return result.totalItems;
}
