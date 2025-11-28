/**
 * ChallengePreview Component
 *
 * Displays a preview of the selected challenge with title, description, and skills.
 */

'use client';

import React from 'react';
import { Badge } from '@/ui/components/Badge';
import type { Challenge } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface ChallengePreviewProps {
  /** The challenge to preview */
  challenge: Challenge | null | undefined;
  /** Whether the challenge is loading */
  isLoading?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function ChallengePreview({
  challenge,
  isLoading = false,
}: ChallengePreviewProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-neutral-50 px-6 py-6">
        <span className="text-heading-3 font-heading-3 text-default-font">
          Challenge Preview
        </span>
        <div className="flex w-full flex-col items-start gap-2">
          <div className="h-6 w-32 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-16 w-full animate-pulse rounded-md bg-neutral-200" />
        </div>
      </div>
    );
  }

  // Empty state
  if (!challenge) {
    return (
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-neutral-50 px-6 py-6">
        <span className="text-heading-3 font-heading-3 text-default-font">
          Challenge Preview
        </span>
        <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
          <span className="text-body font-body text-subtext-color text-center">
            Select a challenge to see details
          </span>
        </div>
      </div>
    );
  }

  // Extract plain text from HTML brief safely using DOMParser
  const getPlainTextBrief = (htmlBrief: string): string => {
    if (typeof window !== 'undefined') {
      // Client-side: Use DOMParser for safe HTML parsing
      const doc = new DOMParser().parseFromString(htmlBrief, 'text/html');
      return doc.body.textContent?.trim() || '';
    }
    // Server-side fallback: Simple tag removal (text will be sanitized on client)
    return htmlBrief.replace(/<[^>]*>/g, '').trim();
  };

  const plainTextBrief = getPlainTextBrief(challenge.brief);

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-neutral-50 px-6 py-6">
      <span className="text-heading-3 font-heading-3 text-default-font">
        Challenge Preview
      </span>

      {/* Challenge header */}
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">
            #{challenge.challenge_number}
          </Badge>
        </div>
        <span className="text-heading-2 font-heading-2 text-default-font">
          {challenge.title}
        </span>
      </div>

      {/* Challenge description */}
      <div className="max-h-48 w-full overflow-y-auto">
        <span className="text-body font-body text-subtext-color">
          {plainTextBrief}
        </span>
      </div>

      {/* TODO: Skills badges will be shown once skills are linked to challenges in the data model */}
    </div>
  );
}

export default ChallengePreview;
