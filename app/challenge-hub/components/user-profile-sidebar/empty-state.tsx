'use client';

import { FeatherUser, FeatherSparkles } from '@subframe/core';

interface EmptyStateProps {
  className?: string;
}

/**
 * Empty state display when user has no profile data yet.
 * Shown for new users who haven't participated in any sprints.
 */
export function EmptyState({ className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}
    >
      <div className="flex w-full flex-col items-center gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-12 shadow-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <FeatherUser className="text-heading-1 font-heading-1 text-brand-600" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Welcome to Sprint UI!
          </span>
          <span className="text-body font-body text-subtext-color text-center max-w-[300px]">
            Your profile will appear here once you join a design sprint. Start
            participating to earn XP, badges, and climb the leaderboard!
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-50">
          <FeatherSparkles className="text-heading-2 font-heading-2 text-warning-600" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-heading-3 font-heading-3 text-default-font">
            No Sprint Highlights Yet
          </span>
          <span className="text-body font-body text-subtext-color text-center">
            Awards and recognition will show up here after you participate.
          </span>
        </div>
      </div>
    </div>
  );
}
