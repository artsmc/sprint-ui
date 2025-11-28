"use client";

import React, { useState } from "react";
import { Button } from "@/ui/components/Button";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { LinkButton } from "@/ui/components/LinkButton";
import { TextField } from "@/ui/components/TextField";
import {
  FeatherArrowLeft,
  FeatherInfo,
  FeatherLock,
  FeatherMail,
  FeatherSend,
} from "@subframe/core";

function ResetPasswordFlow() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-50">
      <div className="flex max-w-[448px] grow shrink-0 basis-0 flex-col items-center justify-center gap-8 px-6">
        <div className="flex flex-col items-center gap-4">
          <IconWithBackground size="x-large" icon={<FeatherLock />} />
          <div className="flex flex-col items-center gap-2">
            <span className="text-heading-1 font-heading-1 text-default-font text-center">
              Forgot your password?
            </span>
            <span className="text-body font-body text-subtext-color text-center">
              No worries! Enter your email address and we&apos;ll send you a link
              to reset your password.
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-6">
          <TextField
            className="h-auto w-full flex-none"
            label="Email address"
            helpText=""
            icon={<FeatherMail />}
          >
            <TextField.Input
              placeholder="your.email@example.com"
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
              }}
            />
          </TextField>
          <Button
            className="h-10 w-full flex-none"
            size="large"
            icon={<FeatherSend />}
            onClick={() => {
              // TODO: Send reset link logic
            }}
          >
            Send reset link
          </Button>
          <div className="flex w-full items-center justify-center gap-2">
            <span className="text-body font-body text-subtext-color">
              Remember your password?
            </span>
            <LinkButton
              variant="brand"
              icon={<FeatherArrowLeft />}
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Back to login
            </LinkButton>
          </div>
        </div>
        <div className="flex w-full items-start gap-2 rounded-md bg-brand-50 px-4 py-3">
          <FeatherInfo className="text-body font-body text-brand-600" />
          <span className="text-caption font-caption text-brand-800">
            Check your spam folder if you don&apos;t see the email within a few
            minutes.
          </span>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordFlow;
