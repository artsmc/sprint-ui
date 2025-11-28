/**
 * UserProfileCard Component
 *
 * Displays user profile information including avatar, level, XP progress,
 * streaks, and earned badges.
 *
 * @module app/challenge-hub/components/user-profile-card
 */

'use client';

import { Avatar } from '@/app/ui/components/Avatar';
import { Badge } from '@/app/ui/components/Badge';
import { Progress } from '@/app/ui/components/Progress';
import { Tooltip } from '@/app/ui/components/Tooltip';
import { Flame, MessageSquare, Award } from 'lucide-react';
import {
  getUserTitle,
  calculateLevelProgress,
  formatXPProgress,
} from '@/lib/utils';
import { formatDateShort } from '@/lib/utils/date-formatting';
import { cn } from '@/lib/utils';
import type { User, UserBadgeWithRelations } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface UserStreaks {
  /** Number of consecutive sprints participated in */
  sprintStreak: number;
  /** Number of consecutive sprints with feedback given */
  feedbackStreak: number;
}

export interface UserProfileCardProps {
  /** The user data */
  user: User;
  /** User's total XP across all sprints */
  xpTotal: number;
  /** User's current level (1-8) */
  level: number;
  /** User's earned badges with details */
  badges: UserBadgeWithRelations[];
  /** User's streak data (optional) */
  streaks?: UserStreaks;
  /** Optional CSS class name */
  className?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get user initials from name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// =============================================================================
// Sub-Components
// =============================================================================

interface StreakBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  className?: string;
}

function StreakBadge({ icon, label, value, className }: StreakBadgeProps) {
  if (value === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1',
        className
      )}
    >
      {icon}
      <span className="text-caption text-neutral-700">
        {value} {label}
      </span>
    </div>
  );
}

interface BadgeIconProps {
  badge: UserBadgeWithRelations;
}

function BadgeIcon({ badge }: BadgeIconProps) {
  const badgeDetails = badge.expand?.badge_id;
  if (!badgeDetails) return null;

  const awardedDate = badge.awarded_at
    ? formatDateShort(badge.awarded_at)
    : 'Unknown date';

  return (
    <div className="group relative">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-transform hover:scale-110"
        aria-label={badgeDetails.name}
      >
        <Award className="h-4 w-4" />
      </div>
      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <Tooltip>
          <div className="whitespace-nowrap">
            <div className="font-bold">{badgeDetails.name}</div>
            <div className="text-xs opacity-80">Earned {awardedDate}</div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * UserProfileCard displays comprehensive user profile information.
 *
 * Features:
 * - User avatar (image or initials fallback)
 * - Name and level-based title
 * - Level indicator with XP progress bar
 * - Sprint and feedback streak badges
 * - Earned badges with hover tooltips
 *
 * @example
 * ```tsx
 * <UserProfileCard
 *   user={currentUser}
 *   xpTotal={1250}
 *   level={5}
 *   badges={userBadges}
 *   streaks={{ sprintStreak: 3, feedbackStreak: 5 }}
 * />
 * ```
 */
export function UserProfileCard({
  user,
  xpTotal,
  level,
  badges,
  streaks,
  className,
}: UserProfileCardProps) {
  const title = getUserTitle(level);
  const progressPercent = calculateLevelProgress(xpTotal, level);
  const xpProgressText = formatXPProgress(xpTotal, level);
  const initials = getInitials(user.name || 'User');

  const hasStreaks =
    streaks && (streaks.sprintStreak > 0 || streaks.feedbackStreak > 0);
  const hasBadges = badges.length > 0;

  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white p-5 shadow-sm',
        className
      )}
    >
      {/* User Info Row */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar
          size="x-large"
          image={user.avatar || undefined}
          variant="brand"
        >
          {!user.avatar && initials}
        </Avatar>

        {/* Name and Title */}
        <div className="flex-1">
          <h3 className="text-body-bold font-body-bold text-neutral-900">
            {user.name}
          </h3>
          <p className="text-caption text-neutral-500">{title}</p>
        </div>
      </div>

      {/* Level and XP Progress */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <Badge variant="brand">Level {level}</Badge>
          <span className="text-caption text-neutral-600">{xpProgressText}</span>
        </div>
        <Progress
          value={progressPercent}
          className="h-2"
          aria-label={`Level progress: ${progressPercent}%`}
        />
      </div>

      {/* Streaks */}
      {hasStreaks && (
        <div className="mt-4 flex flex-wrap gap-2">
          {streaks.sprintStreak > 0 && (
            <StreakBadge
              icon={<Flame className="h-3.5 w-3.5 text-warning-600" />}
              label="Sprint Streak"
              value={streaks.sprintStreak}
            />
          )}
          {streaks.feedbackStreak > 0 && (
            <StreakBadge
              icon={<MessageSquare className="h-3.5 w-3.5 text-brand-600" />}
              label="Feedback Streak"
              value={streaks.feedbackStreak}
            />
          )}
        </div>
      )}

      {/* Badges */}
      <div className="mt-4 border-t border-neutral-100 pt-4">
        <h4 className="mb-2 text-caption-bold font-caption-bold text-neutral-700">
          Badges Earned
        </h4>
        {hasBadges ? (
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 8).map((badge) => (
              <BadgeIcon key={badge.id} badge={badge} />
            ))}
            {badges.length > 8 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-caption text-neutral-600">
                +{badges.length - 8}
              </div>
            )}
          </div>
        ) : (
          <p className="text-caption text-neutral-500">
            No badges earned yet. Complete sprints to earn badges!
          </p>
        )}
      </div>
    </div>
  );
}

export default UserProfileCard;
