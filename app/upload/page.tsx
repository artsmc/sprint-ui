"use client";

import React, { useState } from "react";
import { Button } from "@/ui/components/Button";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { LinkButton } from "@/ui/components/LinkButton";
import { TextField } from "@/ui/components/TextField";
import { CodePenEmbed } from "@/ui/components/CodePenEmbed";
import {
  FeatherArrowLeft,
  FeatherCheck,
  FeatherClock,
  FeatherEdit2,
  FeatherEye,
  FeatherImage,
  FeatherInfo,
  FeatherLink,
  FeatherMessageSquare,
  FeatherMousePointer,
  FeatherSave,
  FeatherSend,
  FeatherSparkles,
  FeatherThumbsUp,
  FeatherUpload,
  FeatherUser,
  FeatherZap,
} from "@subframe/core";

interface SkillOption {
  id: string;
  label: string;
  selected: boolean;
}

function DesignUploadFlow() {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [codepenUrl, setCodepenUrl] = useState("");
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [mainProblem, setMainProblem] = useState("");
  const [keyConstraints, setKeyConstraints] = useState("");
  const [skills, setSkills] = useState<SkillOption[]>([
    { id: "visual", label: "Visual Design", selected: false },
    { id: "interaction", label: "Interaction Design", selected: true },
    { id: "research", label: "UX Research", selected: false },
    { id: "accessibility", label: "Accessibility", selected: false },
    { id: "systems", label: "Design Systems", selected: true },
    { id: "motion", label: "Motion Design", selected: false },
  ]);

  const toggleSkill = (id: string) => {
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, selected: !skill.selected } : skill
    ));
  };

  return (
    <div className="container max-w-none flex h-full w-full flex-col items-start gap-6 bg-neutral-50 py-12 overflow-auto">
      <div className="flex w-full items-center gap-3">
        <LinkButton
          icon={<FeatherArrowLeft />}
          onClick={() => {
            window.location.href = "/challenge-hub";
          }}
        >
          Back to Challenge Hub
        </LinkButton>
      </div>
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-brand-200 bg-brand-50 px-8 py-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <IconWithBackground
              size="medium"
              icon={<FeatherUser />}
              square={true}
            />
            <div className="flex flex-col items-start gap-1">
              <span className="text-caption font-caption text-subtext-color">
                Challenge #6 - Sprint 12
              </span>
              <span className="text-heading-2 font-heading-2 text-default-font">
                User Profile
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FeatherClock className="text-body font-body text-subtext-color" />
            <span className="text-body-bold font-body-bold text-default-font">
              3 days, 14 hours left
            </span>
          </div>
        </div>
        <span className="text-body font-body text-default-font">
          Design a UI for the User Profile experience that makes the task clear,
          easy to complete, and visually consistent with the rest of the
          product.
        </span>
      </div>
      <div className="flex w-full items-start gap-6">
        <div className="flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
            <div className="flex w-full items-center gap-3">
              <IconWithBackground size="medium" icon={<FeatherUpload />} />
              <span className="text-heading-2 font-heading-2 text-default-font">
                Step 1 - Attach Your Design
              </span>
            </div>
            <div className="flex w-full flex-col items-center gap-6 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 px-8 py-12">
              <FeatherImage className="text-body font-body text-neutral-400" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-body-bold font-body-bold text-default-font text-center">
                  Drop your design here or browse files
                </span>
                <span className="text-caption font-caption text-subtext-color text-center">
                  PNG, JPG, PDF, or ZIP - Max 10MB - Recommended: 1920x1080px
                </span>
              </div>
              <Button
                icon={<FeatherUpload />}
                onClick={() => {
                  // TODO: Open file browser
                }}
              >
                Browse Files
              </Button>
            </div>
            <div className="flex w-full flex-col items-start gap-3">
              <TextField
                className="h-auto w-full flex-none"
                label="Figma or Prototype URL (Optional)"
                helpText="Link to your full prototype or interactive design"
                icon={<FeatherLink />}
              >
                <TextField.Input
                  placeholder="https://figma.com/..."
                  value={figmaUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFigmaUrl(event.target.value);
                  }}
                />
              </TextField>
              <TextField
                className="h-auto w-full flex-none"
                label="CodePen URL (Optional)"
                helpText="Link to your interactive CodePen prototype"
                icon={<FeatherLink />}
              >
                <TextField.Input
                  placeholder="https://codepen.io/..."
                  value={codepenUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCodepenUrl(event.target.value);
                  }}
                />
              </TextField>
              {codepenUrl && (
                <div className="w-full">
                  <CodePenEmbed url={codepenUrl} height={300} />
                </div>
              )}
              <div className="flex w-full items-start gap-2 rounded-md bg-neutral-100 px-4 py-3">
                <FeatherInfo className="text-body font-body text-subtext-color" />
                <span className="text-caption font-caption text-subtext-color">
                  Export your primary screen(s). You can add multiple views or
                  link to a full prototype above.
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
            <div className="flex w-full items-center gap-3">
              <IconWithBackground size="medium" icon={<FeatherEdit2 />} />
              <span className="text-heading-2 font-heading-2 text-default-font">
                Step 2 - Design Details
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <TextField
                className="h-auto w-full flex-none"
                label="Submission Title"
                helpText=""
              >
                <TextField.Input
                  placeholder="User Profile - Mobile First Concept"
                  value={submissionTitle}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSubmissionTitle(event.target.value);
                  }}
                />
              </TextField>
              <TextField
                className="h-auto w-full flex-none"
                label="Short Description"
                helpText="1-2 sentences about your core idea"
              >
                <TextField.Input
                  placeholder="What's the core idea of your solution?"
                  value={shortDescription}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setShortDescription(event.target.value);
                  }}
                />
              </TextField>
            </div>
            <div className="flex w-full flex-col items-start gap-3">
              <span className="text-body-bold font-body-bold text-default-font">
                Skill Focus (Select all that apply)
              </span>
              <div className="flex w-full items-start gap-2 flex-wrap">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`flex items-center gap-2 rounded-md border border-solid px-3 py-2 cursor-pointer ${
                      skill.selected
                        ? "border-brand-600 bg-brand-50"
                        : "border-neutral-border bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 flex-none items-center justify-center gap-2 rounded-sm ${
                        skill.selected
                          ? "bg-brand-600"
                          : "border border-solid border-neutral-400"
                      }`}
                    >
                      {skill.selected && (
                        <FeatherCheck className="text-body font-body text-white" />
                      )}
                    </div>
                    <span
                      className={`text-body font-body ${
                        skill.selected ? "text-brand-700" : "text-default-font"
                      }`}
                    >
                      {skill.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <TextField
                className="h-auto w-full flex-none"
                label="Main Problem Focused On (Optional)"
                helpText=""
              >
                <TextField.Input
                  placeholder="e.g., Making profile editing intuitive for first-time users"
                  value={mainProblem}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setMainProblem(event.target.value);
                  }}
                />
              </TextField>
              <TextField
                className="h-auto w-full flex-none"
                label="Key Constraints (Optional)"
                helpText=""
              >
                <TextField.Input
                  placeholder="e.g., Mobile-only, accessibility-first approach"
                  value={keyConstraints}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setKeyConstraints(event.target.value);
                  }}
                />
              </TextField>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-6">
            <div className="flex w-full items-center gap-2">
              <FeatherInfo className="text-body font-body text-subtext-color" />
              <span className="text-body-bold font-body-bold text-default-font">
                Submission Guidelines
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <div className="flex items-start gap-2">
                <FeatherCheck className="text-caption font-caption text-success-600" />
                <span className="text-caption font-caption text-default-font">
                  Keep file names anonymous (no real names in files)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FeatherCheck className="text-caption font-caption text-success-600" />
                <span className="text-caption font-caption text-default-font">
                  Avoid including sensitive internal data
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FeatherCheck className="text-caption font-caption text-success-600" />
                <span className="text-caption font-caption text-default-font">
                  Show your key flow or screen, not every variant
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-[384px] flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
            <div className="flex w-full items-center gap-3">
              <IconWithBackground
                variant="success"
                size="medium"
                icon={<FeatherSend />}
              />
              <span className="text-heading-2 font-heading-2 text-default-font">
                Step 3 - Submit &amp; Earn XP
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full flex-col items-start gap-3">
                <span className="text-body-bold font-body-bold text-default-font">
                  XP Breakdown
                </span>
                <div className="flex w-full items-center justify-between rounded-md bg-success-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FeatherZap className="text-body font-body text-success-600" />
                    <span className="text-body font-body text-success-900">
                      On-time submission
                    </span>
                  </div>
                  <span className="text-body-bold font-body-bold text-success-700">
                    +20 XP
                  </span>
                </div>
                <div className="flex w-full items-center justify-between rounded-md bg-neutral-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FeatherThumbsUp className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-default-font">
                      Voting on peers later
                    </span>
                  </div>
                  <span className="text-body font-body text-subtext-color">
                    +10 XP
                  </span>
                </div>
                <div className="flex w-full items-center justify-between rounded-md bg-neutral-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FeatherMessageSquare className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-default-font">
                      Helpful comments
                    </span>
                  </div>
                  <span className="text-body font-body text-subtext-color">
                    +15 XP
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-3">
                <span className="text-body-bold font-body-bold text-default-font">
                  Remaining Sprint Tasks
                </span>
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full bg-success-500">
                    <FeatherCheck className="text-body font-body text-white" />
                  </div>
                  <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                    Read challenge brief
                  </span>
                </div>
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-brand-500 bg-white">
                    <span className="text-caption font-caption text-brand-600">
                      2
                    </span>
                  </div>
                  <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                    Upload your design
                  </span>
                </div>
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-white" />
                  <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                    Vote on 5 peer designs
                  </span>
                </div>
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-white" />
                  <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                    Leave 3 helpful comments
                  </span>
                </div>
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-300 bg-white" />
                  <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                    Complete reflection
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-3">
              <Button
                className="h-10 w-full flex-none"
                size="large"
                icon={<FeatherSend />}
                onClick={() => {
                  // TODO: Submit design logic
                }}
              >
                Submit Design
              </Button>
              <Button
                className="h-10 w-full flex-none"
                variant="neutral-secondary"
                size="large"
                icon={<FeatherSave />}
                onClick={() => {
                  // TODO: Save as draft logic
                }}
              >
                Save as Draft
              </Button>
            </div>
            <div className="flex w-full items-start gap-2 rounded-md bg-brand-50 px-4 py-3">
              <FeatherInfo className="text-body font-body text-brand-600" />
              <span className="text-caption font-caption text-brand-800">
                You can edit your submission until voting opens in 3 days
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-6 shadow-sm">
            <span className="text-body-bold font-body-bold text-default-font">
              Evaluation Criteria
            </span>
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-none items-center justify-center gap-2 rounded-md bg-brand-100">
                  <FeatherEye className="text-body font-body text-brand-600" />
                </div>
                <span className="text-body font-body text-default-font">
                  Clarity
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-none items-center justify-center gap-2 rounded-md bg-brand-100">
                  <FeatherMousePointer className="text-body font-body text-brand-600" />
                </div>
                <span className="text-body font-body text-default-font">
                  Usability
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-none items-center justify-center gap-2 rounded-md bg-brand-100">
                  <FeatherSparkles className="text-body font-body text-brand-600" />
                </div>
                <span className="text-body font-body text-default-font">
                  Visual Craft
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-none items-center justify-center gap-2 rounded-md bg-brand-100">
                  <FeatherZap className="text-body font-body text-brand-600" />
                </div>
                <span className="text-body font-body text-default-font">
                  Originality
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignUploadFlow;
