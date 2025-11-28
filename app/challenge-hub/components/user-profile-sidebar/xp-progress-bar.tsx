'use client';

interface XPProgressBarProps {
  level: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  progressPercentage: number;
}

/**
 * XP progress bar showing progress toward the next level.
 */
export function XPProgressBar({
  level,
  currentLevelXP,
  xpForNextLevel,
  progressPercentage,
}: XPProgressBarProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full items-center justify-between">
        <span className="text-caption font-caption text-subtext-color">
          Level {level} Progress
        </span>
        <span className="text-caption-bold font-caption-bold text-default-font">
          {currentLevelXP} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="flex h-3 w-full flex-none flex-col items-start gap-2 rounded-full bg-neutral-200">
        <div
          className="flex h-3 flex-none flex-col items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
