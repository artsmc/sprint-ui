"use client";

import React, { useState } from "react";
import { Avatar } from "@/ui/components/Avatar";
import { Badge } from "@/ui/components/Badge";
import { Breadcrumbs } from "@/ui/components/Breadcrumbs";
import { Button } from "@/ui/components/Button";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { TextField } from "@/ui/components/TextField";
import {
  FeatherAward,
  FeatherCheck,
  FeatherChevronDown,
  FeatherDownload,
  FeatherExternalLink,
  FeatherEye,
  FeatherFilter,
  FeatherMessageSquare,
  FeatherStar,
  FeatherThumbsUp,
  FeatherTrendingUp,
  FeatherUpload,
  FeatherZap,
} from "@subframe/core";

function DesignJourneyTracker() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container max-w-none flex h-full w-full flex-col items-start gap-6 bg-default-background py-12 overflow-auto">
      <div className="flex w-full flex-col items-start gap-4">
        <Breadcrumbs>
          <Breadcrumbs.Item
            onClick={() => {
              window.location.href = "/challenge-hub";
            }}
          >
            Challenge Hub
          </Breadcrumbs.Item>
          <Breadcrumbs.Divider />
          <Breadcrumbs.Item active={true}>My Submissions</Breadcrumbs.Item>
        </Breadcrumbs>
        <div className="flex w-full items-start justify-between flex-wrap">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
            <span className="text-heading-1 font-heading-1 text-default-font">
              My Submissions
            </span>
            <span className="text-body font-body text-subtext-color">
              Your history of challenge entries, scores, and feedback.
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <TextField className="h-auto w-64 flex-none" label="" helpText="">
              <TextField.Input
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(event.target.value);
                }}
              />
            </TextField>
            <Button
              variant="neutral-secondary"
              iconRight={<FeatherChevronDown />}
              onClick={() => {}}
            >
              All Sprints
            </Button>
            <Button
              variant="neutral-secondary"
              iconRight={<FeatherChevronDown />}
              onClick={() => {}}
            >
              All Status
            </Button>
            <Button
              variant="neutral-secondary"
              icon={<FeatherFilter />}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-brand-200 bg-brand-50 px-6 py-6">
        <div className="flex w-full items-center gap-4">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-heading-2 font-heading-2 text-default-font">
                #19 - Leaderboard
              </span>
              <Badge>Sprint 24</Badge>
            </div>
            <span className="text-body font-body text-subtext-color">
              Design a UI for the Leaderboard experience that makes the task
              clear, easy to complete, and visually consistent with the rest of
              the product.
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="success" icon={<FeatherCheck />}>
                Submitted
              </Badge>
              <span className="text-caption font-caption text-subtext-color">
                Voting opens in 2 days
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral-secondary"
              icon={<FeatherEye />}
              onClick={() => {}}
            >
              View Submission
            </Button>
            <Button
              icon={<FeatherUpload />}
              onClick={() => {
                window.location.href = "/upload";
              }}
            >
              Update Design
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full grow shrink-0 basis-0 items-start gap-6">
        <div className="flex w-96 flex-none flex-col items-start gap-4 self-stretch overflow-auto">
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
              Submission History
            </span>
            <span className="text-caption-bold font-caption-bold text-subtext-color">
              9 entries
            </span>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-start gap-3">
                <div className="flex h-16 w-16 flex-none items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
                  <img
                    className="grow shrink-0 basis-0 self-stretch object-cover"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop"
                    alt="Analytics Chart preview"
                  />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center gap-2">
                    <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                      #18 - Analytics Chart
                    </span>
                    <Badge variant="neutral">Completed</Badge>
                  </div>
                  <span className="text-caption font-caption text-subtext-color">
                    Sprint 23 - May 2025
                  </span>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-caption-bold font-caption-bold text-default-font">
                        4.5
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherMessageSquare className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        12
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherThumbsUp className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        8
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="warning">Top Visual Design</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-start gap-3">
                <div className="flex h-16 w-16 flex-none items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
                  <img
                    className="grow shrink-0 basis-0 self-stretch object-cover"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop"
                    alt="On/Off Switch preview"
                  />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center gap-2">
                    <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                      #15 - On/Off Switch
                    </span>
                    <Badge variant="neutral">Completed</Badge>
                  </div>
                  <span className="text-caption font-caption text-subtext-color">
                    Sprint 22 - May 2025
                  </span>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-caption-bold font-caption-bold text-default-font">
                        4.2
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherMessageSquare className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        9
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherThumbsUp className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        6
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="success">Most Improved</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-start gap-3">
                <div className="flex h-16 w-16 flex-none items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
                  <img
                    className="grow shrink-0 basis-0 self-stretch object-cover"
                    src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&h=200&fit=crop"
                    alt="Direct Messaging preview"
                  />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center gap-2">
                    <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                      #13 - Direct Messaging
                    </span>
                    <Badge variant="neutral">Completed</Badge>
                  </div>
                  <span className="text-caption font-caption text-subtext-color">
                    Sprint 21 - Apr 2025
                  </span>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-caption-bold font-caption-bold text-default-font">
                        4.7
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherMessageSquare className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        15
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherThumbsUp className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        11
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="success">Top Usability</Badge>
                    <Badge variant="neutral">Feedback MVP</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-start gap-3">
                <div className="flex h-16 w-16 flex-none items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
                  <img
                    className="grow shrink-0 basis-0 self-stretch object-cover"
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=200&fit=crop"
                    alt="Music Player preview"
                  />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center gap-2">
                    <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                      #9 - Music Player
                    </span>
                    <Badge variant="neutral">Completed</Badge>
                  </div>
                  <span className="text-caption font-caption text-subtext-color">
                    Sprint 20 - Apr 2025
                  </span>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-caption-bold font-caption-bold text-default-font">
                        3.9
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherMessageSquare className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        7
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherThumbsUp className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-start gap-3">
                <div className="flex h-16 w-16 flex-none items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
                  <img
                    className="grow shrink-0 basis-0 self-stretch object-cover"
                    src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=200&h=200&fit=crop"
                    alt="Settings preview"
                  />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center gap-2">
                    <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                      #7 - Settings
                    </span>
                    <Badge variant="neutral">Completed</Badge>
                  </div>
                  <span className="text-caption font-caption text-subtext-color">
                    Sprint 19 - Mar 2025
                  </span>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-caption-bold font-caption-bold text-default-font">
                        4.1
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherMessageSquare className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        10
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherThumbsUp className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        7
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-start gap-3">
                <div className="flex h-16 w-16 flex-none items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
                  <img
                    className="grow shrink-0 basis-0 self-stretch object-cover"
                    src="https://images.unsplash.com/photo-1560762484-813fc97650a0?w=200&h=200&fit=crop"
                    alt="User Profile preview"
                  />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center gap-2">
                    <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                      #6 - User Profile
                    </span>
                    <Badge variant="neutral">Completed</Badge>
                  </div>
                  <span className="text-caption font-caption text-subtext-color">
                    Sprint 18 - Mar 2025
                  </span>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-caption-bold font-caption-bold text-default-font">
                        4.3
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherMessageSquare className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        11
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherThumbsUp className="text-caption font-caption text-subtext-color" />
                      <span className="text-caption font-caption text-subtext-color">
                        8
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-px flex-none flex-col items-center gap-2 self-stretch bg-neutral-border" />
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch overflow-auto">
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
              Submission Details
            </span>
          </div>
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <div className="flex w-full items-center gap-4">
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-heading-2 font-heading-2 text-default-font">
                    #18 - Analytics Chart
                  </span>
                  <Badge variant="neutral">Sprint 23</Badge>
                </div>
                <span className="text-body font-body text-subtext-color">
                  Completed May 15, 2025
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="neutral-secondary"
                  icon={<FeatherExternalLink />}
                  onClick={() => {}}
                >
                  Open in Figma
                </Button>
                <Button
                  variant="neutral-secondary"
                  icon={<FeatherDownload />}
                  onClick={() => {}}
                >
                  Download
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-2 overflow-hidden rounded-md border border-solid border-neutral-border bg-neutral-50">
              <img
                className="w-full flex-none"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                alt="Analytics Chart full design"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Results &amp; Scores
            </span>
            <div className="flex w-full items-start gap-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-heading-1 font-heading-1 text-brand-600">
                  4.5
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  Overall Score
                </span>
              </div>
              <div className="flex w-px flex-none flex-col items-center gap-2 self-stretch bg-neutral-border" />
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
                <div className="flex w-full flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-body font-body text-default-font">
                      Clarity
                    </span>
                    <span className="text-body-bold font-body-bold text-default-font">
                      4.7
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-2 flex flex-col items-center gap-2 rounded-full bg-brand-600 w-[94%]" />
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-body font-body text-default-font">
                      Usability
                    </span>
                    <span className="text-body-bold font-body-bold text-default-font">
                      4.6
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-2 flex flex-col items-center gap-2 rounded-full bg-brand-600 w-[92%]" />
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-body font-body text-default-font">
                      Visual Craft
                    </span>
                    <span className="text-body-bold font-body-bold text-default-font">
                      4.8
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-2 flex flex-col items-center gap-2 rounded-full bg-brand-600 w-[96%]" />
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-body font-body text-default-font">
                      Originality
                    </span>
                    <span className="text-body-bold font-body-bold text-default-font">
                      4.0
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-2 flex flex-col items-center gap-2 rounded-full bg-brand-600 w-[80%]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
            <div className="flex w-full items-center gap-4">
              <div className="flex grow shrink-0 basis-0 items-center gap-2">
                <IconWithBackground
                  variant="success"
                  size="small"
                  icon={<FeatherZap />}
                />
                <div className="flex flex-col items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    +240 XP earned
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    From this challenge
                  </span>
                </div>
              </div>
              <Badge variant="warning" icon={<FeatherAward />}>
                Top Visual Design
              </Badge>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <div className="flex w-full items-center justify-between">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Peer Feedback
              </span>
              <div className="flex items-center gap-2">
                <span className="text-caption font-caption text-subtext-color">
                  12 comments
                </span>
                <Button
                  variant="neutral-tertiary"
                  size="small"
                  iconRight={<FeatherChevronDown />}
                  onClick={() => {}}
                >
                  Most helpful
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full flex-col items-start gap-3 rounded-md border border-solid border-neutral-border bg-neutral-50 px-4 py-4">
                <div className="flex w-full items-start gap-3">
                  <Avatar size="small" image="">
                    A
                  </Avatar>
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                    <span className="text-body-bold font-body-bold text-default-font">
                      One thing that works well...
                    </span>
                    <span className="text-body font-body text-default-font">
                      The data visualization is incredibly clear and makes
                      complex information easy to understand. The color choices
                      help differentiate between data sets without being
                      overwhelming.
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2">
                  <Button
                    variant="neutral-tertiary"
                    size="small"
                    icon={<FeatherThumbsUp />}
                    onClick={() => {}}
                  >
                    Helpful (8)
                  </Button>
                  <span className="text-caption font-caption text-subtext-color">
                    Anonymous
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-3 rounded-md border border-solid border-neutral-border bg-neutral-50 px-4 py-4">
                <div className="flex w-full items-start gap-3">
                  <Avatar size="small" image="">
                    B
                  </Avatar>
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                    <span className="text-body-bold font-body-bold text-default-font">
                      One thing to improve...
                    </span>
                    <span className="text-body font-body text-default-font">
                      Consider adding more interactive elements like tooltips or
                      hover states to provide additional context without
                      cluttering the main view.
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2">
                  <Button
                    variant="neutral-tertiary"
                    size="small"
                    icon={<FeatherThumbsUp />}
                    onClick={() => {}}
                  >
                    Helpful (5)
                  </Button>
                  <span className="text-caption font-caption text-subtext-color">
                    Anonymous
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-3 rounded-md border border-solid border-neutral-border bg-neutral-50 px-4 py-4">
                <div className="flex w-full items-start gap-3">
                  <Avatar size="small" image="">
                    C
                  </Avatar>
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                    <span className="text-body-bold font-body-bold text-default-font">
                      General feedback
                    </span>
                    <span className="text-body font-body text-default-font">
                      The hierarchy is well-established and the typography
                      choices support readability. Nice use of whitespace
                      throughout the design.
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2">
                  <Button
                    variant="neutral-tertiary"
                    size="small"
                    icon={<FeatherThumbsUp />}
                    onClick={() => {}}
                  >
                    Helpful (4)
                  </Button>
                  <span className="text-caption font-caption text-subtext-color">
                    Anonymous
                  </span>
                </div>
              </div>
              <Button
                variant="neutral-secondary"
                size="small"
                onClick={() => {}}
              >
                Load more feedback
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Personal Reflection
            </span>
            <div className="flex w-full flex-col items-start gap-2">
              <span className="text-body-bold font-body-bold text-default-font">
                What I tried in this design
              </span>
              <span className="text-body font-body text-default-font">
                I focused on creating a clean, minimalist interface that puts
                the data front and center. Used a consistent color palette to
                maintain visual harmony and implemented progressive disclosure
                to avoid overwhelming users with too much information at once.
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <span className="text-body-bold font-body-bold text-default-font">
                What I would do differently next time
              </span>
              <span className="text-body font-body text-default-font">
                Add more interactive states and micro-interactions to make the
                experience more engaging. Also consider responsive behavior
                earlier in the design process.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FeatherCheck className="text-caption font-caption text-success-600" />
              <span className="text-caption font-caption text-subtext-color">
                Reflection saved - +20 XP bonus earned
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Personal Stats &amp; Growth
            </span>
            <div className="flex w-full items-start gap-6">
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-3">
                <div className="flex w-full items-center justify-between">
                  <span className="text-body font-body text-subtext-color">
                    Total Submissions
                  </span>
                  <span className="text-heading-2 font-heading-2 text-default-font">
                    9
                  </span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-body font-body text-subtext-color">
                    Average Rating
                  </span>
                  <span className="text-heading-2 font-heading-2 text-default-font">
                    4.3
                  </span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-body font-body text-subtext-color">
                    Feedback Given
                  </span>
                  <span className="text-heading-2 font-heading-2 text-default-font">
                    47
                  </span>
                </div>
              </div>
              <div className="flex w-px flex-none flex-col items-center gap-2 self-stretch bg-neutral-border" />
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                <span className="text-body-bold font-body-bold text-default-font">
                  Score Trend
                </span>
                <div className="flex h-24 w-full flex-none flex-col items-end justify-end gap-1">
                  <div className="flex w-full items-end gap-1">
                    <div className="flex-1 h-12 flex flex-col items-center gap-2 rounded-sm bg-neutral-200" />
                    <div className="flex-1 h-14 flex flex-col items-center gap-2 rounded-sm bg-neutral-200" />
                    <div className="flex-1 h-16 flex flex-col items-center gap-2 rounded-sm bg-neutral-200" />
                    <div className="flex-1 h-20 flex flex-col items-center gap-2 rounded-sm bg-brand-200" />
                    <div className="flex-1 h-24 flex flex-col items-center gap-2 rounded-sm bg-brand-600" />
                  </div>
                </div>
                <span className="text-caption font-caption text-subtext-color">
                  Last 5 sprints
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-2 rounded-md bg-success-50 px-4 py-4">
              <div className="flex items-center gap-2">
                <IconWithBackground
                  variant="success"
                  size="small"
                  icon={<FeatherTrendingUp />}
                />
                <span className="text-body-bold font-body-bold text-success-700">
                  Most Improved Skill
                </span>
              </div>
              <span className="text-body font-body text-default-font">
                Your Usability scores have improved +0.8 across the last 3
                sprints. Keep pushing forward!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignJourneyTracker;
