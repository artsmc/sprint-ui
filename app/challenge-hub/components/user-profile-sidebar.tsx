/**
 * UserProfileSidebar Component
 *
 * Displays user profile information and sprint highlights in the Challenge Hub sidebar.
 * Fetches data via the useUserProfileSidebar hook and handles loading/error/empty states.
 *
 * @module app/challenge-hub/components/user-profile-sidebar
 */

'use client';

import { useUserProfileSidebar } from '@/lib/hooks';
import {
  getUserTitle,
  calculateLevelProgress,
  getXPForCurrentLevel,
  getXPForNextLevel,
} from '@/lib/utils';
import {
  UserProfileSidebarLoading,
  UserProfileSidebarError,
  UserProfileCard,
  SprintHighlights,
  EmptyState,
  NotLoggedInState,
} from './user-profile-sidebar/index';

// =============================================================================
// Types
// =============================================================================

export interface UserProfileSidebarProps {
  /** The user ID to fetch profile data for (optional - shows empty state if not provided) */
  userId?: string;
  /** Optional CSS class name */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * UserProfileSidebar displays user profile info, XP progress, streaks, badges,
 * and sprint highlights with tabbed content.
 *
 * @example
 * ```tsx
 * <UserProfileSidebar userId="user-123" />
 * ```
 */
export function UserProfileSidebar({
  userId,
  className = '',
}: UserProfileSidebarProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    activeHighlightTab,
    setActiveHighlightTab,
  } = useUserProfileSidebar({ userId });

  // Not logged in state - no userId provided
  if (!userId) {
    return <NotLoggedInState className={className} />;
  }

  // Loading state
  if (isLoading) {
    return <UserProfileSidebarLoading className={className} />;
  }

  // Error state
  if (isError) {
    return (
      <UserProfileSidebarError
        message={
          error?.message ||
          'Unable to load your profile data. Please try refreshing the page.'
        }
        className={className}
      />
    );
  }

  // Empty state - no data or new user
  if (!data) {
    return <EmptyState className={className} />;
  }

  // Check if user has any activity (XP > 0 or badges or awards)
  const hasActivity =
    data.xpTotal > 0 ||
    data.badges.length > 0 ||
    data.sprintAwards.length > 0 ||
    data.streaks.sprintStreak > 0 ||
    data.streaks.feedbackStreak > 0;

  // Show empty state for users with no activity
  if (!hasActivity) {
    return <EmptyState className={className} />;
  }

  // Calculate progress for the current level
  const progressPercentage = calculateLevelProgress(data.xpTotal, data.level);
  const currentLevelXP = data.xpTotal - getXPForCurrentLevel(data.level);
  const xpForNextLevel =
    getXPForNextLevel(data.level) - getXPForCurrentLevel(data.level);

  // Get user title based on level
  const userTitle = getUserTitle(data.level);

  return (
    <div
      className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}
    >
      {/* User Profile Card */}
      <UserProfileCard
        user={data.user}
        userTitle={userTitle}
        level={data.level}
        currentLevelXP={currentLevelXP}
        xpForNextLevel={xpForNextLevel}
        progressPercentage={progressPercentage}
        streaks={data.streaks}
        badges={data.badges}
      />

      {/* Sprint Highlights Section */}
      <SprintHighlights
        sprintAwards={data.sprintAwards}
        activeTab={activeHighlightTab}
        onTabChange={setActiveHighlightTab}
      />
    </div>
  );
}

export default UserProfileSidebar;
