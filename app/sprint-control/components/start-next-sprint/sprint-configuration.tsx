/**
 * SprintConfiguration Component
 *
 * Form fields for configuring sprint settings (name, start time, duration, etc.)
 */

'use client';

import React from 'react';
import { TextField } from '@/ui/components/TextField';
import { Select } from '@/ui/components/Select';
import { Calendar } from '@/ui/components/Calendar';
import { Button } from '@/ui/components/Button';
import { FeatherCalendar } from '@subframe/core';
import * as SubframeCore from '@subframe/core';

// =============================================================================
// Types
// =============================================================================

export interface SprintConfigurationProps {
  /** Sprint name value */
  sprintName: string;
  /** Callback when sprint name changes */
  onSprintNameChange: (value: string) => void;

  /** Start time option ('now' or 'custom') */
  startTimeOption: 'now' | 'custom';
  /** Callback when start time option changes */
  onStartTimeOptionChange: (value: 'now' | 'custom') => void;

  /** Custom start date (only used when startTimeOption is 'custom') */
  customStartDate: Date | undefined;
  /** Callback when custom start date changes */
  onCustomStartDateChange: (date: Date | undefined) => void;

  /** Duration option ('1-week', '2-weeks', 'custom') */
  durationOption: '1-week' | '2-weeks' | 'custom';
  /** Callback when duration option changes */
  onDurationOptionChange: (value: '1-week' | '2-weeks' | 'custom') => void;

  /** Custom end date (only used when durationOption is 'custom') */
  customEndDate: Date | undefined;
  /** Callback when custom end date changes */
  onCustomEndDateChange: (date: Date | undefined) => void;

  /** Retro day date (optional) */
  retroDay: Date | undefined;
  /** Callback when retro day changes */
  onRetroDayChange: (date: Date | undefined) => void;

  /** Skill focus value (optional, max 50 chars) */
  skillFocus: string;
  /** Callback when skill focus changes */
  onSkillFocusChange: (value: string) => void;

  /** Validation errors to display */
  errors?: {
    sprintName?: string;
    startDate?: string;
    endDate?: string;
    retroDay?: string;
    skillFocus?: string;
  };
}

// =============================================================================
// Component
// =============================================================================

export function SprintConfiguration({
  sprintName,
  onSprintNameChange,
  startTimeOption,
  onStartTimeOptionChange,
  customStartDate,
  onCustomStartDateChange,
  durationOption,
  onDurationOptionChange,
  customEndDate,
  onCustomEndDateChange,
  retroDay,
  onRetroDayChange,
  skillFocus,
  onSkillFocusChange,
  errors = {},
}: SprintConfigurationProps) {
  // Handle skill focus change with character limit
  const handleSkillFocusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value.length <= 50) {
      onSkillFocusChange(value);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <span className="text-heading-3 font-heading-3 text-default-font">
        Configure Sprint
      </span>

      {/* Sprint Name */}
      <TextField
        className="h-auto w-full flex-none"
        label="Sprint name (optional)"
        helpText="Leave empty to auto-generate from challenge"
        error={!!errors.sprintName}
      >
        <TextField.Input
          placeholder="e.g., Sprint #6 - Dashboard Analytics"
          value={sprintName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onSprintNameChange(event.target.value);
          }}
        />
      </TextField>
      {errors.sprintName && (
        <span className="text-body font-body text-error-font">
          {errors.sprintName}
        </span>
      )}

      {/* Start Time Options */}
      <div className="flex w-full flex-col items-start gap-2">
        <span className="text-body-bold font-body-bold text-default-font">
          Start time
        </span>
        <div className="flex w-full items-center gap-2">
          <Button
            variant={startTimeOption === 'now' ? 'brand-primary' : 'neutral-secondary'}
            onClick={() => onStartTimeOptionChange('now')}
            aria-pressed={startTimeOption === 'now'}
          >
            Now
          </Button>
          <Button
            variant={startTimeOption === 'custom' ? 'brand-primary' : 'neutral-secondary'}
            onClick={() => onStartTimeOptionChange('custom')}
            aria-pressed={startTimeOption === 'custom'}
          >
            Custom
          </Button>
        </div>

        {/* Custom Start Date Picker */}
        {startTimeOption === 'custom' && (
          <SubframeCore.Popover.Root>
            <SubframeCore.Popover.Trigger asChild={true}>
              <Button
                className="h-auto w-full flex-none"
                variant="neutral-secondary"
                icon={<FeatherCalendar />}
              >
                {customStartDate
                  ? customStartDate.toLocaleDateString()
                  : 'Select start date'}
              </Button>
            </SubframeCore.Popover.Trigger>
            <SubframeCore.Popover.Portal>
              <SubframeCore.Popover.Content
                side="bottom"
                align="start"
                sideOffset={4}
                asChild={true}
              >
                <div className="flex flex-col items-start gap-1 rounded-md border border-solid border-neutral-border bg-default-background px-3 py-3 shadow-lg">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={onCustomStartDateChange}
                  />
                </div>
              </SubframeCore.Popover.Content>
            </SubframeCore.Popover.Portal>
          </SubframeCore.Popover.Root>
        )}
        {errors.startDate && (
          <span className="text-body font-body text-error-font">
            {errors.startDate}
          </span>
        )}
      </div>

      {/* Duration */}
      <div className="flex w-full flex-col items-start gap-2">
        <Select
          label="Duration"
          placeholder="Select duration"
          helpText=""
          value={durationOption}
          onValueChange={(value: string) =>
            onDurationOptionChange(value as '1-week' | '2-weeks' | 'custom')
          }
          error={!!errors.endDate}
        >
          <Select.Item value="1-week">1 week</Select.Item>
          <Select.Item value="2-weeks">2 weeks</Select.Item>
          <Select.Item value="custom">Custom</Select.Item>
        </Select>

        {/* Custom End Date Picker */}
        {durationOption === 'custom' && (
          <SubframeCore.Popover.Root>
            <SubframeCore.Popover.Trigger asChild={true}>
              <Button
                className="h-auto w-full flex-none"
                variant="neutral-secondary"
                icon={<FeatherCalendar />}
              >
                {customEndDate
                  ? customEndDate.toLocaleDateString()
                  : 'Select end date'}
              </Button>
            </SubframeCore.Popover.Trigger>
            <SubframeCore.Popover.Portal>
              <SubframeCore.Popover.Content
                side="bottom"
                align="start"
                sideOffset={4}
                asChild={true}
              >
                <div className="flex flex-col items-start gap-1 rounded-md border border-solid border-neutral-border bg-default-background px-3 py-3 shadow-lg">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={onCustomEndDateChange}
                  />
                </div>
              </SubframeCore.Popover.Content>
            </SubframeCore.Popover.Portal>
          </SubframeCore.Popover.Root>
        )}
        {errors.endDate && (
          <span className="text-body font-body text-error-font">
            {errors.endDate}
          </span>
        )}
      </div>

      {/* Retro Day */}
      <SubframeCore.Popover.Root>
        <SubframeCore.Popover.Trigger asChild={true}>
          <div className="flex w-full flex-col items-start gap-1">
            <span className="text-body-bold font-body-bold text-default-font">
              Retro day (optional)
            </span>
            <Button
              className="h-auto w-full flex-none"
              variant="neutral-secondary"
              icon={<FeatherCalendar />}
            >
              {retroDay ? retroDay.toLocaleDateString() : 'Select date'}
            </Button>
          </div>
        </SubframeCore.Popover.Trigger>
        <SubframeCore.Popover.Portal>
          <SubframeCore.Popover.Content
            side="bottom"
            align="start"
            sideOffset={4}
            asChild={true}
          >
            <div className="flex flex-col items-start gap-1 rounded-md border border-solid border-neutral-border bg-default-background px-3 py-3 shadow-lg">
              <Calendar mode="single" selected={retroDay} onSelect={onRetroDayChange} />
            </div>
          </SubframeCore.Popover.Content>
        </SubframeCore.Popover.Portal>
      </SubframeCore.Popover.Root>
      {errors.retroDay && (
        <span className="text-body font-body text-warning-font">
          {errors.retroDay}
        </span>
      )}

      {/* Skill Focus */}
      <TextField
        className="h-auto w-full flex-none"
        label="Skill focus (optional)"
        helpText={`${skillFocus.length}/50 characters`}
        error={!!errors.skillFocus}
      >
        <TextField.Input
          placeholder="e.g., Accessibility, Visual Design"
          value={skillFocus}
          onChange={handleSkillFocusChange}
          maxLength={50}
        />
      </TextField>
      {errors.skillFocus && (
        <span className="text-body font-body text-error-font">
          {errors.skillFocus}
        </span>
      )}
    </div>
  );
}

export default SprintConfiguration;
