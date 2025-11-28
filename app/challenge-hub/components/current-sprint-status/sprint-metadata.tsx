/**
 * SprintMetadata Component
 *
 * Displays last update information for the sprint.
 *
 * @module app/challenge-hub/components/current-sprint-status/sprint-metadata
 */

'use client';

import React from 'react';
import { FeatherClock } from '@subframe/core';

// =============================================================================
// Types
// =============================================================================

export interface SprintMetadataProps {
  /** Name of the user who last updated the sprint */
  updatedBy: string;
  /** ISO timestamp of the last update */
  updatedAt: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format a timestamp to a relative time string.
 */
function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// =============================================================================
// Component
// =============================================================================

/**
 * SprintMetadata displays information about the last update to the sprint.
 *
 * @example
 * ```tsx
 * <SprintMetadata
 *   updatedBy="John Doe"
 *   updatedAt="2024-01-15T10:30:00Z"
 * />
 * ```
 */
export function SprintMetadata({ updatedBy, updatedAt }: SprintMetadataProps) {
  return (
    <div className="flex items-center gap-2 text-caption text-subtext-color">
      <FeatherClock className="h-3.5 w-3.5" />
      <span>
        Last updated by {updatedBy} {formatRelativeTime(updatedAt)}
      </span>
    </div>
  );
}

export default SprintMetadata;
