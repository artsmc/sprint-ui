'use client';

import type { User } from '@/lib/types';
import { XPProgressBar } from './xp-progress-bar';
import { StreakCards } from './streak-cards';
import { BadgeList } from './badge-list';
import type { UserBadgeWithRelations } from '@/lib/types';
import type { UserStreakData } from '@/lib/api/user-profile-sidebar';

interface UserProfileCardProps {
  user: User;
  userTitle: string;
  level: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  progressPercentage: number;
  streaks: UserStreakData;
  badges: UserBadgeWithRelations[];
}

/**
 * Displays the user's profile information including name, title, XP progress,
 * streaks, and badges.
 */
export function UserProfileCard({
  user,
  userTitle,
  level,
  currentLevelXP,
  xpForNextLevel,
  progressPercentage,
  streaks,
  badges,
}: UserProfileCardProps) {
  return (
    <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
      {/* Name and Title */}
      <div className="flex w-full items-center gap-4">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
          <span className="text-heading-2 font-heading-2 text-default-font">
            {user.name}
          </span>
          <span className="text-body font-body text-brand-600">{userTitle}</span>
        </div>
      </div>

      {/* XP Progress */}
      <XPProgressBar
        level={level}
        currentLevelXP={currentLevelXP}
        xpForNextLevel={xpForNextLevel}
        progressPercentage={progressPercentage}
      />

      {/* Streaks */}
      <StreakCards
        sprintStreak={streaks.sprintStreak}
        feedbackStreak={streaks.feedbackStreak}
      />

      {/* Badges */}
      <BadgeList badges={badges} />
    </div>
  );
}
