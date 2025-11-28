/**
 * StartNextSprint Component
 *
 * Main orchestrator component for starting a new sprint.
 * Handles challenge selection, sprint configuration, validation, and creation.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/components/Button';
import { Alert } from '@/ui/components/Alert';
import { FeatherPlay } from '@subframe/core';
import { useStartSprint } from '@/lib/hooks';
import { ChallengeSelector } from './challenge-selector';
import { ChallengePreview } from './challenge-preview';
import { SprintConfiguration } from './sprint-configuration';
import type { Challenge } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface StartNextSprintProps {
  /** Callback when a sprint is successfully created */
  onSprintCreated?: (sprintId: string) => void;
}

// =============================================================================
// Component
// =============================================================================

export function StartNextSprint({ onSprintCreated }: StartNextSprintProps) {
  const router = useRouter();
  const {
    availableChallenges,
    selectRandomChallenge,
    validateDates,
    createSprintMutation,
    getNextNumber,
  } = useStartSprint();

  // Form state
  const [selectedChallengeId, setSelectedChallengeId] = useState<
    string | undefined
  >(undefined);
  const [selectedChallenge, setSelectedChallenge] = useState<
    Challenge | null
  >(null);
  const [sprintName, setSprintName] = useState('');
  const [startTimeOption, setStartTimeOption] = useState<'now' | 'custom'>('now');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    undefined
  );
  const [durationOption, setDurationOption] = useState<
    '1-week' | '2-weeks' | 'custom'
  >('2-weeks');
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [retroDay, setRetroDay] = useState<Date | undefined>(undefined);
  const [skillFocus, setSkillFocus] = useState('');

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    challenge?: string;
    sprintName?: string;
    startDate?: string;
    endDate?: string;
    retroDay?: string;
  }>({});
  const [dateValidationError, setDateValidationError] = useState<string | null>(
    null
  );
  const [isValidating, setIsValidating] = useState(false);

  // Update selected challenge when ID changes
  useEffect(() => {
    if (selectedChallengeId && availableChallenges.data) {
      const challenge = availableChallenges.data.find(
        (c) => c.id === selectedChallengeId
      );
      setSelectedChallenge(challenge || null);
    } else {
      setSelectedChallenge(null);
    }
  }, [selectedChallengeId, availableChallenges.data]);

  // Handle random challenge selection
  const handleRandomSelect = useCallback(async () => {
    const randomChallenge = await selectRandomChallenge();
    if (randomChallenge) {
      setSelectedChallengeId(randomChallenge.id);
    }
  }, [selectRandomChallenge]);

  // Calculate end date based on duration option
  const calculateEndDate = useCallback((): Date | null => {
    const startDate =
      startTimeOption === 'custom' && customStartDate
        ? customStartDate
        : new Date();

    if (durationOption === '1-week') {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      return endDate;
    } else if (durationOption === '2-weeks') {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);
      return endDate;
    } else if (durationOption === 'custom' && customEndDate) {
      return customEndDate;
    }

    return null;
  }, [startTimeOption, customStartDate, durationOption, customEndDate]);

  // Validate dates when they change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (
        (startTimeOption === 'custom' && customStartDate) ||
        durationOption === 'custom'
      ) {
        const startDate =
          startTimeOption === 'custom' && customStartDate
            ? customStartDate
            : new Date();
        const endDate = calculateEndDate();

        if (endDate) {
          setIsValidating(true);
          try {
            const result = await validateDates(startDate, endDate);
            if (!result.valid) {
              setDateValidationError(result.error || 'Invalid dates');
            } else {
              setDateValidationError(null);
            }
          } catch (error) {
            console.error('Date validation error:', error);
          } finally {
            setIsValidating(false);
          }
        }
      } else {
        setDateValidationError(null);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [
    startTimeOption,
    customStartDate,
    durationOption,
    customEndDate,
    validateDates,
    calculateEndDate,
  ]);

  // Calculate duration in days
  const calculateDurationDays = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Generate sprint name from challenge and number
  const generateSprintName = (number: number, challengeTitle?: string): string => {
    return `Sprint #${number} - ${challengeTitle || 'New Sprint'}`;
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validate challenge selection
    if (!selectedChallengeId) {
      errors.challenge = 'Please select a challenge';
    }

    // Validate custom start date
    if (startTimeOption === 'custom' && !customStartDate) {
      errors.startDate = 'Please select a start date';
    }

    // Validate custom end date
    if (durationOption === 'custom' && !customEndDate) {
      errors.endDate = 'Please select an end date';
    }

    // Validate end date is after start date
    const startDate =
      startTimeOption === 'custom' && customStartDate
        ? customStartDate
        : new Date();
    const endDate = calculateEndDate();
    if (endDate && endDate <= startDate) {
      errors.endDate = 'End date must be after start date';
    }

    // Check for date validation errors
    if (dateValidationError) {
      errors.endDate = dateValidationError;
    }

    // Retro day warning (soft validation)
    if (retroDay && retroDay < new Date()) {
      errors.retroDay = 'Warning: Retro day is in the past. Are you sure?';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedChallengeId) {
      return;
    }

    // Get next sprint number
    // Note: While there's a potential race condition here with concurrent submissions,
    // PocketBase's unique constraint on sprint_number will handle duplicates gracefully
    const nextNumber = await getNextNumber();

    // Prepare sprint data
    const startDate =
      startTimeOption === 'custom' && customStartDate
        ? customStartDate
        : new Date();
    const endDate = calculateEndDate();

    if (!endDate) {
      setValidationErrors({ endDate: 'Invalid end date' });
      return;
    }

    const durationDays = calculateDurationDays(startDate, endDate);

    // Auto-generate sprint name if not provided
    const finalSprintName = sprintName.trim() || generateSprintName(nextNumber, selectedChallenge?.title);

    // Determine status based on start time
    const status: 'active' | 'scheduled' = startTimeOption === 'now' ? 'active' : 'scheduled';

    // Format retro_day as ISO date string (YYYY-MM-DD)
    const retroDayFormatted = retroDay
      ? retroDay.toISOString().split('T')[0]
      : null;

    // Create sprint data
    const sprintData = {
      sprint_number: nextNumber,
      name: finalSprintName,
      challenge_id: selectedChallengeId,
      status,
      start_at: startDate.toISOString(),
      end_at: endDate.toISOString(),
      retro_day: retroDayFormatted,
      duration_days: durationDays,
    };

    // Create sprint
    createSprintMutation.mutate(sprintData);
  };

  // Handle successful sprint creation
  useEffect(() => {
    if (createSprintMutation.isSuccess && createSprintMutation.data) {
      // Call callback if provided
      if (onSprintCreated) {
        onSprintCreated(createSprintMutation.data.id);
      }

      // TODO: Show success toast notification
      // Example: toast.success(`Sprint #${createSprintMutation.data.sprint_number} created successfully!`);

      // Redirect to Challenge Hub
      router.push('/challenge-hub');
    }
  }, [createSprintMutation.isSuccess, createSprintMutation.data, router, onSprintCreated]);

  // Form is valid if no errors and not validating
  const isFormValid =
    !isValidating &&
    !dateValidationError &&
    selectedChallengeId &&
    Object.keys(validationErrors).filter(
      (key) => key !== 'retroDay' // Retro day is a soft warning
    ).length === 0;

  return (
    <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-center gap-2">
        <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
          Start Next Sprint
        </span>
      </div>

      {/* Challenge error alert */}
      {availableChallenges.error && (
        <Alert
          variant="error"
          title="Failed to load challenges"
          description={availableChallenges.error.message}
        />
      )}

      {/* Date validation error alert */}
      {dateValidationError && (
        <Alert variant="error" title="Date validation error" description={dateValidationError} />
      )}

      {/* Sprint creation error alert */}
      {createSprintMutation.error && (
        <Alert
          variant="error"
          title="Failed to create sprint"
          description={createSprintMutation.error.message}
        />
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex w-full items-start gap-6 mobile:flex-col mobile:flex-nowrap mobile:gap-6">
          {/* Left column: Configuration */}
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
            {/* Choose Challenge */}
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Choose Challenge
              </span>
              <ChallengeSelector
                challenges={availableChallenges.data}
                value={selectedChallengeId}
                onChange={setSelectedChallengeId}
                onRandomSelect={handleRandomSelect}
                isLoading={availableChallenges.isLoading}
                error={availableChallenges.error?.message || null}
                onRetry={availableChallenges.refetch}
              />
              {validationErrors.challenge && (
                <span className="text-body font-body text-error-font">
                  {validationErrors.challenge}
                </span>
              )}
            </div>

            {/* Sprint Configuration */}
            <SprintConfiguration
              sprintName={sprintName}
              onSprintNameChange={setSprintName}
              startTimeOption={startTimeOption}
              onStartTimeOptionChange={setStartTimeOption}
              customStartDate={customStartDate}
              onCustomStartDateChange={setCustomStartDate}
              durationOption={durationOption}
              onDurationOptionChange={setDurationOption}
              customEndDate={customEndDate}
              onCustomEndDateChange={setCustomEndDate}
              retroDay={retroDay}
              onRetroDayChange={setRetroDay}
              skillFocus={skillFocus}
              onSkillFocusChange={setSkillFocus}
              errors={validationErrors}
            />

            {/* Action Buttons */}
            <div className="flex w-full flex-col items-start gap-2">
              <Button
                type="submit"
                icon={<FeatherPlay />}
                disabled={!isFormValid || createSprintMutation.isLoading}
                loading={createSprintMutation.isLoading}
              >
                {createSprintMutation.isLoading ? 'Creating...' : 'Start Sprint'}
              </Button>
              <span className="text-body font-body text-subtext-color">
                Starting this sprint will notify the team, open submissions, and
                set this challenge as the active sprint.
              </span>
            </div>
          </div>

          {/* Right column: Challenge Preview */}
          <div className="flex w-80 flex-none flex-col items-start">
            <ChallengePreview
              challenge={selectedChallenge}
              isLoading={availableChallenges.isLoading}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default StartNextSprint;
