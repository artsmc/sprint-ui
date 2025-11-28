/**
 * RetrospectiveSummary Component
 *
 * Displays a summary of the sprint retrospective including stats,
 * what went well, what can improve, and questions asked.
 *
 * @module app/challenge-hub/components/retrospective-summary
 */

'use client';

import Link from 'next/link';
import {
  ThumbsUp,
  TrendingUp,
  HelpCircle,
  FileText,
  Vote,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '@/app/ui/components/Badge';
import { Button } from '@/app/ui/components/Button';
import { cn } from '@/lib/utils';
import type { SprintRetroSummary } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface RetrospectiveSummaryProps {
  /** The retrospective summary data */
  summary: SprintRetroSummary;
  /** Sprint number for display and navigation */
  sprintNumber?: number;
  /** Sprint ID for navigation */
  sprintId?: string;
  /** Optional CSS class name */
  className?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Strip HTML and truncate content for display
 */
function formatContent(html: string | null, maxLength: number = 200): string {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// =============================================================================
// Sub-Components
// =============================================================================

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-neutral-400">{icon}</span>
      <span className="text-caption text-neutral-600">
        {value} {label}
      </span>
    </div>
  );
}

interface ContentColumnProps {
  icon: React.ReactNode;
  title: string;
  content: string | null;
  iconColor: string;
}

function ContentColumn({ icon, title, content, iconColor }: ContentColumnProps) {
  const formattedContent = formatContent(content);

  return (
    <div className="flex-1">
      <div className="mb-2 flex items-center gap-2">
        <span className={iconColor}>{icon}</span>
        <h4 className="text-caption-bold font-caption-bold text-neutral-700">
          {title}
        </h4>
      </div>
      {formattedContent ? (
        <p className="text-caption text-neutral-600 leading-relaxed">
          {formattedContent}
        </p>
      ) : (
        <p className="text-caption text-neutral-400 italic">
          No content available
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * RetrospectiveSummary displays the sprint retro overview.
 *
 * Features:
 * - Sprint stats (submissions, votes, comments)
 * - Three-column layout for retro categories
 * - Truncated content with "View Full Results" link
 * - Responsive layout (stacks on mobile)
 *
 * @example
 * ```tsx
 * <RetrospectiveSummary
 *   summary={retroSummary}
 *   sprintNumber={5}
 *   sprintId="sprint-123"
 * />
 * ```
 */
export function RetrospectiveSummary({
  summary,
  sprintNumber,
  sprintId,
  className,
}: RetrospectiveSummaryProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white p-5 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-body-bold font-body-bold text-neutral-900">
            Retrospective Summary
          </h3>
          {sprintNumber && (
            <Badge variant="neutral">Sprint {sprintNumber}</Badge>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-4 flex flex-wrap gap-4 rounded-md bg-neutral-50 p-3">
        <StatItem
          icon={<FileText className="h-4 w-4" />}
          label="submissions"
          value={summary.submissions_count}
        />
        <StatItem
          icon={<Vote className="h-4 w-4" />}
          label="votes"
          value={summary.votes_count}
        />
        <StatItem
          icon={<MessageSquare className="h-4 w-4" />}
          label="comments"
          value={summary.comments_count}
        />
      </div>

      {/* Three-Column Content */}
      <div className="grid gap-4 md:grid-cols-3">
        <ContentColumn
          icon={<ThumbsUp className="h-4 w-4" />}
          title="What Was Good"
          content={summary.what_was_good}
          iconColor="text-success-600"
        />
        <ContentColumn
          icon={<TrendingUp className="h-4 w-4" />}
          title="What Can Improve"
          content={summary.what_can_improve}
          iconColor="text-warning-600"
        />
        <ContentColumn
          icon={<HelpCircle className="h-4 w-4" />}
          title="What Was Asked"
          content={summary.what_was_asked}
          iconColor="text-brand-600"
        />
      </div>

      {/* View Full Results */}
      {sprintId && (
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <Link href={`/sprints/${sprintId}/retrospective`}>
            <Button variant="neutral-secondary" size="small">
              View Full Results
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default RetrospectiveSummary;
