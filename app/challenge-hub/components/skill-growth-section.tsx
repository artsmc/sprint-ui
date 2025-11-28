/**
 * SkillGrowthSection Component
 *
 * Displays user's skill progress with level indicators, progress bars,
 * and improvement tips.
 *
 * @module app/challenge-hub/components/skill-growth-section
 */

'use client';

import { Lightbulb } from 'lucide-react';
import { Badge } from '@/app/ui/components/Badge';
import { Progress } from '@/app/ui/components/Progress';
import {
  calculateSkillLevel,
  calculateSkillProgress,
  getSkillTip,
} from '@/lib/utils/skill-calculations';
import { cn } from '@/lib/utils';
import type { UserSkillProgressWithSkill } from '@/lib/api/skills';

// =============================================================================
// Types
// =============================================================================

export interface SkillGrowthSectionProps {
  /** User's skill progress data with skill details */
  skillProgress: UserSkillProgressWithSkill[];
  /** Maximum number of skills to display (default: 4) */
  maxSkills?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional section title */
  title?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Sort skills by XP in descending order
 */
function sortByXP(skills: UserSkillProgressWithSkill[]): UserSkillProgressWithSkill[] {
  return [...skills].sort((a, b) => b.xp - a.xp);
}

/**
 * Get the skill with the lowest XP (for tip display)
 */
function getLowestSkill(skills: UserSkillProgressWithSkill[]): UserSkillProgressWithSkill | null {
  if (skills.length === 0) return null;
  return skills.reduce((lowest, current) =>
    current.xp < lowest.xp ? current : lowest
  );
}

// =============================================================================
// Sub-Components
// =============================================================================

interface SkillRowProps {
  skill: UserSkillProgressWithSkill;
}

function SkillRow({ skill }: SkillRowProps) {
  const skillDetails = skill.expand?.skill_id;
  if (!skillDetails) return null;

  const level = calculateSkillLevel(skill.xp);
  const progress = calculateSkillProgress(skill.xp, level);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-body font-body text-neutral-800">
            {skillDetails.name}
          </span>
          <Badge variant="neutral" className="text-xs">
            Lv. {level}
          </Badge>
        </div>
        <span className="text-caption text-neutral-500">{skill.xp} XP</span>
      </div>
      <Progress
        value={progress}
        className="h-1.5"
        aria-label={`${skillDetails.name} progress: ${progress}%`}
      />
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * SkillGrowthSection displays the user's top skills with progress tracking.
 *
 * Features:
 * - Skills sorted by XP (highest first)
 * - Level badges for each skill
 * - Progress bars showing advancement to next level
 * - Improvement tip for the lowest skill
 *
 * @example
 * ```tsx
 * <SkillGrowthSection
 *   skillProgress={userSkillProgress}
 *   maxSkills={4}
 * />
 * ```
 */
export function SkillGrowthSection({
  skillProgress,
  maxSkills = 4,
  className,
  title = 'Skill Growth',
}: SkillGrowthSectionProps) {
  // Filter out skills without expanded data
  const validSkills = skillProgress.filter(
    (sp) => sp.expand?.skill_id !== undefined
  );

  // Sort by XP and take top skills
  const sortedSkills = sortByXP(validSkills);
  const topSkills = sortedSkills.slice(0, maxSkills);

  // Get lowest skill for tip
  const lowestSkill = getLowestSkill(topSkills);
  const skillTip = lowestSkill?.expand?.skill_id?.slug
    ? getSkillTip(lowestSkill.expand.skill_id.slug)
    : null;

  // Handle empty state
  if (topSkills.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-neutral-200 bg-white p-5 shadow-sm',
          className
        )}
      >
        <h3 className="mb-4 text-body-bold font-body-bold text-neutral-900">
          {title}
        </h3>
        <p className="text-body text-neutral-500">
          No skills tracked yet. Submit designs and receive feedback to start
          building your skill profile!
        </p>
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
      <h3 className="mb-4 text-body-bold font-body-bold text-neutral-900">
        {title}
      </h3>

      {/* Skills List */}
      <div className="space-y-4">
        {topSkills.map((skill) => (
          <SkillRow key={skill.id} skill={skill} />
        ))}
      </div>

      {/* Improvement Tip */}
      {skillTip && lowestSkill?.expand?.skill_id && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-brand-50 p-3">
          <Lightbulb
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600"
            aria-hidden="true"
          />
          <div>
            <p className="text-caption-bold font-caption-bold text-brand-800">
              Tip for {lowestSkill.expand.skill_id.name}
            </p>
            <p className="text-caption text-brand-700">{skillTip}</p>
          </div>
        </div>
      )}

      {/* View All Link */}
      {sortedSkills.length > maxSkills && (
        <div className="mt-4 border-t border-neutral-100 pt-3 text-center">
          <button
            className="text-caption-bold text-brand-600 hover:text-brand-700 hover:underline"
            // TODO: Navigate to full skills page
          >
            View all {sortedSkills.length} skills
          </button>
        </div>
      )}
    </div>
  );
}

export default SkillGrowthSection;
