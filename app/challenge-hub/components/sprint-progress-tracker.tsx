/**
 * SprintProgressTracker Component
 *
 * Displays a user's progress through sprint tasks with XP tracking.
 * Shows a checklist of tasks with completion status and XP rewards.
 *
 * @module app/challenge-hub/components/sprint-progress-tracker
 */

'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { Progress } from '@/app/ui/components/Progress';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Represents a single task in the sprint progress tracker.
 */
export interface TaskItem {
  /** Unique identifier for the task */
  id: string;
  /** Display name of the task */
  name: string;
  /** XP reward for completing this task */
  xp: number;
  /** Whether the task has been completed */
  completed: boolean;
  /** Optional description or tooltip text */
  description?: string;
}

export interface SprintProgressTrackerProps {
  /** List of tasks to display */
  tasks: TaskItem[];
  /** Total XP earned from completed tasks */
  totalXP: number;
  /** Maximum possible XP for all tasks */
  maxXP: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional header title override */
  title?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate the number of completed tasks
 */
function getCompletedCount(tasks: TaskItem[]): number {
  return tasks.filter((task) => task.completed).length;
}

// =============================================================================
// Component
// =============================================================================

/**
 * SprintProgressTracker displays a checklist of sprint tasks with XP tracking.
 *
 * Features:
 * - Visual checklist with completion indicators
 * - XP rewards shown for each task
 * - Progress bar showing overall completion
 * - Summary of completed tasks and XP earned
 *
 * @example
 * ```tsx
 * <SprintProgressTracker
 *   tasks={[
 *     { id: '1', name: 'Read the brief', xp: 10, completed: true },
 *     { id: '2', name: 'Upload design', xp: 50, completed: false },
 *   ]}
 *   totalXP={10}
 *   maxXP={100}
 * />
 * ```
 */
export function SprintProgressTracker({
  tasks,
  totalXP,
  maxXP,
  className,
  title = 'Sprint Progress',
}: SprintProgressTrackerProps) {
  const completedCount = getCompletedCount(tasks);
  const progressPercent = maxXP > 0 ? Math.round((totalXP / maxXP) * 100) : 0;
  const allComplete = completedCount === tasks.length && tasks.length > 0;

  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white p-4 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-body-bold font-body-bold text-neutral-900">
          {title}
        </h3>
        <p className="text-caption text-neutral-600">
          Complete tasks to earn XP
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'flex items-center justify-between rounded-md p-2 transition-colors',
              task.completed ? 'bg-success-50' : 'bg-neutral-50'
            )}
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <CheckCircle
                  className="h-5 w-5 text-success-600"
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  className="h-5 w-5 text-neutral-400"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'text-body font-body',
                  task.completed
                    ? 'text-neutral-700'
                    : 'text-neutral-600'
                )}
              >
                {task.name}
              </span>
            </div>
            <span
              className={cn(
                'text-caption-bold font-caption-bold',
                task.completed ? 'text-success-700' : 'text-neutral-500'
              )}
            >
              +{task.xp} XP
            </span>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-4 border-t border-neutral-100 pt-4">
        {/* Progress Bar */}
        <div className="mb-2">
          <Progress
            value={progressPercent}
            className="h-2"
            aria-label={`Progress: ${progressPercent}%`}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-caption">
          <span className="text-neutral-600">
            {completedCount}/{tasks.length} tasks completed
          </span>
          <span className="font-caption-bold text-brand-700">
            {totalXP}/{maxXP} XP
          </span>
        </div>

        {/* Celebration Message */}
        {allComplete && (
          <div
            className="mt-3 rounded-md bg-success-100 p-2 text-center text-caption-bold text-success-800"
            role="status"
            aria-live="polite"
          >
            All tasks complete! Great work!
          </div>
        )}
      </div>
    </div>
  );
}

export default SprintProgressTracker;
