/**
 * Challenge Hub Loading State
 *
 * Skeleton loaders displayed while the Challenge Hub page data is loading.
 * Uses Next.js streaming SSR loading conventions.
 *
 * @module app/challenge-hub/loading
 */

import { cn } from '@/lib/utils';

// =============================================================================
// Skeleton Components
// =============================================================================

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

// =============================================================================
// Section Skeletons
// =============================================================================

function HeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

function ActiveChallengeSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-64" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-3/4 max-w-lg" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

function ProgressTrackerSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="pt-2 space-y-2">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-28" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="pt-2">
        <Skeleton className="h-4 w-full max-w-xs" />
      </div>
    </div>
  );
}

function HighlightsSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-36" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <Skeleton className="h-32 w-full rounded" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Loading Component
// =============================================================================

export default function ChallengeHubLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      {/* Active Challenge Skeleton */}
      <ActiveChallengeSkeleton />

      {/* Progress Tracker Skeleton */}
      <ProgressTrackerSkeleton />

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProfileCardSkeleton />
        <SkillsSkeleton />
      </div>

      {/* Highlights Skeleton */}
      <HighlightsSkeleton />
    </div>
  );
}
