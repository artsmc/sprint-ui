'use client';

import { FeatherAlertCircle } from '@subframe/core';

interface ErrorStateProps {
  message: string;
  className?: string;
}

/**
 * Error state display for the UserProfileSidebar.
 */
export function UserProfileSidebarError({ message, className = '' }: ErrorStateProps) {
  return (
    <div className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}>
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-error-200 bg-error-50 px-8 py-8 shadow-md">
        <div className="flex items-center gap-3">
          <FeatherAlertCircle className="text-heading-3 font-heading-3 text-error-600" />
          <span className="text-heading-3 font-heading-3 text-error-900">
            Failed to Load Profile
          </span>
        </div>
        <span className="text-body font-body text-error-800">
          {message}
        </span>
      </div>
    </div>
  );
}
