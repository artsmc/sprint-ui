/**
 * ChallengeHubMain Component
 *
 * Main content area for the Challenge Hub page. Contains the Active Challenge Card,
 * Sprint Progress Tracker, and Skill Growth Section. Handles loading, error, and
 * empty states.
 *
 * @module app/challenge-hub/components/challenge-hub-main
 */

'use client';

import { useChallengeHub } from '@/lib/hooks';
import { ActiveChallengeCard } from './active-challenge-card';
import { SprintProgressTracker } from './sprint-progress-tracker';
import { SkillGrowthSection } from './skill-growth-section';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface ChallengeHubMainProps {
  /** User ID for fetching personalized data */
  userId?: string;
  /** Optional CSS class name */
  className?: string;
}

// =============================================================================
// Loading State
// =============================================================================

function ChallengeHubMainLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Active Challenge Card Skeleton */}
      <div className="animate-pulse rounded-lg border-2 border-brand-200 bg-gradient-to-br from-white to-brand-50 p-5 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-24 rounded-full bg-neutral-200" />
            <div className="h-4 w-16 rounded bg-neutral-200" />
          </div>
          <div className="h-6 w-32 rounded bg-neutral-200" />
        </div>
        <div className="mb-4">
          <div className="h-7 w-3/4 rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-full rounded bg-neutral-200" />
          <div className="mt-1 h-4 w-2/3 rounded bg-neutral-200" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 rounded-lg bg-neutral-200" />
          <div className="h-10 w-32 rounded-lg bg-neutral-200" />
        </div>
      </div>

      {/* Sprint Progress Skeleton */}
      <div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="h-5 w-32 rounded bg-neutral-200" />
          <div className="mt-1 h-4 w-48 rounded bg-neutral-200" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md bg-neutral-50 p-2"
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-neutral-200" />
                <div className="h-4 w-32 rounded bg-neutral-200" />
              </div>
              <div className="h-4 w-12 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <div className="h-2 w-full rounded-full bg-neutral-200" />
        </div>
      </div>

      {/* Skill Growth Skeleton */}
      <div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-4 h-5 w-28 rounded bg-neutral-200" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 rounded bg-neutral-200" />
                  <div className="h-5 w-12 rounded-full bg-neutral-200" />
                </div>
                <div className="h-4 w-12 rounded bg-neutral-200" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface ChallengeHubMainErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

function ChallengeHubMainError({
  message,
  onRetry,
  className,
}: ChallengeHubMainErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-danger-200 bg-danger-50 p-8 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-danger-100 p-3">
        <svg
          className="h-6 w-6 text-danger-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-body-bold font-body-bold text-danger-800">
        Failed to Load
      </h3>
      <p className="mt-1 text-body text-danger-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-danger-600 px-4 py-2 text-caption-bold text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// =============================================================================
// Not Logged In State
// =============================================================================

function NotLoggedInState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-brand-100 p-4">
        <svg
          className="h-8 w-8 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <h3 className="text-heading-3 font-heading-3 text-neutral-900">
        Sign in to participate
      </h3>
      <p className="mt-2 text-body text-neutral-600">
        Join design challenges, track your progress, and build your skills.
      </p>
      <a
        href="/signin"
        className="mt-4 rounded-lg bg-brand-600 px-6 py-2.5 text-body-bold text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        Sign In
      </a>
    </div>
  );
}

// =============================================================================
// No Active Sprint State
// =============================================================================

function NoActiveSprintState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-neutral-100 p-4">
        <svg
          className="h-8 w-8 text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-heading-3 font-heading-3 text-neutral-900">
        No active challenge
      </h3>
      <p className="mt-2 text-body text-neutral-600">
        There&apos;s no design challenge running right now. Check back soon for
        the next sprint!
      </p>
    </div>
  );
}

// =============================================================================
// Not Participating State
// =============================================================================

interface NotParticipatingStateProps {
  sprintNumber: number;
  challengeTitle: string;
  className?: string;
  onJoin?: () => void;
}

function NotParticipatingState({
  sprintNumber,
  challengeTitle,
  className,
  onJoin,
}: NotParticipatingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-300 bg-brand-50 p-8 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-brand-100 p-4">
        <svg
          className="h-8 w-8 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="text-heading-3 font-heading-3 text-neutral-900">
        Sprint #{sprintNumber} is active!
      </h3>
      <p className="mt-2 text-body text-neutral-700">
        <strong>{challengeTitle}</strong>
      </p>
      <p className="mt-1 text-caption text-neutral-600">
        Join the challenge to submit designs, vote, and earn XP.
      </p>
      {onJoin && (
        <button
          onClick={onJoin}
          className="mt-4 rounded-lg bg-brand-600 px-6 py-2.5 text-body-bold text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Join Sprint
        </button>
      )}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * ChallengeHubMain displays the main content area of the Challenge Hub.
 *
 * Features:
 * - Active Challenge Card with countdown timer
 * - Sprint Progress Tracker with task checklist
 * - Skill Growth Section with progress bars
 * - Proper loading, error, and empty states
 *
 * @example
 * ```tsx
 * <ChallengeHubMain userId={currentUser?.id} />
 * ```
 */
export function ChallengeHubMain({ userId, className }: ChallengeHubMainProps) {
  const { data, isLoading, isError, error, refetch } = useChallengeHub({
    userId,
  });

  // Not logged in state
  if (!userId) {
    return <NotLoggedInState className={className} />;
  }

  // Loading state
  if (isLoading) {
    return <ChallengeHubMainLoading className={className} />;
  }

  // Error state
  if (isError) {
    return (
      <ChallengeHubMainError
        message={error?.message || 'Unable to load challenge data'}
        onRetry={() => refetch()}
        className={className}
      />
    );
  }

  // No active sprint state
  if (!data?.activeSprint) {
    return <NoActiveSprintState className={className} />;
  }

  // Not participating state
  if (!data.isParticipant) {
    return (
      <NotParticipatingState
        sprintNumber={data.activeSprint.sprint_number}
        challengeTitle={data.challenge?.title || 'Current Challenge'}
        className={className}
        // TODO: Implement join sprint functionality
        onJoin={undefined}
      />
    );
  }

  // No challenge data (edge case)
  if (!data.challenge) {
    return (
      <ChallengeHubMainError
        message="Challenge details not available"
        onRetry={() => refetch()}
        className={className}
      />
    );
  }

  // Main content
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Active Challenge Card */}
      <ActiveChallengeCard
        sprint={data.activeSprint}
        challenge={data.challenge}
        isParticipant={data.isParticipant}
      />

      {/* Sprint Progress Tracker */}
      <SprintProgressTracker
        tasks={data.taskProgress.tasks}
        totalXP={data.taskProgress.totalXP}
        maxXP={data.taskProgress.maxXP}
      />

      {/* Skill Growth Section */}
      <SkillGrowthSection
        skillProgress={data.userSkillProgress}
        maxSkills={4}
      />
    </div>
  );
}

export default ChallengeHubMain;
