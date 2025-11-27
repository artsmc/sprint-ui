/**
 * Badges API Service
 *
 * API service for badge-related operations.
 * Handles badge lookup, awarding badges to users, and querying badge achievements.
 */

import pb from '@/lib/pocketbase';
import type {
  Badge,
  UserBadge,
  UserBadgeWithRelations,
} from '@/lib/types';
import { Collections } from '@/lib/types';
import { getCurrentUser } from '@/lib/api/auth';

// =============================================================================
// Types
// =============================================================================

/**
 * Data required to award a badge to a user.
 */
export interface AwardBadgeData {
  userId: string;
  badgeId: string;
  sprintId?: string;
}

/**
 * Recently awarded badge with expanded relations for display.
 */
export type RecentBadgeAward = UserBadgeWithRelations;

// =============================================================================
// Badge Lookup Functions
// =============================================================================

/**
 * List all available badges.
 *
 * @returns Array of all badge records sorted by name
 */
export async function listBadges(): Promise<Badge[]> {
  const result = await pb.collection(Collections.BADGES).getFullList<Badge>({
    sort: 'name',
  });

  return result;
}

/**
 * Get a badge by its ID.
 *
 * @param id - The badge ID
 * @returns The badge record
 * @throws Error if badge not found
 */
export async function getBadge(id: string): Promise<Badge> {
  return pb.collection(Collections.BADGES).getOne<Badge>(id);
}

/**
 * Get a badge by its slug.
 *
 * @param slug - The badge slug (e.g., 'first-submission', 'feedback-champion')
 * @returns The badge record
 * @throws Error if badge not found
 */
export async function getBadgeBySlug(slug: string): Promise<Badge> {
  return pb.collection(Collections.BADGES).getFirstListItem<Badge>(
    `slug = "${slug}"`
  );
}

// =============================================================================
// Badge Award Functions
// =============================================================================

/**
 * Award a badge to a user.
 *
 * Creates a user_badges record linking the user to the badge.
 * This is typically called by admin actions or system automation.
 *
 * @param userId - The user ID to award the badge to
 * @param badgeId - The badge ID to award
 * @param sprintId - Optional sprint ID if the badge was earned during a specific sprint
 * @returns The created user badge record
 * @throws Error if the user already has this badge
 */
export async function awardBadge(
  userId: string,
  badgeId: string,
  sprintId?: string
): Promise<UserBadge> {
  // Check if user already has this badge
  const existingBadges = await pb
    .collection(Collections.USER_BADGES)
    .getFullList<UserBadge>({
      filter: `user_id = "${userId}" && badge_id = "${badgeId}"`,
    });

  if (existingBadges.length > 0) {
    throw new Error('User already has this badge');
  }

  // Create the user badge record
  const userBadgeData: Record<string, unknown> = {
    user_id: userId,
    badge_id: badgeId,
    awarded_at: new Date().toISOString(),
  };

  if (sprintId) {
    userBadgeData.sprint_id = sprintId;
  }

  return pb.collection(Collections.USER_BADGES).create<UserBadge>(userBadgeData);
}

/**
 * Award a badge to a user by badge slug.
 *
 * Convenience function that looks up the badge by slug before awarding.
 *
 * @param userId - The user ID to award the badge to
 * @param badgeSlug - The badge slug (e.g., 'first-submission')
 * @param sprintId - Optional sprint ID if the badge was earned during a specific sprint
 * @returns The created user badge record
 * @throws Error if badge not found or user already has this badge
 */
export async function awardBadgeBySlug(
  userId: string,
  badgeSlug: string,
  sprintId?: string
): Promise<UserBadge> {
  const badge = await getBadgeBySlug(badgeSlug);
  return awardBadge(userId, badge.id, sprintId);
}

// =============================================================================
// User Badge Query Functions
// =============================================================================

/**
 * Get all badges earned by a user.
 *
 * Returns the basic user_badges records without expanded relations.
 * For badge details, use getUserBadgesWithDetails() instead.
 *
 * @param userId - The user ID (defaults to current user if not provided)
 * @returns Array of user badge records sorted by awarded_at descending (most recent first)
 * @throws Error if no userId provided and user is not authenticated
 */
export async function getUserBadges(userId?: string): Promise<UserBadge[]> {
  const targetUserId = userId ?? getCurrentUser()?.id;

  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  return pb.collection(Collections.USER_BADGES).getFullList<UserBadge>({
    filter: `user_id = "${targetUserId}"`,
    sort: '-awarded_at',
  });
}

/**
 * Get all badges earned by a user with expanded badge details.
 *
 * Includes the full badge record (name, description, icon) for each earned badge.
 *
 * @param userId - The user ID (defaults to current user if not provided)
 * @returns Array of user badge records with expanded badge_id relation
 * @throws Error if no userId provided and user is not authenticated
 */
export async function getUserBadgesWithDetails(
  userId?: string
): Promise<UserBadgeWithRelations[]> {
  const targetUserId = userId ?? getCurrentUser()?.id;

  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  return pb.collection(Collections.USER_BADGES).getFullList<UserBadgeWithRelations>({
    filter: `user_id = "${targetUserId}"`,
    expand: 'badge_id,sprint_id',
    sort: '-awarded_at',
  });
}

/**
 * Check if a user has earned a specific badge.
 *
 * @param badgeSlug - The badge slug to check
 * @param userId - The user ID (defaults to current user if not provided)
 * @returns True if the user has earned the badge, false otherwise
 * @throws Error if no userId provided and user is not authenticated
 */
export async function hasUserBadge(
  badgeSlug: string,
  userId?: string
): Promise<boolean> {
  const targetUserId = userId ?? getCurrentUser()?.id;

  if (!targetUserId) {
    throw new Error('User ID required or must be authenticated');
  }

  // First get the badge by slug
  let badge: Badge;
  try {
    badge = await getBadgeBySlug(badgeSlug);
  } catch {
    // Badge doesn't exist, so user can't have it
    return false;
  }

  // Check if user has this badge
  const userBadges = await pb
    .collection(Collections.USER_BADGES)
    .getFullList<UserBadge>({
      filter: `user_id = "${targetUserId}" && badge_id = "${badge.id}"`,
    });

  return userBadges.length > 0;
}

// =============================================================================
// Badge Analytics Functions
// =============================================================================

/**
 * Get all users who have earned a specific badge.
 *
 * Returns user badge records with expanded user details.
 *
 * @param badgeId - The badge ID
 * @returns Array of user badge records with expanded user_id relation
 */
export async function getBadgeHolders(
  badgeId: string
): Promise<UserBadgeWithRelations[]> {
  return pb.collection(Collections.USER_BADGES).getFullList<UserBadgeWithRelations>({
    filter: `badge_id = "${badgeId}"`,
    expand: 'user_id',
    sort: '-awarded_at',
  });
}

/**
 * Get recently awarded badges across all users.
 *
 * Useful for displaying a feed of badge achievements on the platform.
 *
 * @param limit - Maximum number of badges to return (default: 10)
 * @returns Array of user badge records with expanded relations (user, badge, sprint)
 */
export async function getRecentBadges(
  limit: number = 10
): Promise<RecentBadgeAward[]> {
  const result = await pb
    .collection(Collections.USER_BADGES)
    .getList<RecentBadgeAward>(1, limit, {
      expand: 'user_id,badge_id,sprint_id',
      sort: '-awarded_at',
    });

  return result.items;
}
