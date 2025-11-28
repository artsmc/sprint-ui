/**
 * Last Sprint Retrospective Component
 *
 * Displays the retrospective summary for the most recent completed sprint.
 * Shows statistics (submissions, votes, comments) and qualitative feedback
 * (what was good, what can improve, what was asked).
 *
 * @module app/challenge-hub/components/last-sprint-retrospective
 */

'use client';

import React from 'react';
import { IconWithBackground } from '@/ui/components/IconWithBackground';
import { LinkButton } from '@/ui/components/LinkButton';
import {
  FeatherAlertCircle,
  FeatherBookOpen,
  FeatherCheckCircle,
  FeatherClipboard,
  FeatherMessageSquare,
  FeatherThumbsUp,
  FeatherUsers,
} from '@subframe/core';
import { useLastSprintRetrospective } from '@/lib/hooks';

// =============================================================================
// Types
// =============================================================================

/**
 * Props for the LastSprintRetrospective component.
 */
export interface LastSprintRetrospectiveProps {
  /** Optional className for custom styling */
  className?: string;
  /** Optional callback when "View Full Results" is clicked */
  onViewFullResults?: () => void;
}

// =============================================================================
// Loading State Component
// =============================================================================

/**
 * Skeleton loading state for the retrospective section.
 */
function LoadingSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md animate-pulse">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-neutral-200 rounded-md" />
          <div className="w-64 h-7 bg-neutral-200 rounded" />
        </div>
        <div className="w-32 h-9 bg-neutral-200 rounded" />
      </div>
      <div className="flex w-full items-center gap-6">
        <div className="w-32 h-5 bg-neutral-200 rounded" />
        <div className="w-24 h-5 bg-neutral-200 rounded" />
        <div className="w-32 h-5 bg-neutral-200 rounded" />
      </div>
      <div className="flex w-full items-start gap-4 rounded-md bg-neutral-50 px-6 py-6">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
          <div className="w-40 h-5 bg-neutral-200 rounded" />
          <div className="w-full h-16 bg-neutral-200 rounded" />
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
          <div className="w-48 h-5 bg-neutral-200 rounded" />
          <div className="w-full h-16 bg-neutral-200 rounded" />
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
          <div className="w-36 h-5 bg-neutral-200 rounded" />
          <div className="w-full h-16 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Empty State Component
// =============================================================================

/**
 * Empty state when no retrospective data is available.
 */
function EmptyState() {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
      <div className="flex items-center gap-2">
        <IconWithBackground
          variant="neutral"
          size="medium"
          icon={<FeatherBookOpen />}
        />
        <span className="text-heading-2 font-heading-2 text-default-font">
          Last Sprint Retrospective
        </span>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 py-12">
        <FeatherBookOpen className="text-[48px] text-neutral-400" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-body-bold font-body-bold text-default-font">
            No retrospective data yet
          </span>
          <span className="text-body font-body text-subtext-color text-center">
            Retrospective data will appear here after a sprint is completed
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Error State Component
// =============================================================================

/**
 * Error state when data fetching fails.
 */
function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-error-300 bg-error-50 px-8 py-8 shadow-md">
      <div className="flex items-center gap-2">
        <IconWithBackground
          variant="error"
          size="medium"
          icon={<FeatherAlertCircle />}
        />
        <span className="text-heading-2 font-heading-2 text-default-font">
          Last Sprint Retrospective
        </span>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 py-8">
        <FeatherAlertCircle className="text-[48px] text-error-600" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-body-bold font-body-bold text-default-font">
            Unable to load retrospective data
          </span>
          <span className="text-body font-body text-subtext-color text-center">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * LastSprintRetrospective Component
 *
 * Fetches and displays the retrospective summary for the most recent completed sprint.
 * Includes loading, empty, and error states.
 *
 * @example
 * ```tsx
 * <LastSprintRetrospective
 *   onViewFullResults={() => router.push('/retrospectives/123')}
 * />
 * ```
 */
export function LastSprintRetrospective({
  className = '',
  onViewFullResults,
}: LastSprintRetrospectiveProps) {
  const { data, isLoading, error } = useLastSprintRetrospective();

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error.message} />;
  }

  // Empty state (no data)
  if (!data) {
    return <EmptyState />;
  }

  // Success state - display retrospective data
  const { sprint, challenge, summary } = data;

  return (
    <div
      className={`flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md ${className}`}
    >
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <IconWithBackground
            variant="neutral"
            size="medium"
            icon={<FeatherBookOpen />}
          />
          <span className="text-heading-2 font-heading-2 text-default-font">
            Last Sprint Retrospective
          </span>
        </div>
        <LinkButton
          variant="brand"
          onClick={() => {
            if (onViewFullResults) {
              onViewFullResults();
            } else {
              // TODO: Navigate to full retrospective page
              console.log('View full results for sprint:', sprint.id);
            }
          }}
        >
          View Full Results
        </LinkButton>
      </div>

      {/* Statistics */}
      <div className="flex w-full items-center gap-6">
        <div className="flex items-center gap-2">
          <FeatherUsers className="text-body font-body text-subtext-color" />
          <span className="text-body font-body text-default-font">
            {summary.submissions_count}{' '}
            {summary.submissions_count === 1 ? 'submission' : 'submissions'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FeatherThumbsUp className="text-body font-body text-subtext-color" />
          <span className="text-body font-body text-default-font">
            {summary.votes_count} {summary.votes_count === 1 ? 'vote' : 'votes'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FeatherMessageSquare className="text-body font-body text-subtext-color" />
          <span className="text-body font-body text-default-font">
            {summary.comments_count}{' '}
            {summary.comments_count === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      </div>

      {/* Feedback Sections */}
      <div className="flex w-full items-start gap-4 rounded-md bg-neutral-50 px-6 py-6">
        {/* What was good */}
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <FeatherCheckCircle className="text-body font-body text-success-600" />
            <span className="text-body-bold font-body-bold text-default-font">
              What was good
            </span>
          </div>
          <span className="text-body font-body text-subtext-color">
            {summary.what_was_good ||
              'No feedback provided for this section yet.'}
          </span>
        </div>

        {/* What can be improved */}
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <FeatherAlertCircle className="text-body font-body text-warning-600" />
            <span className="text-body-bold font-body-bold text-default-font">
              What can be improved
            </span>
          </div>
          <span className="text-body font-body text-subtext-color">
            {summary.what_can_improve ||
              'No feedback provided for this section yet.'}
          </span>
        </div>

        {/* What was asked */}
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <FeatherClipboard className="text-body font-body text-brand-600" />
            <span className="text-body-bold font-body-bold text-default-font">
              What was asked
            </span>
          </div>
          <span className="text-body font-body text-subtext-color">
            {/* Use challenge title/brief as fallback if what_was_asked is not set */}
            {summary.what_was_asked || challenge.title}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LastSprintRetrospective;
