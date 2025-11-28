'use client';

import { FeatherLogIn } from '@subframe/core';
import { Button } from '@/ui/components/Button';

interface NotLoggedInStateProps {
  className?: string;
}

/**
 * Display when user is not logged in.
 * Prompts user to sign in to see their profile.
 */
export function NotLoggedInState({ className = '' }: NotLoggedInStateProps) {
  return (
    <div
      className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}
    >
      <div className="flex w-full flex-col items-center gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-12 shadow-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <FeatherLogIn className="text-heading-1 font-heading-1 text-neutral-500" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Sign In to View Profile
          </span>
          <span className="text-body font-body text-subtext-color text-center max-w-[300px]">
            Log in to track your progress, earn XP, and see your design
            achievements.
          </span>
        </div>
        <Button
          icon={<FeatherLogIn />}
          onClick={() => {
            window.location.href = '/login';
          }}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
