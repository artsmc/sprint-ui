"use client";

import React, { useState } from "react";
import { Avatar } from "@/ui/components/Avatar";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { LinkButton } from "@/ui/components/LinkButton";
import { Progress } from "@/ui/components/Progress";
import { TextField } from "@/ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherArrowRight,
  FeatherCheckCircle2,
  FeatherCircle,
  FeatherClock,
  FeatherExternalLink,
  FeatherMaximize2,
  FeatherZap,
} from "@subframe/core";

function FeedbackSprintRetro() {
  const [worksWell, setWorksWell] = useState("");
  const [toImprove, setToImprove] = useState("");
  const [question, setQuestion] = useState("");

  return (
    <div className="flex h-full w-full items-start bg-default-background">
      <div className="flex w-80 flex-none flex-col items-start gap-4 self-stretch border-r border-solid border-neutral-border bg-neutral-50 px-4 py-6 overflow-auto">
        <div className="flex w-full flex-col items-start gap-2">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Designs to Review
          </span>
          <div className="flex w-full items-center gap-2">
            <Button
              className="h-6 grow shrink-0 basis-0"
              variant="brand-secondary"
              size="small"
              onClick={() => {}}
            >
              Recommended
            </Button>
            <Button
              className="h-6 grow shrink-0 basis-0"
              variant="neutral-tertiary"
              size="small"
              onClick={() => {}}
            >
              All
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full flex-col items-start gap-3 rounded-md border border-solid border-brand-primary bg-default-background px-3 py-3 shadow-sm">
            <img
              className="h-32 w-full flex-none rounded-md object-cover"
              src="https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=400"
              alt="User Profile Desktop design preview"
            />
            <div className="flex w-full flex-col items-start gap-2">
              <span className="text-body-bold font-body-bold text-default-font">
                User Profile - Desktop
              </span>
              <div className="flex items-center gap-2">
                <Avatar size="x-small" image="">
                  S
                </Avatar>
                <span className="text-caption font-caption text-subtext-color">
                  Sarah Chen
                </span>
              </div>
              <div className="flex w-full items-start gap-1 flex-wrap">
                <Badge variant="neutral">Visual</Badge>
                <Badge variant="neutral">Interaction</Badge>
              </div>
              <Badge>In progress</Badge>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-3 rounded-md border border-solid border-neutral-border bg-default-background px-3 py-3 shadow-sm">
            <img
              className="h-32 w-full flex-none rounded-md object-cover"
              src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400"
              alt="Mobile Onboarding Flow design preview"
            />
            <div className="flex w-full flex-col items-start gap-2">
              <span className="text-body-bold font-body-bold text-default-font">
                Mobile Onboarding Flow
              </span>
              <div className="flex items-center gap-2">
                <Avatar size="x-small" image="">
                  M
                </Avatar>
                <span className="text-caption font-caption text-subtext-color">
                  Mike Johnson
                </span>
              </div>
              <div className="flex w-full items-start gap-1 flex-wrap">
                <Badge variant="neutral">Visual</Badge>
                <Badge variant="neutral">Accessibility</Badge>
              </div>
              <Badge variant="neutral">Not started</Badge>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-3 rounded-md border border-solid border-neutral-border bg-default-background px-3 py-3 shadow-sm">
            <img
              className="h-32 w-full flex-none rounded-md object-cover"
              src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=400"
              alt="Dashboard Analytics design preview"
            />
            <div className="flex w-full flex-col items-start gap-2">
              <span className="text-body-bold font-body-bold text-default-font">
                Dashboard Analytics
              </span>
              <div className="flex items-center gap-2">
                <Avatar size="x-small" image="">
                  A
                </Avatar>
                <span className="text-caption font-caption text-subtext-color">
                  Alex Rivera
                </span>
              </div>
              <div className="flex w-full items-start gap-1 flex-wrap">
                <Badge variant="neutral">Visual</Badge>
                <Badge variant="neutral">Interaction</Badge>
              </div>
              <Badge variant="neutral">Not started</Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch overflow-auto">
        <div className="flex w-full flex-col items-start gap-6 px-8 py-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <IconButton
                icon={<FeatherArrowLeft />}
                onClick={() => {
                  window.location.href = "/challenge-hub";
                }}
              />
              <div className="flex flex-col items-start gap-1">
                <span className="text-heading-2 font-heading-2 text-default-font">
                  Sprint 12 Retro - Feedback
                </span>
                <span className="text-body font-body text-subtext-color">
                  Review your teammates designs and leave helpful, structured
                  feedback.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-solid border-neutral-border bg-neutral-50 px-3 py-1">
                <span className="text-body-bold font-body-bold text-default-font">
                  3 / 5
                </span>
                <span className="text-body font-body text-subtext-color">
                  feedbacks given
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FeatherClock className="text-body font-body text-warning-600" />
                <span className="text-body font-body text-subtext-color">
                  8 hours left
                </span>
              </div>
            </div>
          </div>
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar image="">S</Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Sarah Chen
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    User Profile - Desktop
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="neutral-tertiary"
                  icon={<FeatherExternalLink />}
                  onClick={() => {}}
                >
                  Open in Figma
                </Button>
                <IconButton
                  icon={<FeatherMaximize2 />}
                  onClick={() => {}}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-solid border-neutral-border bg-neutral-50 px-6 py-6">
              <img
                className="w-full flex-none rounded-md shadow-lg"
                src="https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=800"
                alt="User Profile Desktop full design"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-1 rounded-md bg-neutral-50 px-4 py-3">
              <span className="text-caption-bold font-caption-bold text-default-font">
                Designer notes:
              </span>
              <span className="text-caption font-caption text-subtext-color">
                Focused on creating a clean, professional profile layout that
                emphasizes key information hierarchy. Wanted to balance visual
                interest with readability.
              </span>
            </div>
          </div>
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
          <div className="flex w-full flex-col items-start gap-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Structured Feedback
            </span>
            <TextField
              className="h-auto w-full flex-none"
              label="One thing that works well"
              helpText="What's effective about this design?"
            >
              <TextField.Input
                placeholder="Share what you appreciate about this work..."
                value={worksWell}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setWorksWell(event.target.value);
                }}
              />
            </TextField>
            <TextField
              className="h-auto w-full flex-none"
              label="One thing to improve"
              helpText="What would you change or explore next?"
            >
              <TextField.Input
                placeholder="Share a constructive suggestion..."
                value={toImprove}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setToImprove(event.target.value);
                }}
              />
            </TextField>
            <TextField
              className="h-auto w-full flex-none"
              label="One question you have"
              helpText="What are you curious about or unsure of?"
            >
              <TextField.Input
                placeholder="Ask a thoughtful question..."
                value={question}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setQuestion(event.target.value);
                }}
              />
            </TextField>
            <div className="flex w-full items-center justify-between">
              <Button
                variant="neutral-tertiary"
                onClick={() => {
                  // TODO: Save draft logic
                }}
              >
                Save Draft
              </Button>
              <Button
                iconRight={<FeatherArrowRight />}
                onClick={() => {
                  // TODO: Submit feedback and navigate to next design
                }}
              >
                Submit Feedback &amp; Next Design
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-72 flex-none flex-col items-start gap-6 self-stretch border-l border-solid border-neutral-border bg-default-background px-4 py-6 overflow-auto">
        <div className="flex w-full flex-col items-start gap-4">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Retro Progress
          </span>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <span className="text-body-bold font-body-bold text-default-font">
                3 of 5 required
              </span>
              <span className="text-body-bold font-body-bold text-brand-600">
                60%
              </span>
            </div>
            <Progress value={60} />
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center gap-2">
              <IconWithBackground variant="success" size="small" />
              <span className="text-body font-body text-default-font">
                Submit feedback on 5 designs
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <IconWithBackground
                variant="neutral"
                size="small"
                icon={<FeatherCircle />}
              />
              <span className="text-body font-body text-subtext-color">
                Reflect on your submission
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-1 rounded-md border border-solid border-brand-200 bg-brand-50 px-3 py-3">
            <div className="flex items-center gap-1">
              <FeatherZap className="text-body font-body text-brand-600" />
              <span className="text-body-bold font-body-bold text-brand-700">
                +15 XP earned
              </span>
            </div>
            <span className="text-caption font-caption text-brand-700">
              From helpful feedback this sprint
            </span>
          </div>
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
        <div className="flex w-full flex-col items-start gap-3">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Feedback Quality Tips
          </span>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex items-start gap-2">
              <FeatherCheckCircle2 className="text-body font-body text-success-600" />
              <span className="text-caption font-caption text-default-font">
                Be specific, not generic
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FeatherCheckCircle2 className="text-body font-body text-success-600" />
              <span className="text-caption font-caption text-default-font">
                Critique the work, not the person
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FeatherCheckCircle2 className="text-body font-body text-success-600" />
              <span className="text-caption font-caption text-default-font">
                Balance praise with suggestions
              </span>
            </div>
          </div>
          <LinkButton
            variant="brand"
            size="small"
            iconRight={<FeatherArrowRight />}
            onClick={() => {}}
          >
            See examples of helpful comments
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

export default FeedbackSprintRetro;
