"use client";

import React from "react";
import { Alert } from "@/ui/components/Alert";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { Table } from "@/ui/components/Table";
import {
  FeatherArrowLeft,
  FeatherChevronDown,
} from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { CurrentSprintStatus } from "@/app/challenge-hub/components";
import { StartNextSprint } from "@/app/sprint-control/components";

function SprintControlHub() {

  return (
    <div className="container max-w-none flex h-full w-full flex-col items-start gap-8 bg-default-background py-12">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
            <span className="text-heading-1 font-heading-1 text-default-font">
              Sprint Control
            </span>
            <span className="text-body font-body text-subtext-color">
              Start, end, and configure team-wide design challenges.
            </span>
          </div>
          {/* Link to Challenge Hub */}
          <Button
            variant="neutral-secondary"
            icon={<FeatherArrowLeft />}
            onClick={() => {
              window.location.href = "/challenge-hub";
            }}
          >
            Back to Hub
          </Button>
        </div>
      </div>
      <Alert
        title="Anyone on the team can manage sprints"
        description="Actions are logged so everyone stays in sync. Team norm: New sprints start Mondays and run for 2 weeks. Coordinate in Slack before changing."
      />

      {/* Current Sprint Status - replaced with component */}
      <CurrentSprintStatus />

      {/* Start Next Sprint - replaced with component */}
      <StartNextSprint
        onSprintCreated={(sprintId) => {
          console.log(`Sprint created: ${sprintId}`);
          // Success toast would appear here (handled by component)
          // Redirect to Challenge Hub (handled by component)
        }}
      />
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
                Filter
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
                  <DropdownMenu.DropdownItem icon={null}>
                    All Sprints
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon={null}>
                    Completed
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon={null}>
                    In Progress
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
            <Table.Row>
              <Table.Cell>
                <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                  Sprint 12
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Challenge #5 - App Icon
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="neutral">Completed</Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Jun 17 - Jun 30
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Started by Emily - Ended by Mike
                </span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                  Sprint 11
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Challenge #4 - Calculator
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="neutral">Completed</Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Jun 3 - Jun 16
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Started by Alex - Ended by Sarah
                </span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                  Sprint 10
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Challenge #3 - Landing Page
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="neutral">Completed</Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  May 20 - Jun 2
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Started by Mike - Ended by Emily
                </span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                  Sprint 9
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Challenge #2 - Credit Card Checkout
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="warning">Cancelled</Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  May 6 - May 12
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  Started by Sarah - Ended by Alex
                </span>
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default SprintControlHub;
