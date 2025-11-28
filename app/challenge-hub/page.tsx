"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { FeatherSettings, FeatherTrophy, FeatherUserPlus } from "@subframe/core";
import {
  UserProfileSidebar,
  ChallengeHubMain,
  LastSprintRetrospective,
} from "./components";
import { useAuthStore } from "@/lib/stores/auth";

function ChallengeHub() {
  // Get authenticated user from auth store
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

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
        {/* Left Column: Active Challenge, Sprint Progress, Skill Growth */}
        <ChallengeHubMain
          userId={userId}
          className="min-w-[448px] grow shrink-0 basis-0"
        />

        {/* Right Column: User Profile Sidebar */}
        <UserProfileSidebar userId={userId} />
      </div>

      {/* Last Sprint Retrospective Section */}
      <LastSprintRetrospective />
    </div>
  );
}

export default ChallengeHub;
