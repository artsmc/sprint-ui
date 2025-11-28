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
  SprintWithRelations,
  ListResult,
  User,
} from '@/lib/types';
import { Collections } from '@/lib/types';

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Validate PocketBase record ID format.
 * PocketBase IDs are 15-character alphanumeric strings.
 *
 * @param id - The ID to validate
 * @throws Error if the ID format is invalid
 */
function validateRecordId(id: string): void {
  if (!/^[a-zA-Z0-9]{15}$/.test(id)) {
    throw new Error(`Invalid record ID format: ${id}`);
  }
}

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
    sort: '-sprint_number',
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
    sort: '-sprint_number',
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
        sort: '-sprint_number',
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
          sort: '-sprint_number',
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
  try {
    // Validate challenge_id format before database operation
    validateRecordId(data.challenge_id);

    // Get current authenticated user ID
    const currentUserId = pb.authStore.model?.id || null;
    console.log('Current user ID:', currentUserId);
    console.log('Auth store:', pb.authStore);

    // Set started_by_id if status is active and user is authenticated
    const startedById = data.status === 'active' && currentUserId ? currentUserId : null;

    // Build sprint data, omitting null fields to avoid potential issues
    const sprintData: Record<string, any> = {
      sprint_number: data.sprint_number,
      name: data.name,
      challenge_id: data.challenge_id,
      status: data.status || 'scheduled',
      duration_days: data.duration_days || 14,
    };

    // Only add optional fields if they have values
    if (data.start_at) sprintData.start_at = data.start_at;
    if (data.end_at) sprintData.end_at = data.end_at;
    if (data.voting_end_at) sprintData.voting_end_at = data.voting_end_at;
    if (data.retro_day) sprintData.retro_day = data.retro_day;
    if (startedById) sprintData.started_by_id = startedById;

    console.log('Creating sprint with data:', sprintData);

    // Check if sprint_number already exists (to provide better error message)
    const existing = await pb.collection(Collections.SPRINTS).getFullList({
      filter: `sprint_number=${sprintData.sprint_number}`,
      fields: 'id,sprint_number,name',
    });
    if (existing.length > 0) {
      console.warn('Sprint number already exists:', existing);
      throw new Error(`Sprint #${sprintData.sprint_number} already exists. Please refresh and try again.`);
    }

    // Try to get collection info for debugging
    console.log('Attempting to create sprint in collection:', Collections.SPRINTS);

    const result = await pb.collection(Collections.SPRINTS).create<Sprint>(sprintData);
    console.log('Sprint created successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to create sprint:', error);
    console.error('Sprint data:', data);

    // PocketBase returns validation errors in error.data.data format
    if (error && typeof error === 'object' && 'data' in error) {
      const pbError = error as any;
      console.error('PocketBase error details:', pbError.data);

      if (pbError.data?.data) {
        // Format validation errors
        const validationErrors = Object.entries(pbError.data.data)
          .map(([field, error]) => `${field}: ${(error as any).message}`)
          .join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }
    }

    throw new Error(
      `Failed to create sprint: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
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

// =============================================================================
// Sprint Statistics Functions
// =============================================================================

/**
 * Get sprint statistics including submission counts and participation rate.
 *
 * @param sprintId - The sprint ID to get statistics for
 * @returns Sprint statistics with submission and participation data
 *
 * @example
 * const stats = await getSprintStatistics('abc123');
 * console.log(`Participation rate: ${stats.participationRate}%`);
 */
export async function getSprintStatistics(sprintId: string): Promise<{
  submissionsCount: number;
  yetToSubmitCount: number;
  participationRate: number;
  totalParticipants: number;
}> {
  // Validate sprintId to prevent filter injection
  validateRecordId(sprintId);

  // Get total participants for this sprint
  const participants = await pb
    .collection(Collections.SPRINT_PARTICIPANTS)
    .getFullList({
      filter: `sprint_id='${sprintId}'`,
    });

  const totalParticipants = participants.length;

  // Get submissions for this sprint
  const submissions = await pb
    .collection(Collections.SUBMISSIONS)
    .getFullList({
      filter: `sprint_id='${sprintId}' && status='submitted'`,
    });

  const submissionsCount = submissions.length;
  const yetToSubmitCount = Math.max(0, totalParticipants - submissionsCount);
  const participationRate =
    totalParticipants > 0
      ? Math.round((submissionsCount / totalParticipants) * 100)
      : 0;

  return {
    submissionsCount,
    yetToSubmitCount,
    participationRate,
    totalParticipants,
  };
}

/**
 * Extend sprint end date by specified days.
 * Requires admin authentication.
 *
 * @param sprintId - The sprint ID to extend
 * @param extensionDays - Number of days to extend the sprint by
 * @returns The updated sprint record
 *
 * @example
 * const sprint = await extendSprint('abc123', 3);
 * console.log('Sprint extended by 3 days');
 */
export async function extendSprint(
  sprintId: string,
  extensionDays: number
): Promise<Sprint> {
  const sprint = await getSprint(sprintId);

  if (!sprint.end_at) {
    throw new Error('Cannot extend sprint: no end date set');
  }

  const currentEndDate = new Date(sprint.end_at);
  const newEndDate = new Date(
    currentEndDate.getTime() + extensionDays * 24 * 60 * 60 * 1000
  );

  return pb.collection(Collections.SPRINTS).update<Sprint>(sprintId, {
    end_at: newEndDate.toISOString(),
    duration_days: sprint.duration_days + extensionDays,
  });
}

/**
 * End the current sprint (admin only).
 * Transitions sprint status to appropriate next phase.
 *
 * @param sprintId - The sprint ID to end
 * @param userId - Optional ID of the user ending the sprint
 * @returns The updated sprint record
 *
 * @example
 * const sprint = await endSprint('abc123', 'user456');
 */
export async function endSprint(
  sprintId: string,
  userId?: string
): Promise<Sprint> {
  const sprint = await getSprint(sprintId);

  // Transition based on current status
  if (sprint.status === 'active') {
    return transitionToVoting(sprintId);
  } else if (sprint.status === 'voting') {
    return transitionToRetro(sprintId);
  } else if (sprint.status === 'retro') {
    return completeSprint(sprintId, userId);
  }

  throw new Error(
    `Cannot end sprint: current status is '${sprint.status}'`
  );
}

/**
 * Get last update metadata for a sprint.
 *
 * @param sprintId - The sprint ID to get metadata for
 * @returns Last update information or null if no updates
 *
 * @example
 * const lastUpdate = await getSprintLastUpdate('abc123');
 * if (lastUpdate) {
 *   console.log(`Updated by ${lastUpdate.updatedBy?.name}`);
 * }
 */
export async function getSprintLastUpdate(sprintId: string): Promise<{
  updatedBy: User | null;
  updatedAt: string;
} | null> {
  const sprint = await pb
    .collection(Collections.SPRINTS)
    .getOne<SprintWithRelations>(sprintId, {
      expand: 'ended_by_id,started_by_id',
    });

  if (!sprint) {
    return null;
  }

  // Determine who last updated the sprint
  const updatedBy =
    sprint.expand?.ended_by_id ||
    sprint.expand?.started_by_id ||
    null;

  return {
    updatedBy,
    updatedAt: sprint.updated,
  };
}

// =============================================================================
// Sprint Date Validation Functions
// =============================================================================

/**
 * Validation result for sprint date checks.
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  conflictingSprint?: Sprint;
}

/**
 * Get sprints that overlap with the specified date range.
 * Only checks sprints with status: active, scheduled, voting, or retro.
 *
 * Overlap detection algorithm: (start1 <= end2) AND (end1 >= start2)
 *
 * @param startDate - Start date of the range to check
 * @param endDate - End date of the range to check
 * @returns Array of overlapping sprints
 *
 * @example
 * const overlaps = await getOverlappingSprints(
 *   new Date('2025-02-01'),
 *   new Date('2025-02-15')
 * );
 */
export async function getOverlappingSprints(
  startDate: Date,
  endDate: Date
): Promise<Sprint[]> {
  // Validate that dates are valid Date objects
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error('Invalid start date');
  }
  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    throw new Error('Invalid end date');
  }

  const startISO = startDate.toISOString();
  const endISO = endDate.toISOString();

  // Query sprints with status that should not overlap
  const relevantStatuses: SprintStatus[] = ['active', 'scheduled', 'voting', 'retro'];
  const statusFilter = relevantStatuses.map((s) => `status='${s}'`).join(' || ');

  try {
    const sprints = await pb
      .collection(Collections.SPRINTS)
      .getFullList<Sprint>({
        filter: `(${statusFilter}) && start_at != null && end_at != null`,
      });

    // Filter sprints that overlap with the specified date range
    // Overlap condition: (start1 <= end2) AND (end1 >= start2)
    const overlappingSprints = sprints.filter((sprint) => {
      if (!sprint.start_at || !sprint.end_at) {
        return false;
      }

      const sprintStart = new Date(sprint.start_at);
      const sprintEnd = new Date(sprint.end_at);

      // Check overlap: (sprintStart <= endDate) AND (sprintEnd >= startDate)
      return sprintStart <= endDate && sprintEnd >= startDate;
    });

    return overlappingSprints;
  } catch (error) {
    throw new Error(
      `Failed to check for overlapping sprints: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Validate sprint dates to ensure they don't overlap with existing sprints.
 * Checks that:
 * - End date is after start date
 * - No overlap with active, scheduled, voting, or retro sprints
 *
 * @param startDate - Proposed start date
 * @param endDate - Proposed end date
 * @returns Validation result with error details if invalid
 *
 * @example
 * const result = await validateSprintDates(
 *   new Date('2025-02-01'),
 *   new Date('2025-02-15')
 * );
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export async function validateSprintDates(
  startDate: Date,
  endDate: Date
): Promise<ValidationResult> {
  // Validate that end date is after start date
  if (endDate <= startDate) {
    return {
      valid: false,
      error: 'End date must be after start date',
    };
  }

  // Check for overlapping sprints
  const overlappingSprints = await getOverlappingSprints(startDate, endDate);

  if (overlappingSprints.length > 0) {
    const conflictingSprint = overlappingSprints[0];
    const formatDate = (date: string) => {
      return new Date(date).toISOString().split('T')[0];
    };

    const statusLabel = getStatusLabel(conflictingSprint.status);
    const startStr = conflictingSprint.start_at
      ? formatDate(conflictingSprint.start_at)
      : 'N/A';
    const endStr = conflictingSprint.end_at
      ? formatDate(conflictingSprint.end_at)
      : 'N/A';

    return {
      valid: false,
      error: `Sprint dates overlap with ${conflictingSprint.name} (${statusLabel.toLowerCase()} from ${startStr} to ${endStr})`,
      conflictingSprint,
    };
  }

  return {
    valid: true,
  };
}
