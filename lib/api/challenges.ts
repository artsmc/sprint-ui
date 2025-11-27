/**
 * Challenges Service
 *
 * API service for challenge operations.
 * Handles CRUD operations for design challenges.
 *
 * Note: Create, update, and delete operations are admin-only
 * as enforced by PocketBase API rules.
 */

import pb from '@/lib/pocketbase';
import type { Challenge, ListResult } from '@/lib/types';
import { Collections } from '@/lib/types';
import { filterContains, filterOr } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Data required to create a new challenge.
 */
export interface CreateChallengeData {
  challenge_number: number;
  title: string;
  brief: string;
}

/**
 * Data for updating an existing challenge.
 * All fields are optional.
 */
export interface UpdateChallengeData {
  challenge_number?: number;
  title?: string;
  brief?: string;
}

/**
 * Options for listing challenges.
 */
export interface ListChallengesOptions {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
}

// =============================================================================
// List Functions
// =============================================================================

/**
 * List all challenges with pagination.
 *
 * @param page - Page number (1-indexed, defaults to 1)
 * @param perPage - Number of items per page (defaults to 30)
 * @returns Paginated list of challenges
 *
 * @example
 * const challenges = await listChallenges(1, 10);
 * console.log(challenges.items); // Array of Challenge
 * console.log(challenges.totalPages); // Total number of pages
 */
export async function listChallenges(
  page: number = 1,
  perPage: number = 30
): Promise<ListResult<Challenge>> {
  return pb.collection(Collections.CHALLENGES).getList<Challenge>(page, perPage, {
    sort: 'challenge_number',
  });
}

/**
 * List challenges with advanced options.
 *
 * @param options - Listing options including pagination, sorting, and filtering
 * @returns Paginated list of challenges
 *
 * @example
 * const challenges = await listChallengesWithOptions({
 *   page: 1,
 *   perPage: 20,
 *   sort: '-created',
 *   filter: 'title ~ "dashboard"'
 * });
 */
export async function listChallengesWithOptions(
  options: ListChallengesOptions = {}
): Promise<ListResult<Challenge>> {
  const { page = 1, perPage = 30, sort = 'challenge_number', filter = '' } = options;

  return pb.collection(Collections.CHALLENGES).getList<Challenge>(page, perPage, {
    sort,
    filter,
  });
}

/**
 * Get all challenges without pagination.
 * Use with caution for large datasets.
 *
 * @returns Array of all challenges
 *
 * @example
 * const allChallenges = await getAllChallenges();
 */
export async function getAllChallenges(): Promise<Challenge[]> {
  return pb.collection(Collections.CHALLENGES).getFullList<Challenge>({
    sort: 'challenge_number',
  });
}

// =============================================================================
// Read Functions
// =============================================================================

/**
 * Get a challenge by its ID.
 *
 * @param id - The challenge record ID
 * @returns The challenge record
 * @throws Error if challenge not found
 *
 * @example
 * const challenge = await getChallenge('abc123');
 */
export async function getChallenge(id: string): Promise<Challenge> {
  return pb.collection(Collections.CHALLENGES).getOne<Challenge>(id);
}

/**
 * Get a challenge by its challenge number.
 *
 * @param challengeNumber - The unique challenge number (1-100)
 * @returns The challenge record
 * @throws Error if challenge not found
 *
 * @example
 * const challenge = await getChallengeByNumber(42);
 */
export async function getChallengeByNumber(challengeNumber: number): Promise<Challenge> {
  return pb.collection(Collections.CHALLENGES).getFirstListItem<Challenge>(
    `challenge_number = ${challengeNumber}`
  );
}

/**
 * Get a random challenge.
 * Useful for random challenge selection or "surprise me" features.
 *
 * @returns A randomly selected challenge
 * @throws Error if no challenges exist
 *
 * @example
 * const randomChallenge = await getRandomChallenge();
 */
export async function getRandomChallenge(): Promise<Challenge> {
  // Get total count of challenges
  const result = await pb.collection(Collections.CHALLENGES).getList<Challenge>(1, 1);
  const totalItems = result.totalItems;

  if (totalItems === 0) {
    throw new Error('No challenges available');
  }

  // Generate random page number (1-indexed)
  const randomPage = Math.floor(Math.random() * totalItems) + 1;

  // Fetch single random challenge
  const randomResult = await pb
    .collection(Collections.CHALLENGES)
    .getList<Challenge>(randomPage, 1);

  return randomResult.items[0];
}

// =============================================================================
// Admin Write Functions
// =============================================================================

/**
 * Create a new challenge.
 * Requires admin authentication as enforced by API rules.
 *
 * @param data - Challenge data including number, title, and brief
 * @returns The created challenge record
 *
 * @example
 * const challenge = await createChallenge({
 *   challenge_number: 101,
 *   title: 'E-commerce Checkout',
 *   brief: '<p>Design a checkout flow...</p>'
 * });
 */
export async function createChallenge(data: CreateChallengeData): Promise<Challenge> {
  return pb.collection(Collections.CHALLENGES).create<Challenge>(data);
}

/**
 * Update an existing challenge.
 * Requires admin authentication as enforced by API rules.
 *
 * @param id - The challenge record ID
 * @param data - Partial challenge data to update
 * @returns The updated challenge record
 *
 * @example
 * const updated = await updateChallenge('abc123', {
 *   title: 'Updated Title'
 * });
 */
export async function updateChallenge(
  id: string,
  data: UpdateChallengeData
): Promise<Challenge> {
  return pb.collection(Collections.CHALLENGES).update<Challenge>(id, data);
}

/**
 * Delete a challenge.
 * Requires admin authentication as enforced by API rules.
 *
 * @param id - The challenge record ID
 * @returns True if deletion was successful
 *
 * @example
 * await deleteChallenge('abc123');
 */
export async function deleteChallenge(id: string): Promise<boolean> {
  return pb.collection(Collections.CHALLENGES).delete(id);
}

// =============================================================================
// Search Functions
// =============================================================================

/**
 * Search challenges by title.
 *
 * @param query - Search query string
 * @param page - Page number (defaults to 1)
 * @param perPage - Items per page (defaults to 30)
 * @returns Paginated list of matching challenges
 *
 * @example
 * const results = await searchChallenges('dashboard');
 */
export async function searchChallenges(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<ListResult<Challenge>> {
  const filter = filterOr([
    filterContains('title', query),
    filterContains('brief', query),
  ]);

  return pb.collection(Collections.CHALLENGES).getList<Challenge>(page, perPage, {
    filter,
    sort: 'challenge_number',
  });
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get the total count of challenges.
 *
 * @returns Total number of challenges
 *
 * @example
 * const count = await getChallengeCount();
 */
export async function getChallengeCount(): Promise<number> {
  const result = await pb.collection(Collections.CHALLENGES).getList<Challenge>(1, 1);
  return result.totalItems;
}

/**
 * Check if a challenge number is available (not already used).
 *
 * @param challengeNumber - The challenge number to check
 * @returns True if the number is available, false if already used
 *
 * @example
 * const isAvailable = await isChallengeNumberAvailable(101);
 */
export async function isChallengeNumberAvailable(
  challengeNumber: number
): Promise<boolean> {
  try {
    await getChallengeByNumber(challengeNumber);
    return false; // Challenge exists, number is not available
  } catch {
    return true; // Challenge doesn't exist, number is available
  }
}
