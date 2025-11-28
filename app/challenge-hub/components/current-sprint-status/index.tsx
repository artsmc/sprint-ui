/**
 * CurrentSprintStatus Component
 *
 * Main component for displaying current sprint status with statistics,
 * countdown, and admin actions.
 *
 * @module app/challenge-hub/components/current-sprint-status
 */

'use client';

import React from 'react';
import { useCurrentSprint, useCountdown } from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores/auth';
import { SprintHeader } from './sprint-header';
import { SprintStats } from './sprint-stats';
import { SprintActions } from './sprint-actions';
import { SprintMetadata } from './sprint-metadata';

// =============================================================================
// Constants
// =============================================================================

/** Default number of days to extend a sprint */
const DEFAULT_EXTENSION_DAYS = 3;

// =============================================================================
// Types
// =============================================================================

export interface CurrentSprintStatusProps {
  /** Optional CSS class name */
  className?: string;
}

// =============================================================================
// Loading State
// =============================================================================

function CurrentSprintStatusLoading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-48 rounded bg-neutral-200" />
            <div className="h-6 w-20 rounded-full bg-neutral-200" />
          </div>
          <div className="h-6 w-32 rounded bg-neutral-200" />
        </div>
        <div className="mb-6 flex gap-4">
          <div className="h-4 w-32 rounded bg-neutral-200" />
          <div className="h-4 w-32 rounded bg-neutral-200" />
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-neutral-100" />
          ))}
        </div>
        <div className="h-4 w-64 rounded bg-neutral-200" />
      </div>
    </div>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface CurrentSprintStatusErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

function CurrentSprintStatusError({
  message,
  onRetry,
  className,
}: CurrentSprintStatusErrorProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center rounded-lg border border-danger-200 bg-danger-50 p-8 text-center">
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
          Failed to Load Sprint
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
    </div>
  );
}

// =============================================================================
// Empty State
// =============================================================================

function NoSprintState({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
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
          No active sprint
        </h3>
        <p className="mt-2 text-body text-neutral-600">
          There is no sprint currently running. Check back soon!
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * CurrentSprintStatus displays the current sprint with statistics and actions.
 *
 * Features:
 * - Sprint header with status badge and countdown
 * - Statistics cards (submissions, yet to submit, participation)
 * - Admin action buttons (end sprint, extend sprint)
 * - Last update metadata
 * - Proper loading, error, and empty states
 *
 * @example
 * ```tsx
 * <CurrentSprintStatus />
 * ```
 */
export function CurrentSprintStatus({ className }: CurrentSprintStatusProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    endSprintMutation,
    extendSprintMutation,
  } = useCurrentSprint();

  // Memoize the fallback date to prevent infinite loops
  const fallbackDate = React.useMemo(
    () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    []
  );

  // Get countdown for the sprint
  const countdown = useCountdown(data?.sprint?.end_at || fallbackDate);

  // Loading state
  if (isLoading) {
    return <CurrentSprintStatusLoading className={className} />;
  }

  // Error state
  if (isError) {
    return (
      <CurrentSprintStatusError
        message={error?.message || 'Unable to load sprint data'}
        onRetry={() => refetch()}
        className={className}
      />
    );
  }

  // No sprint state
  if (!data) {
    return <NoSprintState className={className} />;
  }

  const { sprint, statistics, lastUpdate } = data;

  // Handlers for admin actions
  const handleEndSprint = () => {
    if (confirm('Are you sure you want to end this sprint and transition to the next phase?')) {
      endSprintMutation.mutate(user?.id);
    }
  };

  const handleExtendSprint = () => {
    if (confirm(`Extend this sprint by ${DEFAULT_EXTENSION_DAYS} days?`)) {
      extendSprintMutation.mutate(DEFAULT_EXTENSION_DAYS);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        {/* Sprint Header */}
        <SprintHeader sprint={sprint} countdown={countdown.formatted} />

        {/* Sprint Statistics */}
        <SprintStats stats={statistics} />

        {/* Admin Actions */}
        <SprintActions
          onEndSprint={handleEndSprint}
          onExtendSprint={handleExtendSprint}
          isEnding={endSprintMutation.isLoading}
          isExtending={extendSprintMutation.isLoading}
          isAdmin={isAdmin}
          extensionDays={DEFAULT_EXTENSION_DAYS}
        />

        {/* Last Update Metadata */}
        {lastUpdate && lastUpdate.updatedBy && (
          <SprintMetadata
            updatedBy={lastUpdate.updatedBy.name}
            updatedAt={lastUpdate.updatedAt}
          />
        )}
      </div>
    </div>
  );
}

export default CurrentSprintStatus;
