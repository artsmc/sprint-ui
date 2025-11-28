'use client';

import { Badge } from '@/ui/components/Badge';
import { FeatherAward } from '@subframe/core';
import type { UserBadgeWithRelations } from '@/lib/types';

interface BadgeListProps {
  badges: UserBadgeWithRelations[];
  maxDisplay?: number;
}

/**
 * Displays a list of user badges.
 */
export function BadgeList({ badges, maxDisplay = 3 }: BadgeListProps) {
  if (badges.length === 0) {
    return (
      <div className="flex w-full items-center gap-2 flex-wrap">
        <span className="text-body font-body text-subtext-color">
          No badges earned yet
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2 flex-wrap">
      {badges.slice(0, maxDisplay).map((userBadge) => (
        <Badge key={userBadge.id} icon={<FeatherAward />}>
          {userBadge.expand?.badge_id?.name || 'Badge'}
        </Badge>
      ))}
    </div>
  );
}
