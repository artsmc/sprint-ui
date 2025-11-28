/**
 * SprintHighlightsSection Component
 *
 * Displays awards from the current or last completed sprint,
 * highlighting top submissions and special recognitions.
 *
 * @module app/challenge-hub/components/sprint-highlights-section
 */

'use client';

import {
  Trophy,
  Star,
  Eye,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Users,
  Award,
} from 'lucide-react';
import { Badge } from '@/app/ui/components/Badge';
import { cn } from '@/lib/utils';
import type { SprintAwardWithRelations, AwardType } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

export interface SprintHighlightsSectionProps {
  /** Awards from the sprint */
  awards: SprintAwardWithRelations[];
  /** Sprint number for display */
  sprintNumber?: number;
  /** The current user's ID (to highlight their award) */
  currentUserId?: string;
  /** Optional CSS class name */
  className?: string;
  /** Optional section title */
  title?: string;
}

// =============================================================================
// Award Configuration
// =============================================================================

interface AwardConfig {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const AWARD_CONFIG: Record<AwardType, AwardConfig> = {
  top_visual: {
    icon: <Eye className="h-5 w-5" />,
    label: 'Best Visual Design',
    color: 'text-purple-600 bg-purple-100',
  },
  top_usability: {
    icon: <Star className="h-5 w-5" />,
    label: 'Best Usability',
    color: 'text-blue-600 bg-blue-100',
  },
  top_clarity: {
    icon: <Lightbulb className="h-5 w-5" />,
    label: 'Most Clear',
    color: 'text-yellow-600 bg-yellow-100',
  },
  top_originality: {
    icon: <Lightbulb className="h-5 w-5" />,
    label: 'Most Original',
    color: 'text-pink-600 bg-pink-100',
  },
  feedback_mvp: {
    icon: <MessageSquare className="h-5 w-5" />,
    label: 'Feedback MVP',
    color: 'text-green-600 bg-green-100',
  },
  most_improved: {
    icon: <TrendingUp className="h-5 w-5" />,
    label: 'Most Improved',
    color: 'text-orange-600 bg-orange-100',
  },
  participation_champion: {
    icon: <Users className="h-5 w-5" />,
    label: 'Participation Champion',
    color: 'text-teal-600 bg-teal-100',
  },
};

// =============================================================================
// Sub-Components
// =============================================================================

interface AwardCardProps {
  award: SprintAwardWithRelations;
  isCurrentUser: boolean;
}

function AwardCard({ award, isCurrentUser }: AwardCardProps) {
  const config = AWARD_CONFIG[award.award_type];
  const user = award.expand?.user_id;
  const submission = award.expand?.submission_id;

  if (!config) return null;

  // Parse the color classes
  const [textColor, bgColor] = config.color.split(' ');

  return (
    <div
      className={cn(
        'relative rounded-lg border bg-white p-4 transition-shadow hover:shadow-md',
        isCurrentUser
          ? 'border-brand-300 ring-2 ring-brand-200'
          : 'border-neutral-200'
      )}
    >
      {/* User's Award Badge */}
      {isCurrentUser && (
        <Badge
          variant="brand"
          className="absolute -top-2 -right-2 text-xs"
        >
          Your Award!
        </Badge>
      )}

      {/* Award Icon and Type */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className={cn('rounded-full p-2', bgColor)}
          aria-hidden="true"
        >
          <span className={textColor}>{config.icon}</span>
        </div>
        <span className="text-caption-bold font-caption-bold text-neutral-700">
          {config.label}
        </span>
      </div>

      {/* Submission Thumbnail */}
      {submission && (
        <div className="mb-3 aspect-video w-full overflow-hidden rounded-md bg-neutral-100">
          {/* TODO: Add actual thumbnail URL when available */}
          <div className="flex h-full w-full items-center justify-center">
            <Award className="h-8 w-8 text-neutral-300" />
          </div>
        </div>
      )}

      {/* Winner Info */}
      <div className="flex items-center gap-2">
        <Trophy
          className="h-4 w-4 text-warning-500"
          aria-hidden="true"
        />
        <span className="text-body font-body text-neutral-900">
          {user?.name || 'Unknown Designer'}
        </span>
      </div>

      {/* Submission Title */}
      {submission?.title && (
        <p className="mt-1 truncate text-caption text-neutral-500">
          {submission.title}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * SprintHighlightsSection displays awards from a sprint.
 *
 * Features:
 * - Award cards with icons and type labels
 * - Winner names and submission thumbnails
 * - Current user's award highlighted
 * - Empty state when no awards exist
 *
 * @example
 * ```tsx
 * <SprintHighlightsSection
 *   awards={sprintAwards}
 *   sprintNumber={5}
 *   currentUserId={user.id}
 * />
 * ```
 */
export function SprintHighlightsSection({
  awards,
  sprintNumber,
  currentUserId,
  className,
  title = 'Sprint Highlights',
}: SprintHighlightsSectionProps) {
  // Handle empty state
  if (awards.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-neutral-200 bg-white p-5 shadow-sm',
          className
        )}
      >
        <h3 className="mb-4 text-body-bold font-body-bold text-neutral-900">
          {title}
          {sprintNumber && (
            <span className="ml-2 text-neutral-500">Sprint {sprintNumber}</span>
          )}
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="mb-3 h-10 w-10 text-neutral-300" />
          <p className="text-body text-neutral-500">
            No awards yet for this sprint.
          </p>
          <p className="mt-1 text-caption text-neutral-400">
            Awards will be announced after the retrospective.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white p-5 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-body-bold font-body-bold text-neutral-900">
          {title}
          {sprintNumber && (
            <span className="ml-2 font-normal text-neutral-500">
              Sprint {sprintNumber}
            </span>
          )}
        </h3>
        <Badge variant="success">{awards.length} Awards</Badge>
      </div>

      {/* Awards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award) => (
          <AwardCard
            key={award.id}
            award={award}
            isCurrentUser={currentUserId === award.user_id}
          />
        ))}
      </div>
    </div>
  );
}

export default SprintHighlightsSection;
