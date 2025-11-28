'use client';

import { FeatherFlame, FeatherMessageSquare } from '@subframe/core';

interface StreakCardsProps {
  sprintStreak: number;
  feedbackStreak: number;
}

/**
 * Displays the user's sprint and feedback streaks.
 */
export function StreakCards({ sprintStreak, feedbackStreak }: StreakCardsProps) {
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2 rounded-md bg-brand-50 px-4 py-4">
        <FeatherFlame className="text-heading-1 font-heading-1 text-brand-600" />
        <span className="text-heading-3 font-heading-3 text-default-font">
          {sprintStreak}
        </span>
        <span className="text-caption font-caption text-subtext-color text-center">
          Sprint Streak
        </span>
      </div>
      <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2 rounded-md bg-success-50 px-4 py-4">
        <FeatherMessageSquare className="text-heading-1 font-heading-1 text-success-600" />
        <span className="text-heading-3 font-heading-3 text-default-font">
          {feedbackStreak}
        </span>
        <span className="text-caption font-caption text-subtext-color text-center">
          Feedback Streak
        </span>
      </div>
    </div>
  );
}
