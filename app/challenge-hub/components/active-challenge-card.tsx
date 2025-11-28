/**
 * ActiveChallengeCard Component
 *
 * Displays the current active sprint challenge with countdown timer,
 * challenge details, and action buttons.
 *
 * @module app/challenge-hub/components/active-challenge-card
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Badge } from '@/app/ui/components/Badge';
import { Button } from '@/app/ui/components/Button';
import { Dialog } from '@/app/ui/components/Dialog';
import { IconButton } from '@/app/ui/components/IconButton';
import { CountdownTimer } from './countdown-timer';
import { cn } from '@/lib/utils';
import type { Sprint, Challenge } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface ActiveChallengeCardProps {
  /** The current sprint data */
  sprint: Sprint;
  /** The challenge data for the sprint */
  challenge: Challenge;
  /** Whether the current user is participating in this sprint */
  isParticipant: boolean;
  /** Optional CSS class name */
  className?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the deadline date based on sprint status
 */
function getDeadline(sprint: Sprint): string | null {
  switch (sprint.status) {
    case 'active':
      return sprint.end_at;
    case 'voting':
      return sprint.voting_end_at;
    case 'retro':
      return sprint.retro_day;
    default:
      return sprint.end_at;
  }
}

/**
 * Get the phase label based on sprint status
 */
function getPhaseLabel(status: Sprint['status']): string {
  switch (status) {
    case 'active':
      return 'Submission Phase';
    case 'voting':
      return 'Voting Phase';
    case 'retro':
      return 'Retrospective';
    case 'completed':
      return 'Completed';
    default:
      return 'Active Challenge';
  }
}

/**
 * Get badge variant based on sprint status
 */
function getStatusVariant(status: Sprint['status']): 'brand' | 'warning' | 'success' | 'neutral' {
  switch (status) {
    case 'active':
      return 'brand';
    case 'voting':
      return 'warning';
    case 'retro':
    case 'completed':
      return 'success';
    default:
      return 'neutral';
  }
}

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Strip HTML tags from a string (for brief preview)
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// =============================================================================
// Component
// =============================================================================

/**
 * ActiveChallengeCard displays the current sprint challenge.
 *
 * Features:
 * - Status badge showing current phase
 * - Countdown timer to next deadline
 * - Challenge title and truncated description
 * - "View Brief" button that opens full challenge modal
 * - "Upload Design" button for participants
 *
 * @example
 * ```tsx
 * <ActiveChallengeCard
 *   sprint={activeSprint}
 *   challenge={challenge}
 *   isParticipant={true}
 * />
 * ```
 */
export function ActiveChallengeCard({
  sprint,
  challenge,
  isParticipant,
  className,
}: ActiveChallengeCardProps) {
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const deadline = getDeadline(sprint);
  const phaseLabel = getPhaseLabel(sprint.status);
  const statusVariant = getStatusVariant(sprint.status);

  // Get plain text description for preview
  const descriptionPreview = challenge.brief
    ? truncateText(stripHtml(challenge.brief), 150)
    : 'No description available';

  // Determine if upload is allowed (only during active submission phase)
  const canUpload = sprint.status === 'active' && isParticipant;

  return (
    <>
      <div
        className={cn(
          'rounded-lg border-2 border-brand-200 bg-gradient-to-br from-white to-brand-50 p-5 shadow-md',
          className
        )}
      >
        {/* Header Row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant}>{phaseLabel}</Badge>
            <span className="text-caption text-neutral-500">
              Sprint {sprint.sprint_number}
            </span>
          </div>
          {deadline && (
            <CountdownTimer endDate={deadline} prefix="Ends in" />
          )}
        </div>

        {/* Challenge Info */}
        <div className="mb-4">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">
            Challenge #{challenge.challenge_number}: {challenge.title}
          </h2>
          <p className="mt-2 text-body text-neutral-600">
            {descriptionPreview}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="neutral-secondary"
            onClick={() => setIsBriefOpen(true)}
          >
            View Brief
          </Button>
          {canUpload && (
            <Link href={`/sprints/${sprint.id}/submit`}>
              <Button variant="brand-primary">Upload Design</Button>
            </Link>
          )}
          {sprint.status === 'voting' && isParticipant && (
            <Link href={`/sprints/${sprint.id}/vote`}>
              <Button variant="brand-primary">Vote Now</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Challenge Brief Modal */}
      <Dialog open={isBriefOpen} onOpenChange={setIsBriefOpen}>
        <Dialog.Content className="max-w-2xl">
          <div className="w-full p-6">
            {/* Modal Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge variant={statusVariant} className="mb-2">
                  Challenge #{challenge.challenge_number}
                </Badge>
                <h2 className="text-heading-2 font-heading-2 text-neutral-900">
                  {challenge.title}
                </h2>
              </div>
              <IconButton
                icon={<X className="h-5 w-5" />}
                onClick={() => setIsBriefOpen(false)}
                aria-label="Close"
              />
            </div>

            {/* Brief Content */}
            <div
              className="prose prose-sm max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: challenge.brief }}
            />

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <Button
                variant="neutral-secondary"
                onClick={() => setIsBriefOpen(false)}
              >
                Close
              </Button>
              {canUpload && (
                <Link href={`/sprints/${sprint.id}/submit`}>
                  <Button variant="brand-primary">Upload Design</Button>
                </Link>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

export default ActiveChallengeCard;
