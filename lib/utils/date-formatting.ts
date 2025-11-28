/**
 * Date Formatting Utilities
 *
 * Provides utility functions for formatting dates and countdown timers
 * used throughout the Challenge Hub feature.
 */

/**
 * Formats countdown time components into a human-readable string.
 *
 * @param days - Number of days remaining
 * @param hours - Number of hours remaining (0-23)
 * @param minutes - Number of minutes remaining (0-59)
 * @param seconds - Number of seconds remaining (0-59)
 * @returns Formatted countdown string based on the largest non-zero time unit
 *
 * @example
 * formatCountdownTime(2, 5, 30, 45) // "2 days 5 hours remaining"
 * formatCountdownTime(0, 3, 15, 0)  // "3 hours 15 min remaining"
 * formatCountdownTime(0, 0, 10, 30) // "10 min 30 sec remaining"
 * formatCountdownTime(0, 0, 0, 45)  // "45 sec remaining"
 */
export function formatCountdownTime(
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): string {
  // Handle days format
  if (days > 0) {
    const dayLabel = days === 1 ? 'day' : 'days';
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    return `${days} ${dayLabel} ${hours} ${hourLabel} remaining`;
  }

  // Handle hours format
  if (hours > 0) {
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    return `${hours} ${hourLabel} ${minutes} min remaining`;
  }

  // Handle minutes format
  if (minutes > 0) {
    return `${minutes} min ${seconds} sec remaining`;
  }

  // Handle seconds only
  return `${seconds} sec remaining`;
}

/**
 * Urgency color type for countdown displays
 */
export type UrgencyColor = 'green' | 'yellow' | 'red' | 'gray';

/**
 * Determines the urgency color for a countdown display based on remaining time.
 *
 * @param totalHours - Total hours remaining until deadline
 * @param isExpired - Whether the deadline has already passed
 * @returns The urgency color to use for display
 *
 * @example
 * getCountdownUrgencyColor(100, false) // 'green' - more than 3 days
 * getCountdownUrgencyColor(48, false)  // 'yellow' - 1-3 days
 * getCountdownUrgencyColor(12, false)  // 'red' - less than 1 day
 * getCountdownUrgencyColor(0, true)    // 'gray' - expired
 */
export function getCountdownUrgencyColor(
  totalHours: number,
  isExpired: boolean
): UrgencyColor {
  // Expired state takes precedence
  if (isExpired) {
    return 'gray';
  }

  // More than 3 days remaining
  if (totalHours > 72) {
    return 'green';
  }

  // 1-3 days remaining (24-72 hours inclusive)
  if (totalHours >= 24) {
    return 'yellow';
  }

  // Less than 1 day remaining
  return 'red';
}

/**
 * Formats a date for display in short format (e.g., badge tooltips).
 * Uses UTC timezone for consistent formatting across all environments.
 *
 * @param date - Date object or ISO 8601 date string to format
 * @returns Formatted date string in "Mon DD, YYYY" format (e.g., "Nov 27, 2025")
 * @throws TypeError if the input cannot be parsed as a valid date
 *
 * @example
 * formatDateShort(new Date('2025-11-27T10:30:00Z')) // "Nov 27, 2025"
 * formatDateShort('2025-12-15T00:00:00Z')          // "Dec 15, 2025"
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Validate the date
  if (isNaN(dateObj.getTime())) {
    throw new TypeError('Invalid date provided to formatDateShort');
  }

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
