/**
 * Realtime Service
 *
 * API service for PocketBase real-time subscriptions.
 * Handles subscribing to collection changes for live updates.
 */

import pb from '@/lib/pocketbase';
import type {
  Vote,
  Feedback,
  Submission,
  Sprint,
  SprintParticipant,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import type { RecordSubscription, UnsubscribeFunc } from 'pocketbase';

// =============================================================================
// Types
// =============================================================================

/**
 * Callback function for real-time subscription events.
 */
export type SubscriptionCallback<T> = (data: RecordSubscription<T>) => void;

/**
 * Subscription actions that can occur.
 */
export type SubscriptionAction = 'create' | 'update' | 'delete';

// =============================================================================
// Vote Subscriptions
// =============================================================================

/**
 * Subscribe to vote changes for a specific submission.
 *
 * @param submissionId - The submission ID to watch
 * @param callback - Function called when votes change
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = await subscribeToVotes(submissionId, (data) => {
 *   console.log(data.action, data.record);
 * });
 * // Later: unsubscribe();
 */
export async function subscribeToVotes(
  submissionId: string,
  callback: SubscriptionCallback<Vote>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.VOTES).subscribe<Vote>(
    '*',
    (data) => {
      if (data.record.submission_id === submissionId) {
        callback(data);
      }
    }
  );
}

/**
 * Subscribe to all votes in a sprint.
 *
 * @param sprintId - The sprint ID to watch
 * @param callback - Function called when votes change
 * @returns Unsubscribe function
 */
export async function subscribeToSprintVotes(
  sprintId: string,
  callback: SubscriptionCallback<Vote>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.VOTES).subscribe<Vote>(
    '*',
    (data) => {
      if (data.record.sprint_id === sprintId) {
        callback(data);
      }
    }
  );
}

// =============================================================================
// Feedback Subscriptions
// =============================================================================

/**
 * Subscribe to feedback changes for a specific submission.
 *
 * @param submissionId - The submission ID to watch
 * @param callback - Function called when feedback changes
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = await subscribeToFeedback(submissionId, (data) => {
 *   if (data.action === 'create') {
 *     console.log('New feedback:', data.record);
 *   }
 * });
 */
export async function subscribeToFeedback(
  submissionId: string,
  callback: SubscriptionCallback<Feedback>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.FEEDBACK).subscribe<Feedback>(
    '*',
    (data) => {
      if (data.record.submission_id === submissionId) {
        callback(data);
      }
    }
  );
}

/**
 * Subscribe to all feedback in a sprint.
 *
 * @param sprintId - The sprint ID to watch
 * @param callback - Function called when feedback changes
 * @returns Unsubscribe function
 */
export async function subscribeToSprintFeedback(
  sprintId: string,
  callback: SubscriptionCallback<Feedback>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.FEEDBACK).subscribe<Feedback>(
    '*',
    (data) => {
      if (data.record.sprint_id === sprintId) {
        callback(data);
      }
    }
  );
}

// =============================================================================
// Submission Subscriptions
// =============================================================================

/**
 * Subscribe to new submissions in a sprint.
 *
 * @param sprintId - The sprint ID to watch
 * @param callback - Function called when submissions change
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = await subscribeToSubmissions(sprintId, (data) => {
 *   if (data.action === 'create' && data.record.status === 'submitted') {
 *     console.log('New submission!', data.record);
 *   }
 * });
 */
export async function subscribeToSubmissions(
  sprintId: string,
  callback: SubscriptionCallback<Submission>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.SUBMISSIONS).subscribe<Submission>(
    '*',
    (data) => {
      if (data.record.sprint_id === sprintId) {
        callback(data);
      }
    }
  );
}

/**
 * Subscribe to a specific submission's changes.
 *
 * @param submissionId - The submission ID to watch
 * @param callback - Function called when the submission changes
 * @returns Unsubscribe function
 */
export async function subscribeToSubmission(
  submissionId: string,
  callback: SubscriptionCallback<Submission>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.SUBMISSIONS).subscribe<Submission>(
    submissionId,
    callback
  );
}

// =============================================================================
// Sprint Subscriptions
// =============================================================================

/**
 * Subscribe to sprint status changes.
 *
 * @param sprintId - The sprint ID to watch
 * @param callback - Function called when sprint changes
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = await subscribeToSprintStatus(sprintId, (data) => {
 *   console.log('Sprint status:', data.record.status);
 * });
 */
export async function subscribeToSprintStatus(
  sprintId: string,
  callback: SubscriptionCallback<Sprint>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.SPRINTS).subscribe<Sprint>(
    sprintId,
    callback
  );
}

/**
 * Subscribe to all sprint changes.
 *
 * @param callback - Function called when any sprint changes
 * @returns Unsubscribe function
 */
export async function subscribeToSprints(
  callback: SubscriptionCallback<Sprint>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.SPRINTS).subscribe<Sprint>('*', callback);
}

// =============================================================================
// Participant Subscriptions
// =============================================================================

/**
 * Subscribe to participant changes in a sprint.
 *
 * @param sprintId - The sprint ID to watch
 * @param callback - Function called when participants change
 * @returns Unsubscribe function
 */
export async function subscribeToParticipants(
  sprintId: string,
  callback: SubscriptionCallback<SprintParticipant>
): Promise<UnsubscribeFunc> {
  return pb.collection(Collections.SPRINT_PARTICIPANTS).subscribe<SprintParticipant>(
    '*',
    (data) => {
      if (data.record.sprint_id === sprintId) {
        callback(data);
      }
    }
  );
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Unsubscribe from a specific collection.
 *
 * @param collection - The collection name to unsubscribe from
 * @param topic - Optional topic (record ID or '*')
 */
export async function unsubscribe(
  collection: string,
  topic?: string
): Promise<void> {
  if (topic) {
    await pb.collection(collection).unsubscribe(topic);
  } else {
    await pb.collection(collection).unsubscribe();
  }
}

/**
 * Unsubscribe from all real-time subscriptions.
 * Use this when unmounting components or cleaning up.
 */
export function unsubscribeAll(): void {
  pb.realtime.unsubscribe();
}

/**
 * Check if the real-time connection is active.
 *
 * @returns True if connected
 */
export function isRealtimeConnected(): boolean {
  return pb.realtime.isConnected;
}
