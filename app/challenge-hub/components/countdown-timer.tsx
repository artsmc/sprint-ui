/**
 * CountdownTimer Component
 *
 * Displays a real-time countdown timer with urgency-based color coding.
 * Uses the useCountdown hook for time calculations and updates.
 *
 * @module app/challenge-hub/components/countdown-timer
 */

'use client';

import { useCountdown, type UrgencyColor } from '@/lib/hooks/use-countdown';
import { Badge } from '@/app/ui/components/Badge';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface CountdownTimerProps {
  /** The end date for the countdown (ISO string or Date object) */
  endDate: string | Date;
  /** Optional CSS class name */
  className?: string;
  /** Optional prefix text to display before the countdown */
  prefix?: string;
}

// =============================================================================
// Color Mapping
// =============================================================================

/**
 * Maps urgency colors to Badge variants
 */
const urgencyToBadgeVariant: Record<UrgencyColor, 'success' | 'warning' | 'error' | 'neutral'> = {
  green: 'success',
  yellow: 'warning',
  red: 'error',
  gray: 'neutral',
};

// =============================================================================
// Component
// =============================================================================

/**
 * CountdownTimer displays a real-time countdown with urgency-based styling.
 *
 * The countdown updates every second and changes color based on time remaining:
 * - Green (success): More than 3 days remaining
 * - Yellow (warning): 1-3 days remaining
 * - Red (error): Less than 1 day remaining
 * - Gray (neutral): Countdown has expired
 *
 * @example
 * ```tsx
 * <CountdownTimer endDate="2025-12-31T23:59:59Z" />
 * <CountdownTimer endDate={deadline} prefix="Ends in" />
 * ```
 */
export function CountdownTimer({
  endDate,
  className,
  prefix,
}: CountdownTimerProps) {
  const { formatted, urgencyColor, isExpired } = useCountdown(endDate);

  const variant = urgencyToBadgeVariant[urgencyColor];

  // Build the display text
  const displayText = prefix && !isExpired
    ? `${prefix} ${formatted}`
    : formatted;

  return (
    <Badge
      variant={variant}
      className={cn(
        // Add aria-live for accessibility - screen readers will announce updates
        'transition-colors duration-200',
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {displayText}
    </Badge>
  );
}

export default CountdownTimer;
