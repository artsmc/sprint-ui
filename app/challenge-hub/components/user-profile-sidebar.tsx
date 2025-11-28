/**
 * UserProfileSidebar Component
 *
 * Displays user profile information and sprint highlights in the Challenge Hub sidebar.
 * Fetches data via the useUserProfileSidebar hook and handles loading/error states.
 *
 * @module app/challenge-hub/components/user-profile-sidebar
 */

'use client';

import React from 'react';
import { Badge } from '@/ui/components/Badge';
import { IconWithBackground } from '@/ui/components/IconWithBackground';
import { Tabs } from '@/ui/components/Tabs';
import {
  FeatherAward,
  FeatherFlame,
  FeatherMessageCircle,
  FeatherMessageSquare,
  FeatherMousePointer,
  FeatherTrendingUp,
  FeatherTrophy,
  FeatherZap,
  FeatherAlertCircle,
} from '@subframe/core';
import { useUserProfileSidebar } from '@/lib/hooks';
import { getUserTitle, calculateLevelProgress } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface UserProfileSidebarProps {
  /** The user ID to fetch profile data for */
  userId: string;
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

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}>
        <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md animate-pulse">
          <div className="h-24 w-full bg-neutral-200 rounded" />
          <div className="h-16 w-full bg-neutral-200 rounded" />
          <div className="h-32 w-full bg-neutral-200 rounded" />
        </div>
        <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md animate-pulse">
          <div className="h-48 w-full bg-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}>
        <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-error-200 bg-error-50 px-8 py-8 shadow-md">
          <div className="flex items-center gap-3">
            <FeatherAlertCircle className="text-heading-3 font-heading-3 text-error-600" />
            <span className="text-heading-3 font-heading-3 text-error-900">
              Failed to Load Profile
            </span>
          </div>
          <span className="text-body font-body text-error-800">
            {error?.message || 'Unable to load your profile data. Please try refreshing the page.'}
          </span>
        </div>
      </div>
    );
  }

  // Calculate progress for the current level
  const levelProgress = calculateLevelProgress(data.xpTotal);
  const progressPercentage = (levelProgress.currentLevelXP / levelProgress.xpForNextLevel) * 100;

  // Get user title based on level
  const userTitle = getUserTitle(data.level);

  // Determine which highlights to show based on active tab
  const renderHighlights = () => {
    // For now, always show recognition awards
    // In the future, this could show participation or skills data based on activeHighlightTab
    if (data.sprintAwards.length === 0) {
      return (
        <div className="flex w-full items-center justify-center py-8">
          <span className="text-body font-body text-subtext-color">
            No awards yet this sprint. Keep designing!
          </span>
        </div>
      );
    }

    // Map award types to display info
    const awardTypeMap: Record<string, { icon: React.ReactNode; label: string; variant: 'warning' | 'success' | 'brand' | 'neutral' }> = {
      top_visual: {
        icon: <FeatherTrophy />,
        label: 'Top Visual Design',
        variant: 'warning',
      },
      top_usability: {
        icon: <FeatherMousePointer />,
        label: 'Top Usability',
        variant: 'success',
      },
      top_clarity: {
        icon: <FeatherZap />,
        label: 'Top Clarity',
        variant: 'brand',
      },
      top_originality: {
        icon: <FeatherAward />,
        label: 'Top Originality',
        variant: 'warning',
      },
      feedback_mvp: {
        icon: <FeatherMessageCircle />,
        label: 'Feedback MVP',
        variant: 'brand',
      },
      people_choice: {
        icon: <FeatherTrophy />,
        label: "People's Choice",
        variant: 'warning',
      },
      most_improved: {
        icon: <FeatherTrendingUp />,
        label: 'Most Improved',
        variant: 'neutral',
      },
    };

    return (
      <div className="flex w-full flex-col items-start gap-4">
        {data.sprintAwards.slice(0, 4).map((award) => {
          const awardInfo = awardTypeMap[award.award_type] || {
            icon: <FeatherAward />,
            label: award.award_type,
            variant: 'neutral' as const,
          };

          return (
            <div
              key={award.id}
              className={`flex w-full items-center gap-3 rounded-md px-4 py-4 ${
                awardInfo.variant === 'warning' ? 'bg-warning-50' :
                awardInfo.variant === 'success' ? 'bg-success-50' :
                awardInfo.variant === 'brand' ? 'bg-brand-50' :
                'bg-neutral-50'
              }`}
            >
              <IconWithBackground
                variant={awardInfo.variant}
                size="medium"
                icon={awardInfo.icon}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className={`text-caption-bold font-caption-bold ${
                  awardInfo.variant === 'warning' ? 'text-warning-900' :
                  awardInfo.variant === 'success' ? 'text-success-900' :
                  awardInfo.variant === 'brand' ? 'text-brand-900' :
                  'text-neutral-900'
                }`}>
                  {awardInfo.label}
                </span>
                <span className={`text-body font-body ${
                  awardInfo.variant === 'warning' ? 'text-warning-800' :
                  awardInfo.variant === 'success' ? 'text-success-800' :
                  awardInfo.variant === 'brand' ? 'text-brand-800' :
                  'text-neutral-800'
                }`}>
                  {award.expand?.user_id?.name || 'Unknown User'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}>
      {/* User Profile Card */}
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
        {/* Name and Title */}
        <div className="flex w-full items-center gap-4">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
            <span className="text-heading-2 font-heading-2 text-default-font">
              {data.user.name}
            </span>
            <span className="text-body font-body text-brand-600">
              {userTitle}
            </span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full items-center justify-between">
            <span className="text-caption font-caption text-subtext-color">
              Level {data.level} Progress
            </span>
            <span className="text-caption-bold font-caption-bold text-default-font">
              {levelProgress.currentLevelXP} / {levelProgress.xpForNextLevel} XP
            </span>
          </div>
          <div className="flex h-3 w-full flex-none flex-col items-start gap-2 rounded-full bg-neutral-200">
            <div
              className="flex h-3 flex-none flex-col items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Streaks */}
        <div className="flex w-full items-start gap-4">
          <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2 rounded-md bg-brand-50 px-4 py-4">
            <FeatherFlame className="text-heading-1 font-heading-1 text-brand-600" />
            <span className="text-heading-3 font-heading-3 text-default-font">
              {data.streaks.sprintStreak}
            </span>
            <span className="text-caption font-caption text-subtext-color text-center">
              Sprint Streak
            </span>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2 rounded-md bg-success-50 px-4 py-4">
            <FeatherMessageSquare className="text-heading-1 font-heading-1 text-success-600" />
            <span className="text-heading-3 font-heading-3 text-default-font">
              {data.streaks.feedbackStreak}
            </span>
            <span className="text-caption font-caption text-subtext-color text-center">
              Feedback Streak
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex w-full items-center gap-2 flex-wrap">
          {data.badges.length === 0 ? (
            <span className="text-body font-body text-subtext-color">
              No badges earned yet
            </span>
          ) : (
            data.badges.slice(0, 3).map((userBadge) => (
              <Badge
                key={userBadge.id}
                icon={<FeatherAward />}
              >
                {userBadge.expand?.badge_id?.name || 'Badge'}
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Sprint Highlights Section */}
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-2 font-heading-2 text-default-font">
            This Sprint Highlights
          </span>
          <Tabs>
            <Tabs.Item
              active={activeHighlightTab === 'recognition'}
              onClick={() => setActiveHighlightTab('recognition')}
            >
              Recognition
            </Tabs.Item>
            <Tabs.Item
              active={activeHighlightTab === 'participation'}
              onClick={() => setActiveHighlightTab('participation')}
            >
              Participation
            </Tabs.Item>
            <Tabs.Item
              active={activeHighlightTab === 'skills'}
              onClick={() => setActiveHighlightTab('skills')}
            >
              Skills
            </Tabs.Item>
          </Tabs>
        </div>
        {renderHighlights()}
      </div>
    </div>
  );
}

export default UserProfileSidebar;
