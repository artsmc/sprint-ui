/**
 * XP Service
 *
 * API service for XP (Experience Points) operations.
 * Handles XP event creation, user XP tracking, and leaderboards.
 */

import pb from '@/lib/pocketbase';
import type { XPEvent, XPSourceType, UserXPSummary, User } from '@/lib/types';
import { Collections } from '@/lib/types';
import { getCurrentUser } from '@/lib/api/auth';
import { filterEquals, filterAnd } from '@/lib/utils';

// =============================================================================
// Constants
// =============================================================================

/**
 * Suggested XP amounts for each source type.
 */
export const XP_AMOUNTS: Record<XPSourceType, number> = {
  read_brief: 10,
  submit_design: 50,
  vote: 5,
  feedback: 15,
  reflection: 20,
  helpful_feedback: 10,
} as const;

// =============================================================================
// Types
// =============================================================================

/**
 * Leaderboard entry for XP rankings.
 */
export interface XPLeaderboardEntry {
  user_id: string;
  user_name: string;
  user_avatar: string;
  total_xp: number;
  rank: number;
}

/**
 * Sprint-specific leaderboard entry.
 */
export interface SprintXPLeaderboardEntry extends XPLeaderboardEntry {
  sprint_id: string;
}

// =============================================================================
// XP Event Functions
// =============================================================================

/**
 * Create a new XP event for a user.
 * This is typically called by admin or system processes.
 *
 * @param userId - The ID of the user receiving XP
 * @param sprintId - The ID of the sprint this XP is associated with
 * @param sourceType - The type of action that earned the XP
 * @param amount - The amount of XP to award
 * @param sourceId - Optional ID of the source record (e.g., submission_id, feedback_id)
 * @returns The created XP event record
 */
export async function createXPEvent(
  userId: string,
  sprintId: string,
  sourceType: XPSourceType,
  amount: number,
  sourceId?: string
): Promise<XPEvent> {
  const data = {
    user_id: userId,
    sprint_id: sprintId,
    source_type: sourceType,
    amount,
    source_id: sourceId ?? null,
  };

  return pb.collection(Collections.XP_EVENTS).create<XPEvent>(data);
}

/**
 * Get a user's XP events by source type.
 *
 * @param sourceType - The type of XP source to filter by
 * @param userId - Optional user ID (defaults to current user)
 * @returns Array of XP events for the specified source type
 */
export async function getXPEventsBySource(
  sourceType: XPSourceType,
  userId?: string
): Promise<XPEvent[]> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required - not authenticated');
  }

  const result = await pb.collection(Collections.XP_EVENTS).getFullList<XPEvent>({
    filter: filterAnd([
      filterEquals('user_id', targetUserId),
      filterEquals('source_type', sourceType),
    ]),
    sort: '-created',
  });

  return result;
}

/**
 * Get a user's XP events, ordered by most recent first.
 *
 * @param userId - Optional user ID (defaults to current user)
 * @param limit - Optional limit on number of events to return
 * @returns Array of XP events
 */
export async function getUserXPEvents(
  userId?: string,
  limit?: number
): Promise<XPEvent[]> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required - not authenticated');
  }

  if (limit !== undefined && limit > 0) {
    const result = await pb.collection(Collections.XP_EVENTS).getList<XPEvent>(1, limit, {
      filter: filterEquals('user_id', targetUserId),
      sort: '-created',
    });
    return result.items;
  }

  return pb.collection(Collections.XP_EVENTS).getFullList<XPEvent>({
    filter: filterEquals('user_id', targetUserId),
    sort: '-created',
  });
}

/**
 * Check if XP has already been awarded for a specific source.
 * Useful to prevent duplicate XP awards.
 *
 * @param sourceType - The type of XP source
 * @param sourceId - The ID of the source record
 * @param userId - Optional user ID (defaults to current user)
 * @returns True if XP has already been awarded for this source
 */
export async function hasEarnedXPForSource(
  sourceType: XPSourceType,
  sourceId: string,
  userId?: string
): Promise<boolean> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required - not authenticated');
  }

  const result = await pb.collection(Collections.XP_EVENTS).getList<XPEvent>(1, 1, {
    filter: filterAnd([
      filterEquals('user_id', targetUserId),
      filterEquals('source_type', sourceType),
      filterEquals('source_id', sourceId),
    ]),
  });

  return result.totalItems > 0;
}

// =============================================================================
// XP Aggregation Functions
// =============================================================================

/**
 * Get a user's total XP across all sprints.
 *
 * @param userId - Optional user ID (defaults to current user)
 * @returns The user's total XP amount
 */
export async function getUserXPTotal(userId?: string): Promise<number> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required - not authenticated');
  }

  const events = await pb.collection(Collections.XP_EVENTS).getFullList<XPEvent>({
    filter: filterEquals('user_id', targetUserId),
  });

  return events.reduce((total, event) => total + event.amount, 0);
}

/**
 * Get a user's XP for a specific sprint.
 *
 * @param sprintId - The ID of the sprint
 * @param userId - Optional user ID (defaults to current user)
 * @returns The user's XP amount for the specified sprint
 */
export async function getUserXPBySprint(
  sprintId: string,
  userId?: string
): Promise<number> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required - not authenticated');
  }

  const events = await pb.collection(Collections.XP_EVENTS).getFullList<XPEvent>({
    filter: filterAnd([
      filterEquals('user_id', targetUserId),
      filterEquals('sprint_id', sprintId),
    ]),
  });

  return events.reduce((total, event) => total + event.amount, 0);
}

/**
 * Get a comprehensive XP summary for a user.
 * Includes total XP, XP by source type, and XP by sprint.
 *
 * @param userId - Optional user ID (defaults to current user)
 * @returns User XP summary with breakdowns by source and sprint
 */
export async function getUserXPSummary(userId?: string): Promise<UserXPSummary> {
  const targetUserId = userId ?? getCurrentUser()?.id;
  if (!targetUserId) {
    throw new Error('User ID required - not authenticated');
  }

  const events = await pb.collection(Collections.XP_EVENTS).getFullList<XPEvent>({
    filter: filterEquals('user_id', targetUserId),
  });

  const xpBySource: Record<string, number> = {};
  const xpBySprint: Record<string, number> = {};
  let totalXp = 0;

  for (const event of events) {
    totalXp += event.amount;

    // Aggregate by source type
    if (xpBySource[event.source_type]) {
      xpBySource[event.source_type] += event.amount;
    } else {
      xpBySource[event.source_type] = event.amount;
    }

    // Aggregate by sprint
    if (xpBySprint[event.sprint_id]) {
      xpBySprint[event.sprint_id] += event.amount;
    } else {
      xpBySprint[event.sprint_id] = event.amount;
    }
  }

  return {
    user_id: targetUserId,
    total_xp: totalXp,
    xp_by_source: xpBySource,
    xp_by_sprint: xpBySprint,
  };
}

// =============================================================================
// Leaderboard Functions
// =============================================================================

/**
 * Get the global XP leaderboard (top users by total XP).
 * Uses pagination internally to handle large datasets efficiently.
 *
 * @param limit - Maximum number of entries to return (default: 10)
 * @returns Array of leaderboard entries sorted by total XP descending
 */
export async function getXPLeaderboard(
  limit: number = 10
): Promise<XPLeaderboardEntry[]> {
  // Aggregate XP by user using pagination for scalability
  const userXPMap = new Map<string, number>();
  let page = 1;
  const perPage = 500; // Process in batches

  while (true) {
    const result = await pb.collection(Collections.XP_EVENTS).getList<XPEvent>(page, perPage, {
      sort: '-created',
    });

    for (const event of result.items) {
      const currentXP = userXPMap.get(event.user_id) ?? 0;
      userXPMap.set(event.user_id, currentXP + event.amount);
    }

    // Break if we've fetched all pages
    if (page >= result.totalPages) {
      break;
    }
    page++;
  }

  // Sort users by XP and take top N
  const sortedUsers = Array.from(userXPMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (sortedUsers.length === 0) {
    return [];
  }

  // Fetch user details for the top users
  const userIds = sortedUsers.map(([userId]) => userId);
  const userFilter = userIds.map((id) => filterEquals('id', id)).join(' || ');
  const users = await pb.collection(Collections.USERS).getFullList<User>({
    filter: userFilter,
  });

  // Build leaderboard entries
  const userMap = new Map(users.map((u) => [u.id, u]));
  const leaderboard: XPLeaderboardEntry[] = sortedUsers.map(
    ([userId, totalXp], index) => {
      const user = userMap.get(userId);
      return {
        user_id: userId,
        user_name: user?.name ?? 'Unknown',
        user_avatar: user?.avatar ?? '',
        total_xp: totalXp,
        rank: index + 1,
      };
    }
  );

  return leaderboard;
}

/**
 * Get the XP leaderboard for a specific sprint.
 * Uses pagination internally to handle large datasets efficiently.
 *
 * @param sprintId - The ID of the sprint
 * @param limit - Maximum number of entries to return (default: 10)
 * @returns Array of sprint leaderboard entries sorted by XP descending
 */
export async function getSprintXPLeaderboard(
  sprintId: string,
  limit: number = 10
): Promise<SprintXPLeaderboardEntry[]> {
  // Aggregate XP by user using pagination for scalability
  const userXPMap = new Map<string, number>();
  let page = 1;
  const perPage = 500; // Process in batches

  while (true) {
    const result = await pb.collection(Collections.XP_EVENTS).getList<XPEvent>(page, perPage, {
      filter: filterEquals('sprint_id', sprintId),
      sort: '-created',
    });

    for (const event of result.items) {
      const currentXP = userXPMap.get(event.user_id) ?? 0;
      userXPMap.set(event.user_id, currentXP + event.amount);
    }

    // Break if we've fetched all pages
    if (page >= result.totalPages) {
      break;
    }
    page++;
  }

  // Sort users by XP and take top N
  const sortedUsers = Array.from(userXPMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (sortedUsers.length === 0) {
    return [];
  }

  // Fetch user details for the top users
  const userIds = sortedUsers.map(([userId]) => userId);
  const userFilter = userIds.map((id) => filterEquals('id', id)).join(' || ');
  const users = await pb.collection(Collections.USERS).getFullList<User>({
    filter: userFilter,
  });

  // Build leaderboard entries
  const userMap = new Map(users.map((u) => [u.id, u]));
  const leaderboard: SprintXPLeaderboardEntry[] = sortedUsers.map(
    ([userId, totalXp], index) => {
      const user = userMap.get(userId);
      return {
        user_id: userId,
        user_name: user?.name ?? 'Unknown',
        user_avatar: user?.avatar ?? '',
        total_xp: totalXp,
        rank: index + 1,
        sprint_id: sprintId,
      };
    }
  );

  return leaderboard;
}
