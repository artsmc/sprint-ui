"use client";

import React, { useState } from "react";
import { Alert } from "@/ui/components/Alert";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { Calendar } from "@/ui/components/Calendar";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { Select } from "@/ui/components/Select";
import { Table } from "@/ui/components/Table";
import { TextField } from "@/ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherCalendar,
  FeatherCheckCircle,
  FeatherChevronDown,
  FeatherClock,
  FeatherPlay,
  FeatherStopCircle,
  FeatherUsers,
} from "@subframe/core";
import * as SubframeCore from "@subframe/core";

function SprintControlHub() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | undefined>(undefined);
  const [sprintName, setSprintName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<string | undefined>(undefined);
  const [skillFocus, setSkillFocus] = useState("");
  const [retroDate, setRetroDate] = useState<Date | undefined>(new Date());

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
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-md">
        <div className="flex w-full items-start justify-between">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-heading-2 font-heading-2 text-default-font">
                Challenge #6 - User Profile
              </span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center gap-2">
              <FeatherCalendar className="text-body font-body text-subtext-color" />
              <span className="text-body font-body text-default-font">
                Jul 1 - Jul 14
              </span>
              <span className="text-body font-body text-subtext-color">.</span>
              <span className="text-body-bold font-body-bold text-brand-600">
                3 days, 4 hours left
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full items-start gap-4 flex-wrap">
          <div className="flex min-w-[176px] grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-neutral-50 px-4 py-4">
            <div className="flex items-center gap-2">
              <FeatherCheckCircle className="text-heading-3 font-heading-3 text-success-600" />
              <span className="text-body font-body text-subtext-color">
                Submissions
              </span>
            </div>
            <span className="text-heading-2 font-heading-2 text-default-font">
              12
            </span>
          </div>
          <div className="flex min-w-[176px] grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-neutral-50 px-4 py-4">
            <div className="flex items-center gap-2">
              <FeatherClock className="text-heading-3 font-heading-3 text-warning-600" />
              <span className="text-body font-body text-subtext-color">
                Yet to submit
              </span>
            </div>
            <span className="text-heading-2 font-heading-2 text-default-font">
              9
            </span>
          </div>
          <div className="flex min-w-[176px] grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-neutral-50 px-4 py-4">
            <div className="flex items-center gap-2">
              <FeatherUsers className="text-heading-3 font-heading-3 text-brand-600" />
              <span className="text-body font-body text-subtext-color">
                Participation
              </span>
            </div>
            <span className="text-heading-2 font-heading-2 text-default-font">
              57%
            </span>
          </div>
        </div>
        <div className="flex w-full items-center gap-2">
          {/* Sprint Ended Toastr */}
          <Button
            icon={<FeatherStopCircle />}
            onClick={() => {
              // TODO: End sprint logic
            }}
          >
            End Sprint
          </Button>
          <Button
            variant="neutral-secondary"
            icon={<FeatherClock />}
            onClick={() => {
              // TODO: Extend sprint logic
            }}
          >
            Extend Sprint (+2 days)
          </Button>
        </div>
        <div className="flex w-full flex-col items-start gap-1">
          <span className="text-body font-body text-subtext-color">
            Ending the sprint will close submissions for everyone and move us
            into the voting phase.
          </span>
          <div className="flex items-center gap-1">
            <FeatherClock className="text-caption font-caption text-neutral-400" />
            <span className="text-caption font-caption text-subtext-color">
              Last updated by Emily Park - Today at 10:23 AM
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
        <div className="flex w-full items-center gap-2">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
            Start Next Sprint
          </span>
        </div>
        <div className="flex w-full items-start gap-6 mobile:flex-col mobile:flex-nowrap mobile:gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Choose Challenge
              </span>
              <Select
                className="h-auto w-full flex-none"
                label=""
                placeholder="Select a challenge"
                helpText=""
                value={selectedChallenge}
                onValueChange={(value: string) => setSelectedChallenge(value)}
              >
                <Select.Item value="Challenge 7">Challenge 7</Select.Item>
                <Select.Item value="Challenge 8">Challenge 8</Select.Item>
                <Select.Item value="Challenge 9">Challenge 9</Select.Item>
                <Select.Item value="Random">Random</Select.Item>
              </Select>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Configure Sprint
              </span>
              <TextField
                className="h-auto w-full flex-none"
                label="Sprint name"
                helpText=""
              >
                <TextField.Input
                  placeholder="Sprint 13 - User Profile"
                  value={sprintName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSprintName(event.target.value);
                  }}
                />
              </TextField>
              <div className="flex w-full items-start gap-4">
                <TextField label="Start time" helpText="">
                  <TextField.Input
                    placeholder="Now"
                    value={startTime}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setStartTime(event.target.value);
                    }}
                  />
                </TextField>
                <Select
                  label="Duration"
                  placeholder="Select duration"
                  helpText=""
                  value={duration}
                  onValueChange={(value: string) => setDuration(value)}
                >
                  <Select.Item value="1 week">1 week</Select.Item>
                  <Select.Item value="2 weeks">2 weeks</Select.Item>
                  <Select.Item value="custom">custom</Select.Item>
                </Select>
                <SubframeCore.Popover.Root>
                  <SubframeCore.Popover.Trigger asChild={true}>
                    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                      <span className="text-body-bold font-body-bold text-default-font">
                        Retro day
                      </span>
                      <Button
                        className="h-auto w-full flex-none"
                        variant="neutral-secondary"
                        icon={<FeatherCalendar />}
                        onClick={() => {}}
                      >
                        Select date
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
                        <Calendar
                          mode="single"
                          selected={retroDate}
                          onSelect={(date: Date | undefined) => {
                            setRetroDate(date);
                          }}
                        />
                      </div>
                    </SubframeCore.Popover.Content>
                  </SubframeCore.Popover.Portal>
                </SubframeCore.Popover.Root>
              </div>
              <TextField
                className="h-auto w-full flex-none"
                label="Skill focus (optional)"
                helpText=""
              >
                <TextField.Input
                  placeholder="e.g., Accessibility, Visual Design"
                  value={skillFocus}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSkillFocus(event.target.value);
                  }}
                />
              </TextField>
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              {/* Sprint Started Toastr, then redirect to Challenge Hub */}
              <Button
                icon={<FeatherPlay />}
                onClick={() => {
                  // TODO: Start sprint logic
                }}
              >
                Start Sprint
              </Button>
              <span className="text-body font-body text-subtext-color">
                Starting this sprint will notify the team, open submissions, and
                set this challenge as the active sprint.
              </span>
            </div>
          </div>
          <div className="flex w-80 flex-none flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-neutral-50 px-6 py-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Challenge Preview
            </span>
            <div className="flex w-full flex-col items-start gap-2">
              <span className="text-body-bold font-body-bold text-default-font">
                Challenge #7 - Settings
              </span>
              <span className="text-body font-body text-subtext-color">
                Design a UI for the Settings experience that makes the task
                clear, easy to complete, and visually consistent with the rest
                of the product.
              </span>
            </div>
            <div className="flex w-full items-start gap-2 flex-wrap">
              <Badge variant="neutral">Visual Design</Badge>
              <Badge variant="neutral">Interaction</Badge>
              <Badge variant="neutral">Information Architecture</Badge>
            </div>
          </div>
        </div>
      </div>
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
