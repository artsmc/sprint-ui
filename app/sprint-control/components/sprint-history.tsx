/**
 * SprintHistory Component
 *
 * Displays a paginated, filterable table of sprint history with real data from PocketBase.
 * Shows sprint number, challenge, status, date range, and who started/ended each sprint.
 *
 * @module app/sprint-control/components/sprint-history
 */

'use client';

import React from 'react';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { DropdownMenu } from '@/ui/components/DropdownMenu';
import { Table } from '@/ui/components/Table';
import { FeatherChevronDown } from '@subframe/core';
import * as SubframeCore from '@subframe/core';
import { useSprintHistory } from '@/lib/hooks';
import type { SprintStatus } from '@/lib/types';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format a date string to a human-readable format.
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jun 17")
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a date range.
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Formatted date range (e.g., "Jun 17 - Jun 30")
 */
function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Get badge variant for a sprint status.
 * @param status - Sprint status
 * @returns Badge variant
 */
function getStatusBadgeVariant(
  status: SprintStatus
): 'success' | 'warning' | 'error' | 'brand' | 'neutral' {
  switch (status) {
    case 'completed':
      return 'neutral';
    case 'active':
      return 'success';
    case 'voting':
    case 'retro':
      return 'brand';
    case 'cancelled':
      return 'warning';
    case 'scheduled':
      return 'neutral';
    default:
      return 'neutral';
  }
}

/**
 * Get display label for a sprint status.
 * @param status - Sprint status
 * @returns Display label
 */
function getStatusLabel(status: SprintStatus): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'active':
      return 'Active';
    case 'voting':
      return 'Voting';
    case 'retro':
      return 'Retrospective';
    case 'cancelled':
      return 'Cancelled';
    case 'scheduled':
      return 'Scheduled';
    default:
      return status;
  }
}

// =============================================================================
// Component
// =============================================================================

export interface SprintHistoryProps {
  /** Number of items per page (default: 20) */
  perPage?: number;
}

/**
 * Sprint history table component with filtering and pagination.
 * Fetches real data from PocketBase and displays sprint history.
 *
 * @example
 * ```tsx
 * <SprintHistory perPage={10} />
 * ```
 */
export function SprintHistory({ perPage = 20 }: SprintHistoryProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    statusFilter,
    setStatusFilter,
  } = useSprintHistory({ perPage });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
        <div className="flex w-full items-center gap-2">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
            Sprint History
          </span>
        </div>
        <div className="flex w-full items-center justify-center py-12">
          <span className="text-body font-body text-subtext-color">
            Loading sprint history...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
        <div className="flex w-full items-center gap-2">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
            Sprint History
          </span>
        </div>
        <div className="flex w-full items-center justify-center py-12">
          <span className="text-body font-body text-error-600">
            {error?.message || 'Failed to load sprint history'}
          </span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
        <div className="flex w-full items-center gap-2">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
            Sprint History
          </span>
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <Button
                variant="neutral-secondary"
                iconRight={<FeatherChevronDown />}
                onClick={() => {}}
              >
                {statusFilter ? getStatusLabel(statusFilter) : 'Filter'}
              </Button>
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content
                side="bottom"
                align="end"
                sideOffset={4}
                asChild={true}
              >
                <DropdownMenu>
                  <DropdownMenu.DropdownItem
                    icon={null}
                    onClick={() => setStatusFilter(undefined)}
                  >
                    All Sprints
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem
                    icon={null}
                    onClick={() => setStatusFilter('completed')}
                  >
                    Completed
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem
                    icon={null}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem
                    icon={null}
                    onClick={() => setStatusFilter('cancelled')}
                  >
                    Cancelled
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
        </div>
        <div className="flex w-full items-center justify-center py-12">
          <span className="text-body font-body text-subtext-color">
            {statusFilter
              ? `No ${getStatusLabel(statusFilter).toLowerCase()} sprints found`
              : 'No sprints found'}
          </span>
        </div>
      </div>
    );
  }

  // Success state with data
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-center gap-2">
        <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
          Sprint History
        </span>
        <SubframeCore.DropdownMenu.Root>
          <SubframeCore.DropdownMenu.Trigger asChild={true}>
            <Button
              variant="neutral-secondary"
              iconRight={<FeatherChevronDown />}
              onClick={() => {}}
            >
              {statusFilter ? getStatusLabel(statusFilter) : 'Filter'}
            </Button>
          </SubframeCore.DropdownMenu.Trigger>
          <SubframeCore.DropdownMenu.Portal>
            <SubframeCore.DropdownMenu.Content
              side="bottom"
              align="end"
              sideOffset={4}
              asChild={true}
            >
              <DropdownMenu>
                <DropdownMenu.DropdownItem
                  icon={null}
                  onClick={() => setStatusFilter(undefined)}
                >
                  All Sprints
                </DropdownMenu.DropdownItem>
                <DropdownMenu.DropdownItem
                  icon={null}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </DropdownMenu.DropdownItem>
                <DropdownMenu.DropdownItem
                  icon={null}
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </DropdownMenu.DropdownItem>
                <DropdownMenu.DropdownItem
                  icon={null}
                  onClick={() => setStatusFilter('cancelled')}
                >
                  Cancelled
                </DropdownMenu.DropdownItem>
              </DropdownMenu>
            </SubframeCore.DropdownMenu.Content>
          </SubframeCore.DropdownMenu.Portal>
        </SubframeCore.DropdownMenu.Root>
      </div>
      <div className="flex w-full flex-col items-start gap-4 overflow-auto">
        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell>Sprint</Table.HeaderCell>
              <Table.HeaderCell>Challenge</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Date Range</Table.HeaderCell>
              <Table.HeaderCell>Managed By</Table.HeaderCell>
            </Table.HeaderRow>
          }
        >
          {data.items.map((sprint) => {
            const challenge = sprint.expand?.challenge_id;
            const startedBy = sprint.expand?.started_by_id;
            const endedBy = sprint.expand?.ended_by_id;

            return (
              <Table.Row key={sprint.id}>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                    Sprint {sprint.sprint_number}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {challenge
                      ? `Challenge #${challenge.challenge_number} - ${challenge.title}`
                      : 'N/A'}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusBadgeVariant(sprint.status)}>
                    {getStatusLabel(sprint.status)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {formatDateRange(sprint.start_at, sprint.end_at)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {startedBy && endedBy
                      ? `Started by ${startedBy.name} - Ended by ${endedBy.name}`
                      : startedBy
                      ? `Started by ${startedBy.name}`
                      : 'N/A'}
                  </span>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table>
      </div>
    </div>
  );
}

export default SprintHistory;
