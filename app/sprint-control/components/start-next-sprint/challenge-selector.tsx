/**
 * ChallengeSelector Component
 *
 * Dropdown selector for choosing a challenge for the sprint.
 * Includes a "Random" option that triggers random challenge selection.
 */

'use client';

import React from 'react';
import { Select } from '@/ui/components/Select';
import { Button } from '@/ui/components/Button';
import type { Challenge } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface ChallengeSelectorProps {
  /** Available challenges to display */
  challenges: Challenge[] | undefined;
  /** Currently selected challenge ID */
  value: string | undefined;
  /** Callback when a challenge is selected */
  onChange: (challengeId: string) => void;
  /** Callback when "Random" is selected */
  onRandomSelect: () => void;
  /** Whether the selector is loading */
  isLoading?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Callback to retry loading */
  onRetry?: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function ChallengeSelector({
  challenges,
  value,
  onChange,
  onRandomSelect,
  isLoading = false,
  error = null,
  onRetry,
}: ChallengeSelectorProps) {
  // Handle selection change
  const handleValueChange = (newValue: string) => {
    if (newValue === 'random') {
      onRandomSelect();
    } else {
      onChange(newValue);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Select
        className="h-auto w-full flex-none"
        label=""
        placeholder="Loading challenges..."
        helpText=""
        disabled
        value=""
        onValueChange={() => {}}
      >
        <Select.Item value="loading">Loading...</Select.Item>
      </Select>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex w-full flex-col items-start gap-2">
        <Select
          className="h-auto w-full flex-none"
          label=""
          placeholder="Failed to load challenges"
          helpText=""
          disabled
          value=""
          onValueChange={() => {}}
        >
          <Select.Item value="error">Error loading challenges</Select.Item>
        </Select>
        <div className="flex w-full items-center gap-2 rounded-md bg-error-background px-3 py-2">
          <span className="grow text-body font-body text-error-font">{error}</span>
          {onRetry && (
            <Button variant="neutral-secondary" size="small" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  // No challenges available
  if (!challenges || challenges.length === 0) {
    return (
      <div className="flex w-full flex-col items-start gap-2">
        <Select
          className="h-auto w-full flex-none"
          label=""
          placeholder="No challenges available"
          helpText=""
          disabled
          value=""
          onValueChange={() => {}}
        >
          <Select.Item value="none">No challenges available</Select.Item>
        </Select>
        <div className="flex w-full flex-col items-start gap-1 rounded-md bg-warning-background px-3 py-2">
          <span className="text-body-bold font-body-bold text-warning-font">
            No available challenges for this year
          </span>
          <span className="text-body font-body text-warning-font">
            All challenges have been used this year. New challenges will be
            available on January 1 of next year.
          </span>
        </div>
      </div>
    );
  }

  // Normal state with challenges
  return (
    <Select
      className="h-auto w-full flex-none"
      label=""
      placeholder="Select a challenge"
      helpText=""
      value={value}
      onValueChange={handleValueChange}
    >
      {/* Random option with dice emoji */}
      <Select.Item value="random">🎲 Random</Select.Item>

      {/* Challenge options */}
      {challenges.map((challenge) => (
        <Select.Item key={challenge.id} value={challenge.id}>
          Challenge #{challenge.challenge_number}: {challenge.title}
        </Select.Item>
      ))}
    </Select>
  );
}

export default ChallengeSelector;
