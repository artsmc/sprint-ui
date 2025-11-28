"use client";

import React from "react";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { LinkButton } from "@/ui/components/LinkButton";
import {
  FeatherAlertCircle,
  FeatherBookOpen,
  FeatherCheck,
  FeatherCheckCircle,
  FeatherClipboard,
  FeatherClock,
  FeatherLightbulb,
  FeatherMessageSquare,
  FeatherSettings,
  FeatherTarget,
  FeatherThumbsUp,
  FeatherTrendingUp,
  FeatherTrophy,
  FeatherUpload,
  FeatherUser,
  FeatherUserPlus,
  FeatherUsers,
  FeatherZap,
} from "@subframe/core";
import { UserProfileSidebar } from "./components";

function ChallengeHub() {
  // TODO: Replace with actual authenticated user ID once auth is implemented
  const userId = "user-placeholder-id";

  return (
    <div className="container max-w-none flex h-full w-full flex-col items-start gap-6 bg-neutral-50 py-12 overflow-auto">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          <span className="text-heading-1 font-heading-1 text-default-font">
            Design Challenge Hub
          </span>
          <span className="text-body font-body text-subtext-color">
            Your mission control for biweekly design challenges
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Links to My Submissions */}
          <Button
            icon={<FeatherTrophy />}
            onClick={() => {
              window.location.href = "/my-submissions";
            }}
          >
            My Submissions
          </Button>
          {/* Links to Sprint Control Hub */}
          <Button
            variant="brand-secondary"
            icon={<FeatherSettings />}
            onClick={() => {
              window.location.href = "/sprint-control";
            }}
          >
            Sprint Control
          </Button>
          {/* Generates a Toastr "added to sprint" */}
          <Button
            variant="brand-secondary"
            icon={<FeatherUserPlus />}
            onClick={() => {
              // TODO: Add to sprint logic
            }}
          >
            Add myself to sprint
          </Button>
        </div>
      </div>
      <div className="flex w-full items-start gap-6">
        <div className="flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-brand-200 bg-brand-50 px-8 py-8 shadow-lg">
            <div className="flex w-full items-center justify-between">
              <Badge variant="success" icon={<FeatherZap />}>
                Active Challenge
              </Badge>
              <div className="flex items-center gap-2">
                <FeatherClock className="text-body font-body text-subtext-color" />
                <span className="text-body-bold font-body-bold text-default-font">
                  3 days, 14 hours left
                </span>
              </div>
            </div>
            <div className="flex w-full items-center gap-4">
              <IconWithBackground
                size="x-large"
                icon={<FeatherUser />}
                square={true}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                <span className="text-caption font-caption text-subtext-color">
                  Challenge #6 - Sprint 12
                </span>
                <span className="text-heading-2 font-heading-2 text-default-font">
                  User Profile
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <span className="text-body-bold font-body-bold text-default-font">
                Challenge Brief
              </span>
              <span className="text-body font-body text-default-font">
                Design a UI for the User Profile experience that makes the task
                clear, easy to complete, and visually consistent with the rest
                of the product.
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              {/* Links to Design Upload Flow */}
              <Button
                className="h-10 grow shrink-0 basis-0"
                size="large"
                icon={<FeatherUpload />}
                onClick={() => {
                  window.location.href = "/upload";
                }}
              >
                Upload Design
              </Button>
              <Button
                className="h-10 w-auto flex-none"
                variant="brand-secondary"
                size="large"
                icon={<FeatherBookOpen />}
                onClick={() => {
                  // TODO: View brief modal
                }}
              >
                View Brief
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
            <div className="flex w-full items-center gap-2">
              <IconWithBackground size="medium" icon={<FeatherTarget />} />
              <span className="text-heading-2 font-heading-2 text-default-font">
                Sprint Progress
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full items-center gap-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full bg-success-500">
                  <FeatherCheck className="text-[14px] text-white" />
                </div>
                <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                  Read challenge brief
                </span>
                <span className="text-caption-bold font-caption-bold text-success-600">
                  +10 XP
                </span>
              </div>
              <div className="flex w-full items-center gap-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-white">
                  <span className="text-caption font-caption text-subtext-color">
                    {" "}
                  </span>
                </div>
                <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                  Upload your design
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  +20 XP
                </span>
              </div>
              <div className="flex w-full items-center gap-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-white">
                  <span className="text-caption font-caption text-subtext-color">
                    {" "}
                  </span>
                </div>
                <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                  Vote on 5 peer designs
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  +10 XP
                </span>
              </div>
              <div className="flex w-full items-center gap-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-white">
                  <span className="text-caption font-caption text-subtext-color">
                    {" "}
                  </span>
                </div>
                <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                  Leave 3 helpful comments
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  +15 XP
                </span>
              </div>
              <div className="flex w-full items-center gap-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-white">
                  <span className="text-caption font-caption text-subtext-color">
                    {" "}
                  </span>
                </div>
                <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                  Complete reflection
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  +5 XP
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
            <div className="flex w-full items-center gap-2">
              <IconWithBackground
                variant="warning"
                size="medium"
                icon={<FeatherTrendingUp />}
              />
              <span className="text-heading-2 font-heading-2 text-default-font">
                Skill Growth
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full items-center gap-4">
                <div className="flex min-w-[112px] grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-caption font-caption text-default-font">
                      Visual Design
                    </span>
                    <span className="text-caption-bold font-caption-bold text-default-font">
                      Level 4
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 rounded-full bg-neutral-200">
                    <div className="flex h-2 flex-none flex-col items-center gap-2 rounded-full bg-brand-500 w-4/5" />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <div className="flex min-w-[112px] grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-caption font-caption text-default-font">
                      Interaction Design
                    </span>
                    <span className="text-caption-bold font-caption-bold text-default-font">
                      Level 3
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 rounded-full bg-neutral-200">
                    <div className="flex h-2 flex-none flex-col items-center gap-2 rounded-full bg-brand-500 w-3/5" />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <div className="flex min-w-[112px] grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-caption font-caption text-default-font">
                      UX Research
                    </span>
                    <span className="text-caption-bold font-caption-bold text-default-font">
                      Level 2
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 rounded-full bg-neutral-200">
                    <div className="flex h-2 flex-none flex-col items-center gap-2 rounded-full bg-warning-500 w-2/5" />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <div className="flex min-w-[112px] grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-caption font-caption text-default-font">
                      Accessibility
                    </span>
                    <span className="text-caption-bold font-caption-bold text-default-font">
                      Level 1
                    </span>
                  </div>
                  <div className="flex h-2 w-full flex-none flex-col items-start gap-2 rounded-full bg-neutral-200">
                    <div className="flex h-2 flex-none flex-col items-center gap-2 rounded-full bg-error-500 w-1/5" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-3 rounded-md bg-warning-50 px-4 py-3">
              <FeatherLightbulb className="text-body font-body text-warning-700" />
              <span className="text-body font-body text-warning-900">
                Focus on Accessibility next sprint to level up across all areas
              </span>
            </div>
          </div>
        </div>
        <UserProfileSidebar userId={userId} />
      </div>
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <IconWithBackground
              variant="neutral"
              size="medium"
              icon={<FeatherBookOpen />}
            />
            <span className="text-heading-2 font-heading-2 text-default-font">
              Last Sprint Retrospective
            </span>
          </div>
          <LinkButton
            variant="brand"
            onClick={() => {
              // TODO: View full results
            }}
          >
            View Full Results
          </LinkButton>
        </div>
        <div className="flex w-full items-center gap-6">
          <div className="flex items-center gap-2">
            <FeatherUsers className="text-body font-body text-subtext-color" />
            <span className="text-body font-body text-default-font">
              18 submissions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FeatherThumbsUp className="text-body font-body text-subtext-color" />
            <span className="text-body font-body text-default-font">
              96 votes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FeatherMessageSquare className="text-body font-body text-subtext-color" />
            <span className="text-body font-body text-default-font">
              57 comments
            </span>
          </div>
        </div>
        <div className="flex w-full items-start gap-4 rounded-md bg-neutral-50 px-6 py-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <FeatherCheckCircle className="text-body font-body text-success-600" />
              <span className="text-body-bold font-body-bold text-default-font">
                What was good
              </span>
            </div>
            <span className="text-body font-body text-subtext-color">
              Many designs excelled at visual hierarchy and effective use of
              color. The submissions showed strong attention to typography and
              spacing consistency.
            </span>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <FeatherAlertCircle className="text-body font-body text-warning-600" />
              <span className="text-body-bold font-body-bold text-default-font">
                What can be improved
              </span>
            </div>
            <span className="text-body font-body text-subtext-color">
              Several designs struggled with mobile responsiveness and
              accessibility considerations. Consider starting mobile-first in
              future challenges.
            </span>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <FeatherClipboard className="text-body font-body text-brand-600" />
              <span className="text-body-bold font-body-bold text-default-font">
                What was asked
              </span>
            </div>
            <span className="text-body font-body text-subtext-color">
              Design a UI for the User Profile experience that makes the task
              clear, easy to complete, and visually consistent with the rest of
              the product.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeHub;
