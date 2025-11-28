/**
 * Challenge Hub Header Component
 *
 * Displays the header section of the Challenge Hub page including
 * the title, subtitle, and action buttons.
 *
 * @module app/challenge-hub/components/challenge-hub-header
 */

'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/components/Button';
import { JoinSprintButton } from './join-sprint-button';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface ChallengeHubHeaderProps {
  /** Whether the current user is an admin */
  isAdmin?: boolean;
  /** Whether the user is already participating in the active sprint */
  isParticipant?: boolean;
  /** The ID of the active sprint (required for JoinSprintButton) */
  activeSprintId?: string;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Header component for the Challenge Hub page.
 *
 * Displays:
 * - Page title "Design Challenge Hub"
 * - Descriptive subtitle
 * - "My Submissions" button
 * - "Sprint Control" button (admin only)
 * - JoinSprintButton (when not participating and sprint is active)
 *
 * @example
 * ```tsx
 * <ChallengeHubHeader
 *   isAdmin={false}
 *   isParticipant={true}
 *   activeSprintId="sprint-123"
 * />
 * ```
 */
export function ChallengeHubHeader({
  isAdmin = false,
  isParticipant = false,
  activeSprintId,
  className,
}: ChallengeHubHeaderProps) {
  const showJoinButton = !isParticipant && activeSprintId;

  return (
    <header className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Design Challenge Hub
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Join biweekly design challenges, get feedback from peers, and level up your skills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/submissions">
            <Button variant="neutral-secondary">My Submissions</Button>
          </Link>

          {isAdmin && (
            <Link href="/admin/sprints">
              <Button variant="neutral-secondary">Sprint Control</Button>
            </Link>
          )}

          {showJoinButton && (
            <JoinSprintButton sprintId={activeSprintId} />
          )}
        </div>
      </div>
    </header>
  );
}

export default ChallengeHubHeader;
