'use client';

/**
 * Loading state skeleton for the UserProfileSidebar.
 */
export function UserProfileSidebarLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`flex min-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 ${className}`}>
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md animate-pulse">
        <div className="h-24 w-full bg-neutral-200 rounded" />
        <div className="h-16 w-full bg-neutral-200 rounded" />
        <div className="h-32 w-full bg-neutral-200 rounded" />
      </div>
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md animate-pulse">
        <div className="h-48 w-full bg-neutral-200 rounded" />
      </div>
    </div>
  );
}
