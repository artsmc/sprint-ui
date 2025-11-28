/**
 * useCountdown Hook
 *
 * Custom React hook for countdown timer functionality.
 * Updates every second and provides formatted time display.
 *
 * @module lib/hooks/use-countdown
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  formatCountdownTime,
  getCountdownUrgencyColor,
  type UrgencyColor,
} from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Breakdown of time remaining in a countdown.
 */
export interface CountdownTime {
  /** Days remaining */
  days: number;
  /** Hours remaining (0-23) */
  hours: number;
  /** Minutes remaining (0-59) */
  minutes: number;
  /** Seconds remaining (0-59) */
  seconds: number;
  /** Total milliseconds remaining */
  totalMs: number;
  /** Whether the countdown has expired */
  isExpired: boolean;
}

/**
 * Result returned by the useCountdown hook.
 */
export interface UseCountdownResult {
  /** Breakdown of time remaining */
  time: CountdownTime;
  /** Human-readable formatted countdown string */
  formatted: string;
  /** Urgency color based on time remaining */
  urgencyColor: UrgencyColor;
  /** Whether the countdown has expired */
  isExpired: boolean;
}

// =============================================================================
// Constants
// =============================================================================

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate time remaining until the end date.
 *
 * @param endDate - The target end date
 * @returns CountdownTime object with time breakdown
 */
function calculateTimeRemaining(endDate: Date): CountdownTime {
  const now = Date.now();
  const end = endDate.getTime();
  const difference = end - now;

  // Handle expired state
  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isExpired: true,
    };
  }

  // Calculate time components
  const days = Math.floor(difference / ONE_DAY);
  const hours = Math.floor((difference % ONE_DAY) / ONE_HOUR);
  const minutes = Math.floor((difference % ONE_HOUR) / ONE_MINUTE);
  const seconds = Math.floor((difference % ONE_MINUTE) / ONE_SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: difference,
    isExpired: false,
  };
}

/**
 * Calculate total hours from countdown time.
 *
 * @param time - CountdownTime object
 * @returns Total hours remaining
 */
function getTotalHours(time: CountdownTime): number {
  return time.days * 24 + time.hours + time.minutes / 60;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for countdown timer functionality.
 *
 * Provides real-time countdown updates every second, with formatted
 * display string and urgency color coding.
 *
 * @param endDate - The target end date (Date object or ISO string)
 * @returns UseCountdownResult with time breakdown, formatted string, and urgency color
 *
 * @example
 * ```tsx
 * function SprintCountdown({ deadline }: { deadline: string }) {
 *   const { formatted, urgencyColor, isExpired } = useCountdown(deadline);
 *
 *   if (isExpired) {
 *     return <Badge variant="neutral">Ended</Badge>;
 *   }
 *
 *   return (
 *     <Badge className={colorClasses[urgencyColor]}>
 *       {formatted}
 *     </Badge>
 *   );
 * }
 * ```
 */
export function useCountdown(endDate: string | Date): UseCountdownResult {
  // Memoize the target timestamp to prevent infinite loops
  const targetTimestamp = useMemo(() => {
    const date = endDate instanceof Date ? endDate : new Date(endDate);
    return date.getTime();
  }, [endDate]);

  // Calculate initial time remaining
  const [time, setTime] = useState<CountdownTime>(() => {
    return calculateTimeRemaining(new Date(targetTimestamp));
  });

  useEffect(() => {
    const targetDate = new Date(targetTimestamp);

    // Reset state when endDate changes
    setTime(calculateTimeRemaining(targetDate));

    // Don't start interval if already expired
    if (targetTimestamp <= Date.now()) {
      return;
    }

    // Update every second
    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining(targetDate);
      setTime(newTime);

      // Clear interval if expired
      if (newTime.isExpired) {
        clearInterval(interval);
      }
    }, ONE_SECOND);

    // Cleanup on unmount or endDate change
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  // Calculate derived values
  const formatted = time.isExpired
    ? 'Ended'
    : formatCountdownTime(time.days, time.hours, time.minutes, time.seconds);

  const totalHours = getTotalHours(time);
  const urgencyColor = getCountdownUrgencyColor(totalHours, time.isExpired);

  return {
    time,
    formatted,
    urgencyColor,
    isExpired: time.isExpired,
  };
}

// =============================================================================
// Utility Re-exports
// =============================================================================

// Re-export utility functions for convenience
export { formatCountdownTime, getCountdownUrgencyColor };
export type { UrgencyColor };
