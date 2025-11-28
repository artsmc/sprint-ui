/**
 * Challenge Hub Error Boundary
 *
 * Error UI displayed when the Challenge Hub page encounters an error.
 * Uses Next.js error boundary conventions for automatic error catching.
 *
 * @module app/challenge-hub/error
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/components/Button';

// =============================================================================
// Types
// =============================================================================

interface ChallengeHubErrorProps {
  /** The error that was thrown */
  error: Error & { digest?: string };
  /** Function to attempt recovery by re-rendering the segment */
  reset: () => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Error boundary component for the Challenge Hub page.
 *
 * Displays a user-friendly error message with options to:
 * - Retry loading the page
 * - Navigate back to home
 *
 * @example
 * // Automatically used by Next.js when an error occurs in the route segment
 * // File must be named error.tsx and placed in the route directory
 */
export default function ChallengeHubError({
  error,
  reset,
}: ChallengeHubErrorProps) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error('Challenge Hub Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <svg
              className="h-12 w-12 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We encountered an error while loading the Challenge Hub.
            Please try again or return to the home page.
          </p>
        </div>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="text-sm font-mono text-muted-foreground break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="brand-primary">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="neutral-secondary">Back to Home</Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted-foreground">
          If this problem persists, please{' '}
          <Link
            href="/support"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
