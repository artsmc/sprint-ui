'use client';

import React from 'react';
import { IconWithBackground } from '@/ui/components/IconWithBackground';
import { Tabs } from '@/ui/components/Tabs';
import {
  FeatherAward,
  FeatherMessageCircle,
  FeatherMousePointer,
  FeatherTrendingUp,
  FeatherTrophy,
  FeatherZap,
} from '@subframe/core';
import type { SprintAwardWithRelations } from '@/lib/types';
import type { HighlightTabType } from '@/lib/api/user-profile-sidebar';

interface SprintHighlightsProps {
  sprintAwards: SprintAwardWithRelations[];
  activeTab: HighlightTabType;
  onTabChange: (tab: HighlightTabType) => void;
}

type AwardVariant = 'warning' | 'success' | 'brand' | 'neutral';

interface AwardInfo {
  icon: React.ReactNode;
  label: string;
  variant: AwardVariant;
}

const AWARD_TYPE_MAP: Record<string, AwardInfo> = {
  top_visual: {
    icon: <FeatherTrophy />,
    label: 'Top Visual Design',
    variant: 'warning',
  },
  top_usability: {
    icon: <FeatherMousePointer />,
    label: 'Top Usability',
    variant: 'success',
  },
  top_clarity: {
    icon: <FeatherZap />,
    label: 'Top Clarity',
    variant: 'brand',
  },
  top_originality: {
    icon: <FeatherAward />,
    label: 'Top Originality',
    variant: 'warning',
  },
  feedback_mvp: {
    icon: <FeatherMessageCircle />,
    label: 'Feedback MVP',
    variant: 'brand',
  },
  people_choice: {
    icon: <FeatherTrophy />,
    label: "People's Choice",
    variant: 'warning',
  },
  most_improved: {
    icon: <FeatherTrendingUp />,
    label: 'Most Improved',
    variant: 'neutral',
  },
};

const VARIANT_STYLES: Record<AwardVariant, { bg: string; titleText: string; bodyText: string }> = {
  warning: { bg: 'bg-warning-50', titleText: 'text-warning-900', bodyText: 'text-warning-800' },
  success: { bg: 'bg-success-50', titleText: 'text-success-900', bodyText: 'text-success-800' },
  brand: { bg: 'bg-brand-50', titleText: 'text-brand-900', bodyText: 'text-brand-800' },
  neutral: { bg: 'bg-neutral-50', titleText: 'text-neutral-900', bodyText: 'text-neutral-800' },
};

function AwardCard({ award }: { award: SprintAwardWithRelations }) {
  const awardInfo = AWARD_TYPE_MAP[award.award_type] || {
    icon: <FeatherAward />,
    label: award.award_type,
    variant: 'neutral' as AwardVariant,
  };

  const styles = VARIANT_STYLES[awardInfo.variant];

  return (
    <div className={`flex w-full items-center gap-3 rounded-md px-4 py-4 ${styles.bg}`}>
      <IconWithBackground
        variant={awardInfo.variant}
        size="medium"
        icon={awardInfo.icon}
      />
      <div className="flex grow shrink-0 basis-0 flex-col items-start">
        <span className={`text-caption-bold font-caption-bold ${styles.titleText}`}>
          {awardInfo.label}
        </span>
        <span className={`text-body font-body ${styles.bodyText}`}>
          {award.expand?.user_id?.name || 'Unknown User'}
        </span>
      </div>
    </div>
  );
}

function AwardsList({ awards }: { awards: SprintAwardWithRelations[] }) {
  if (awards.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <span className="text-body font-body text-subtext-color">
          No awards yet this sprint. Keep designing!
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {awards.slice(0, 4).map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  );
}

/**
 * Displays sprint highlights with tabbed content.
 */
export function SprintHighlights({
  sprintAwards,
  activeTab,
  onTabChange,
}: SprintHighlightsProps) {
  return (
    <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-8 py-8 shadow-md">
      <div className="flex w-full items-center justify-between">
        <span className="text-heading-2 font-heading-2 text-default-font">
          This Sprint Highlights
        </span>
        <Tabs>
          <Tabs.Item
            active={activeTab === 'recognition'}
            onClick={() => onTabChange('recognition')}
          >
            Recognition
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 'participation'}
            onClick={() => onTabChange('participation')}
          >
            Participation
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 'skills'}
            onClick={() => onTabChange('skills')}
          >
            Skills
          </Tabs.Item>
        </Tabs>
      </div>
      <AwardsList awards={sprintAwards} />
    </div>
  );
}
