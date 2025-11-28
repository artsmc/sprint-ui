/**
 * SprintStats Component
 *
 * Displays sprint statistics cards (submissions, yet to submit, participation).
 *
 * @module app/challenge-hub/components/current-sprint-status/sprint-stats
 */

'use client';

import React from 'react';
import { FeatherCheckCircle, FeatherClock, FeatherUsers } from '@subframe/core';
import type { SprintStatistics } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface SprintStatsProps {
  /** Sprint statistics data */
  stats: SprintStatistics;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  variant?: 'brand' | 'neutral' | 'warning';
}

function StatCard({ icon, label, value, variant = 'neutral' }: StatCardProps) {
  const colorClasses = {
    brand: 'text-brand-600 bg-brand-50',
    neutral: 'text-neutral-600 bg-neutral-50',
    warning: 'text-warning-600 bg-warning-50',
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`rounded-md p-1.5 ${colorClasses[variant]}`}>
          {icon}
        </div>
        <span className="text-caption font-caption text-subtext-color">
          {label}
        </span>
      </div>
      <span className="text-heading-2 font-heading-2 text-default-font">
        {value}
      </span>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * SprintStats displays statistics about sprint participation and submissions.
 *
 * @example
 * ```tsx
 * <SprintStats
 *   stats={{
 *     submissionsCount: 12,
 *     yetToSubmitCount: 3,
 *     participationRate: 80,
 *     totalParticipants: 15,
 *   }}
 * />
 * ```
 */
export function SprintStats({ stats }: SprintStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Submissions Count */}
      <StatCard
        icon={<FeatherCheckCircle />}
        label="Submissions"
        value={stats.submissionsCount}
        variant="brand"
      />

      {/* Yet to Submit Count */}
      <StatCard
        icon={<FeatherClock />}
        label="Yet to Submit"
        value={stats.yetToSubmitCount}
        variant="warning"
      />

      {/* Participation Rate */}
      <StatCard
        icon={<FeatherUsers />}
        label="Participation"
        value={`${stats.participationRate}%`}
        variant="neutral"
      />
    </div>
  );
}

export default SprintStats;
