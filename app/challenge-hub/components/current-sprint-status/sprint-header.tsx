/**
 * SprintHeader Component
 *
 * Displays sprint title, status badge, dates, and countdown timer.
 *
 * @module app/challenge-hub/components/current-sprint-status/sprint-header
 */

'use client';

import React from 'react';
import { Badge } from '@/ui/components/Badge';
import type { Sprint, SprintStatus } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import { getStatusLabel } from '@/lib/api/sprints';

// =============================================================================
// Types
// =============================================================================

export interface SprintHeaderProps {
  /** The sprint to display */
  sprint: Sprint;
  /** Formatted countdown string */
  countdown: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get badge variant for sprint status.
 */
function getStatusVariant(
  status: SprintStatus
): 'brand' | 'neutral' | 'error' | 'warning' | 'success' {
  const variantMap: Record<
    SprintStatus,
    'brand' | 'neutral' | 'error' | 'warning' | 'success'
  > = {
    scheduled: 'neutral',
    active: 'brand',
    voting: 'warning',
    retro: 'success',
    completed: 'neutral',
    cancelled: 'error',
  };

  return variantMap[status];
}

// =============================================================================
// Component
// =============================================================================

/**
 * SprintHeader displays the sprint title, status badge, dates, and countdown.
 *
 * @example
 * ```tsx
 * <SprintHeader
 *   sprint={currentSprint}
 *   countdown="3d 12h 45m"
 * />
 * ```
 */
export function SprintHeader({ sprint, countdown }: SprintHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Title and Badge Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-2 font-heading-2 text-default-font">
            {sprint.name}
          </h2>
          <Badge variant={getStatusVariant(sprint.status)}>
            {getStatusLabel(sprint.status)}
          </Badge>
        </div>
        <span className="text-body-bold font-body-bold text-brand-700">
          {countdown}
        </span>
      </div>

      {/* Dates Row */}
      <div className="flex items-center gap-4 text-caption text-subtext-color">
        {sprint.start_at && (
          <span>
            Started: {formatDateShort(new Date(sprint.start_at))}
          </span>
        )}
        {sprint.end_at && (
          <span>
            Ends: {formatDateShort(new Date(sprint.end_at))}
          </span>
        )}
        {sprint.voting_end_at && sprint.status === 'voting' && (
          <span>
            Voting ends: {formatDateShort(new Date(sprint.voting_end_at))}
          </span>
        )}
      </div>
    </div>
  );
}

export default SprintHeader;
