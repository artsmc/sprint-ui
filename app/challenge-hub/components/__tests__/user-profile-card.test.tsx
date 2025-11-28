/**
 * Unit Tests for UserProfileCard Component
 */

import { render, screen } from '@testing-library/react';
import { UserProfileCard, type UserStreaks } from '../user-profile-card';
import type { User, UserBadgeWithRelations } from '@/lib/types';

// Mock the utility functions
jest.mock('@/lib/utils', () => ({
  getUserTitle: jest.fn(() => 'Rising Designer'),
  calculateLevelProgress: jest.fn(() => 65),
  formatXPProgress: jest.fn(() => '650 / 1,000 XP'),
  cn: (...args: unknown[]) =>
    args
      .filter(Boolean)
      .flat()
      .filter((x) => typeof x === 'string')
      .join(' '),
}));

jest.mock('@/lib/utils/date-formatting', () => ({
  formatDateShort: jest.fn(() => 'Jan 15'),
}));

describe('UserProfileCard', () => {
  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    total_xp: 650,
    badges: [],
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-15T00:00:00Z',
    collectionId: 'users',
    collectionName: 'users',
  };

  const mockBadges: UserBadgeWithRelations[] = [
    {
      id: 'ub-1',
      user_id: 'user-123',
      badge_id: 'badge-1',
      awarded_at: '2025-01-10T00:00:00Z',
      created: '2025-01-10T00:00:00Z',
      updated: '2025-01-10T00:00:00Z',
      collectionId: 'user_badges',
      collectionName: 'user_badges',
      expand: {
        badge_id: {
          id: 'badge-1',
          name: 'Early Adopter',
          description: 'Joined during beta',
          icon_url: null,
          created: '2025-01-01T00:00:00Z',
          updated: '2025-01-01T00:00:00Z',
          collectionId: 'badges',
          collectionName: 'badges',
        },
      },
    },
  ];

  const mockStreaks: UserStreaks = {
    sprintStreak: 3,
    feedbackStreak: 5,
  };

  describe('rendering', () => {
    it('should render user name', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should render user level', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      expect(screen.getByText('Level 5')).toBeInTheDocument();
    });

    it('should render user title', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      expect(screen.getByText('Rising Designer')).toBeInTheDocument();
    });

    it('should render XP progress', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      expect(screen.getByText('650 / 1,000 XP')).toBeInTheDocument();
    });
  });

  describe('avatar', () => {
    it('should render user initials when no avatar', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      // Avatar should show "TU" for "Test User"
      expect(screen.getByText('TU')).toBeInTheDocument();
    });

    it('should handle single word name', () => {
      const singleNameUser = { ...mockUser, name: 'Designer' };
      render(
        <UserProfileCard
          user={singleNameUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
    });
  });

  describe('badges', () => {
    it('should render badges section title', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={mockBadges}
        />
      );

      expect(screen.getByText('Badges Earned')).toBeInTheDocument();
    });

    it('should show empty badges message when no badges', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      expect(
        screen.getByText(/no badges earned yet/i)
      ).toBeInTheDocument();
    });

    it('should show badge overflow count when more than 8 badges', () => {
      const manyBadges = Array.from({ length: 10 }, (_, i) => ({
        ...mockBadges[0],
        id: `badge-${i}`,
      }));

      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={manyBadges}
        />
      );

      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  describe('streaks', () => {
    it('should render sprint streak', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
          streaks={mockStreaks}
        />
      );

      expect(screen.getByText('3 Sprint Streak')).toBeInTheDocument();
    });

    it('should render feedback streak', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
          streaks={mockStreaks}
        />
      );

      expect(screen.getByText('5 Feedback Streak')).toBeInTheDocument();
    });

    it('should not render streaks when not provided', () => {
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
        />
      );

      expect(screen.queryByText(/streak/i)).not.toBeInTheDocument();
    });

    it('should not render streak with 0 value', () => {
      const zeroStreaks = { sprintStreak: 0, feedbackStreak: 5 };
      render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
          streaks={zeroStreaks}
        />
      );

      expect(screen.queryByText(/Sprint Streak/)).not.toBeInTheDocument();
      expect(screen.getByText('5 Feedback Streak')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <UserProfileCard
          user={mockUser}
          xpTotal={650}
          level={5}
          badges={[]}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
