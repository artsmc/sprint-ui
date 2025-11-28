/**
 * JoinSprintButton Component
 *
 * A button component that allows users to join the current sprint.
 * Handles loading states, error handling, and success notifications.
 *
 * @module app/challenge-hub/components/join-sprint-button
 */

'use client';

import { useJoinSprint } from '@/lib/hooks/use-join-sprint';
import { Button } from '@/app/ui/components/Button';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface JoinSprintButtonProps {
  /** The ID of the sprint to join */
  sprintId: string;
  /** The name of the sprint (for display in notifications) */
  sprintName?: string;
  /** Optional CSS class name */
  className?: string;
  /** Button size variant */
  size?: 'small' | 'medium' | 'large';
  /** Button variant */
  variant?: 'brand-primary' | 'brand-secondary' | 'neutral-secondary';
  /** Callback when join succeeds */
  onSuccess?: () => void;
  /** Callback when join fails */
  onError?: (error: Error) => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * JoinSprintButton provides a one-click way to join a sprint.
 *
 * Features:
 * - Loading state with spinner while joining
 * - Callbacks for success and error handling
 * - Automatic page refresh to update UI state
 *
 * @example
 * ```tsx
 * <JoinSprintButton
 *   sprintId="sprint-123"
 *   sprintName="Sprint 5"
 *   onSuccess={() => console.log('Joined!')}
 *   onError={(err) => console.error(err)}
 * />
 * ```
 */
export function JoinSprintButton({
  sprintId,
  // sprintName is available via props for parent components to use in callbacks
  className,
  size = 'medium',
  variant = 'brand-primary',
  onSuccess,
  onError,
}: JoinSprintButtonProps) {
  const { joinSprint, isJoining, error } = useJoinSprint();

  const handleClick = async () => {
    const result = await joinSprint(sprintId);

    if (result) {
      // Success callback
      onSuccess?.();
    } else if (error) {
      // Error callback
      onError?.(new Error(error.message));
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isJoining}
      loading={isJoining}
      variant={variant}
      size={size}
      className={cn(className)}
      aria-label={isJoining ? 'Joining sprint...' : 'Join sprint'}
    >
      {isJoining ? 'Joining...' : 'Join Sprint'}
    </Button>
  );
}

export default JoinSprintButton;
