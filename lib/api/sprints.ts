/**
 * Sprints Service
 *
 * API service for sprint operations.
 * Handles CRUD operations and status transitions for biweekly design sprints.
 *
 * Sprint Lifecycle: scheduled -> active -> voting -> retro -> completed
 * (cancelled can be set from scheduled or active states)
 */

import pb from '@/lib/pocketbase';
import type {
  Sprint,
  SprintStatus,
  SprintWithChallenge,
  ListResult,
} from '@/lib/types';
import { Collections } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

/**
 * Data required to create a new sprint.
 */
export interface CreateSprintData {
  sprint_number: number;
  name: string;
  challenge_id: string;
  status?: SprintStatus;
  start_at?: string | null;
  end_at?: string | null;
  voting_end_at?: string | null;
  retro_day?: string | null;
  duration_days?: number;
}

/**
 * Data for updating an existing sprint.
 * All fields are optional.
 */
export interface UpdateSprintData {
  sprint_number?: number;
  name?: string;
  challenge_id?: string;
  status?: SprintStatus;
  start_at?: string | null;
  end_at?: string | null;
  voting_end_at?: string | null;
  retro_day?: string | null;
  duration_days?: number;
  started_by_id?: string | null;
  ended_by_id?: string | null;
}

/**
 * Filter options for listing sprints.
 */
export interface SprintFilter {
  status?: SprintStatus;
  challenge_id?: string;
  before?: string;
  after?: string;
}

// =============================================================================
// List & Query Functions
// =============================================================================

/**
 * List sprints with optional pagination and filtering.
 *
 * @param page - Page number (1-indexed), defaults to 1
 * @param perPage - Number of items per page, defaults to 20
 * @param filter - Optional PocketBase filter string
 * @returns Paginated list of sprints
 *
 * @example
 * // Get first page of all sprints
 * const sprints = await listSprints();
 *
 * @example
 * // Get sprints with custom filter
 * const sprints = await listSprints(1, 10, "status='active'");
 */
export async function listSprints(
  page: number = 1,
  perPage: number = 20,
  filter?: string
): Promise<ListResult<Sprint>> {
  return pb.collection(Collections.SPRINTS).getList<Sprint>(page, perPage, {
    filter,
    sort: '-created',
  });
}

/**
 * Get a single sprint by ID.
 *
 * @param id - The sprint ID
 * @returns The sprint record
 * @throws Error if sprint not found
 *
 * @example
 * const sprint = await getSprint('abc123');
 */
export async function getSprint(id: string): Promise<Sprint> {
  return pb.collection(Collections.SPRINTS).getOne<Sprint>(id);
}

/**
 * Get a sprint with its expanded challenge relation.
 *
 * @param id - The sprint ID
 * @returns The sprint with expanded challenge data
 * @throws Error if sprint not found
 *
 * @example
 * const sprint = await getSprintWithChallenge('abc123');
 * console.log(sprint.expand?.challenge_id.title);
 */
export async function getSprintWithChallenge(
  id: string
): Promise<SprintWithChallenge> {
  return pb.collection(Collections.SPRINTS).getOne<SprintWithChallenge>(id, {
    expand: 'challenge_id',
  });
}

/**
 * Get sprints filtered by status.
 *
 * @param status - The sprint status to filter by
 * @param page - Page number (1-indexed), defaults to 1
 * @param perPage - Number of items per page, defaults to 20
 * @returns Paginated list of sprints with the specified status
 *
 * @example
 * const activeSprints = await getSprintsByStatus('active');
 */
export async function getSprintsByStatus(
  status: SprintStatus,
  page: number = 1,
  perPage: number = 20
): Promise<ListResult<Sprint>> {
  return pb.collection(Collections.SPRINTS).getList<Sprint>(page, perPage, {
    filter: `status='${status}'`,
    sort: '-created',
  });
}

/**
 * Get the currently active sprint.
 * Returns the most recent sprint with status='active'.
 *
 * @returns The active sprint or null if none exists
 *
 * @example
 * const sprint = await getActiveSprint();
 * if (sprint) {
 *   console.log('Active sprint:', sprint.name);
 * }
 */
export async function getActiveSprint(): Promise<Sprint | null> {
  try {
    return await pb
      .collection(Collections.SPRINTS)
      .getFirstListItem<Sprint>("status='active'", {
        sort: '-created',
      });
  } catch {
    // getFirstListItem throws if no record found
    return null;
  }
}

/**
 * Get the current sprint (active, voting, or retro phase).
 * Returns the most recent sprint that is not scheduled, completed, or cancelled.
 *
 * @returns The current sprint or null if none exists
 *
 * @example
 * const sprint = await getCurrentSprint();
 * if (sprint) {
 *   console.log(`Current sprint is in ${sprint.status} phase`);
 * }
 */
export async function getCurrentSprint(): Promise<Sprint | null> {
  try {
    return await pb
      .collection(Collections.SPRINTS)
      .getFirstListItem<Sprint>(
        "status='active' || status='voting' || status='retro'",
        {
          sort: '-created',
        }
      );
  } catch {
    // getFirstListItem throws if no record found
    return null;
  }
}

// =============================================================================
// CRUD Functions (Admin Only)
// =============================================================================

/**
 * Create a new sprint.
 * Requires admin authentication.
 *
 * @param data - The sprint data
 * @returns The created sprint record
 *
 * @example
 * const sprint = await createSprint({
 *   sprint_number: 1,
 *   name: 'Sprint #1',
 *   challenge_id: 'challenge123',
 *   duration_days: 14,
 * });
 */
export async function createSprint(data: CreateSprintData): Promise<Sprint> {
  const sprintData = {
    sprint_number: data.sprint_number,
    name: data.name,
    challenge_id: data.challenge_id,
    status: data.status || 'scheduled',
    start_at: data.start_at || null,
    end_at: data.end_at || null,
    voting_end_at: data.voting_end_at || null,
    retro_day: data.retro_day || null,
    duration_days: data.duration_days || 14,
    started_by_id: null,
    ended_by_id: null,
  };

  return pb.collection(Collections.SPRINTS).create<Sprint>(sprintData);
}

/**
 * Update an existing sprint.
 * Requires admin authentication.
 *
 * @param id - The sprint ID to update
 * @param data - Partial sprint data to update
 * @returns The updated sprint record
 *
 * @example
 * const sprint = await updateSprint('abc123', {
 *   name: 'Updated Sprint Name',
 *   duration_days: 21,
 * });
 */
export async function updateSprint(
  id: string,
  data: UpdateSprintData
): Promise<Sprint> {
  return pb.collection(Collections.SPRINTS).update<Sprint>(id, data);
}

/**
 * Delete a sprint.
 * Requires admin authentication.
 * Warning: This will fail if the sprint has related records (participants, submissions, etc.)
 *
 * @param id - The sprint ID to delete
 *
 * @example
 * await deleteSprint('abc123');
 */
export async function deleteSprint(id: string): Promise<void> {
  await pb.collection(Collections.SPRINTS).delete(id);
}

// =============================================================================
// Status Transition Functions
// =============================================================================

/**
 * Activate a scheduled sprint.
 * Transitions status from 'scheduled' to 'active'.
 * Requires admin authentication.
 *
 * @param id - The sprint ID to activate
 * @param userId - Optional ID of the user activating the sprint
 * @returns The updated sprint record
 * @throws Error if sprint is not in 'scheduled' status
 *
 * @example
 * const sprint = await activateSprint('abc123', 'user456');
 */
export async function activateSprint(
  id: string,
  userId?: string
): Promise<Sprint> {
  const sprint = await getSprint(id);

  if (sprint.status !== 'scheduled') {
    throw new Error(
      `Cannot activate sprint: current status is '${sprint.status}', expected 'scheduled'`
    );
  }

  const updateData: UpdateSprintData = {
    status: 'active',
    start_at: new Date().toISOString(),
  };

  if (userId) {
    updateData.started_by_id = userId;
  }

  return pb.collection(Collections.SPRINTS).update<Sprint>(id, updateData);
}

/**
 * Transition a sprint to voting phase.
 * Transitions status from 'active' to 'voting'.
 * Requires admin authentication.
 *
 * @param id - The sprint ID to transition
 * @returns The updated sprint record
 * @throws Error if sprint is not in 'active' status
 *
 * @example
 * const sprint = await transitionToVoting('abc123');
 */
export async function transitionToVoting(id: string): Promise<Sprint> {
  const sprint = await getSprint(id);

  if (sprint.status !== 'active') {
    throw new Error(
      `Cannot transition to voting: current status is '${sprint.status}', expected 'active'`
    );
  }

  return pb.collection(Collections.SPRINTS).update<Sprint>(id, {
    status: 'voting',
    end_at: new Date().toISOString(),
  });
}

/**
 * Transition a sprint to retrospective phase.
 * Transitions status from 'voting' to 'retro'.
 * Requires admin authentication.
 *
 * @param id - The sprint ID to transition
 * @returns The updated sprint record
 * @throws Error if sprint is not in 'voting' status
 *
 * @example
 * const sprint = await transitionToRetro('abc123');
 */
export async function transitionToRetro(id: string): Promise<Sprint> {
  const sprint = await getSprint(id);

  if (sprint.status !== 'voting') {
    throw new Error(
      `Cannot transition to retro: current status is '${sprint.status}', expected 'voting'`
    );
  }

  return pb.collection(Collections.SPRINTS).update<Sprint>(id, {
    status: 'retro',
    voting_end_at: new Date().toISOString(),
  });
}

/**
 * Complete a sprint.
 * Transitions status from 'retro' to 'completed'.
 * Requires admin authentication.
 *
 * @param id - The sprint ID to complete
 * @param userId - Optional ID of the user completing the sprint
 * @returns The updated sprint record
 * @throws Error if sprint is not in 'retro' status
 *
 * @example
 * const sprint = await completeSprint('abc123', 'user456');
 */
export async function completeSprint(
  id: string,
  userId?: string
): Promise<Sprint> {
  const sprint = await getSprint(id);

  if (sprint.status !== 'retro') {
    throw new Error(
      `Cannot complete sprint: current status is '${sprint.status}', expected 'retro'`
    );
  }

  const updateData: UpdateSprintData = {
    status: 'completed',
    retro_day: new Date().toISOString().split('T')[0],
  };

  if (userId) {
    updateData.ended_by_id = userId;
  }

  return pb.collection(Collections.SPRINTS).update<Sprint>(id, updateData);
}

/**
 * Cancel a sprint.
 * Can only cancel sprints in 'scheduled' or 'active' status.
 * Requires admin authentication.
 *
 * @param id - The sprint ID to cancel
 * @param userId - Optional ID of the user cancelling the sprint
 * @returns The updated sprint record
 * @throws Error if sprint cannot be cancelled from current status
 *
 * @example
 * const sprint = await cancelSprint('abc123', 'user456');
 */
export async function cancelSprint(
  id: string,
  userId?: string
): Promise<Sprint> {
  const sprint = await getSprint(id);

  const cancellableStatuses: SprintStatus[] = ['scheduled', 'active'];
  if (!cancellableStatuses.includes(sprint.status)) {
    throw new Error(
      `Cannot cancel sprint: current status is '${sprint.status}', can only cancel from 'scheduled' or 'active'`
    );
  }

  const updateData: UpdateSprintData = {
    status: 'cancelled',
  };

  if (userId) {
    updateData.ended_by_id = userId;
  }

  return pb.collection(Collections.SPRINTS).update<Sprint>(id, updateData);
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get the next sprint number.
 * Finds the highest existing sprint number and adds 1.
 *
 * @returns The next available sprint number
 *
 * @example
 * const nextNumber = await getNextSprintNumber();
 * console.log(`Next sprint will be #${nextNumber}`);
 */
export async function getNextSprintNumber(): Promise<number> {
  try {
    const result = await pb
      .collection(Collections.SPRINTS)
      .getList<Sprint>(1, 1, {
        sort: '-sprint_number',
      });

    if (result.items.length === 0) {
      return 1;
    }

    return result.items[0].sprint_number + 1;
  } catch {
    return 1;
  }
}

/**
 * Check if a sprint is currently accepting submissions.
 * A sprint accepts submissions only when in 'active' status.
 *
 * @param sprint - The sprint to check
 * @returns True if the sprint is accepting submissions
 *
 * @example
 * if (isAcceptingSubmissions(sprint)) {
 *   // Show submission form
 * }
 */
export function isAcceptingSubmissions(sprint: Sprint): boolean {
  return sprint.status === 'active';
}

/**
 * Check if a sprint is currently accepting votes.
 * A sprint accepts votes only when in 'voting' status.
 *
 * @param sprint - The sprint to check
 * @returns True if the sprint is accepting votes
 *
 * @example
 * if (isAcceptingVotes(sprint)) {
 *   // Show voting interface
 * }
 */
export function isAcceptingVotes(sprint: Sprint): boolean {
  return sprint.status === 'voting';
}

/**
 * Check if a sprint is in an active phase (not scheduled, completed, or cancelled).
 *
 * @param sprint - The sprint to check
 * @returns True if the sprint is in an active phase
 *
 * @example
 * if (isSprintInProgress(sprint)) {
 *   // Show sprint dashboard
 * }
 */
export function isSprintInProgress(sprint: Sprint): boolean {
  const activeStatuses: SprintStatus[] = ['active', 'voting', 'retro'];
  return activeStatuses.includes(sprint.status);
}

/**
 * Get the display label for a sprint status.
 *
 * @param status - The sprint status
 * @returns Human-readable status label
 *
 * @example
 * const label = getStatusLabel('voting'); // 'Voting'
 */
export function getStatusLabel(status: SprintStatus): string {
  const labels: Record<SprintStatus, string> = {
    scheduled: 'Scheduled',
    active: 'Active',
    voting: 'Voting',
    retro: 'Retrospective',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return labels[status];
}
