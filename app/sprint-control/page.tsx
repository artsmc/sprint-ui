"use client";

import React from "react";
import { Alert } from "@/ui/components/Alert";
import { Button } from "@/ui/components/Button";
import { FeatherArrowLeft } from "@subframe/core";
import { CurrentSprintStatus } from "@/app/challenge-hub/components";
import { StartNextSprint, SprintHistory } from "@/app/sprint-control/components";

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
      {/* Sprint History - replaced with component */}
      <SprintHistory />
    </div>
  );
}

export default SprintControlHub;
