"use client";
/*
 * Documentation:
 * Fullscreen Dialog — https://app.subframe.com/d54d6bb0b72d/library?component=Fullscreen+Dialog_3f094173-71de-4378-a09a-05c482f7a137
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface FullscreenDialogRootProps
  extends React.ComponentProps<typeof SubframeCore.FullScreenDialog.Root> {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const FullscreenDialogRoot = React.forwardRef<
  HTMLDivElement,
  FullscreenDialogRootProps
>(function FullscreenDialogRoot(
  { children, className, ...otherProps }: FullscreenDialogRootProps,
  ref
) {
  return children ? (
    <SubframeCore.FullScreenDialog.Root asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          "flex h-full w-full flex-col items-start bg-default-background",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.FullScreenDialog.Root>
  ) : null;
});

export const FullscreenDialog = FullscreenDialogRoot;
