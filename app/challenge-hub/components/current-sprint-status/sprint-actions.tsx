/**
 * SprintActions Component
 *
 * Admin-only action buttons for managing the sprint (end, extend).
 *
 * @module app/challenge-hub/components/current-sprint-status/sprint-actions
 */

'use client';

import React from 'react';
import { Button } from '@/ui/components/Button';
import { FeatherStopCircle, FeatherClock } from '@subframe/core';

// =============================================================================
// Types
// =============================================================================

export interface SprintActionsProps {
  /** Handler for ending the sprint */
  onEndSprint: () => void;
  /** Handler for extending the sprint */
  onExtendSprint: () => void;
  /** Whether the end sprint action is in progress */
  isEnding: boolean;
  /** Whether the extend sprint action is in progress */
  isExtending: boolean;
  /** Whether the current user is an admin */
  isAdmin: boolean;
  /** Number of days the sprint will be extended by */
  extensionDays?: number;
}

// =============================================================================
// Component
// =============================================================================

/**
 * SprintActions displays admin action buttons for managing the sprint.
 * Only visible to admin users.
 *
 * @example
 * ```tsx
 * <SprintActions
 *   onEndSprint={handleEndSprint}
 *   onExtendSprint={handleExtendSprint}
 *   isEnding={false}
 *   isExtending={false}
 *   isAdmin={user?.role === 'admin'}
 * />
 * ```
 */
export function SprintActions({
  onEndSprint,
  onExtendSprint,
  isEnding,
  isExtending,
  isAdmin,
  extensionDays = 3,
}: SprintActionsProps) {
  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="destructive-secondary"
          icon={<FeatherStopCircle />}
          onClick={onEndSprint}
          disabled={isEnding || isExtending}
        >
          {isEnding ? 'Ending Sprint...' : 'End Sprint'}
        </Button>
        <Button
          variant="neutral-secondary"
          icon={<FeatherClock />}
          onClick={onExtendSprint}
          disabled={isEnding || isExtending}
        >
          {isExtending ? 'Extending...' : 'Extend Sprint'}
        </Button>
      </div>

      {/* Helper Text */}
      <p className="text-caption text-subtext-color">
        End Sprint transitions to the next phase. Extend Sprint adds {extensionDays} days to the deadline.
      </p>
    </div>
  );
}

export default SprintActions;
