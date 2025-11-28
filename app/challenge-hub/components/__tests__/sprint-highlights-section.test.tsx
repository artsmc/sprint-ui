/**
 * Unit Tests for SprintHighlightsSection Component
 */

import { render, screen } from '@testing-library/react';
import { SprintHighlightsSection } from '../sprint-highlights-section';
import type { SprintAwardWithRelations } from '@/lib/types';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) =>
    args
      .filter(Boolean)
      .flat()
      .filter((x) => typeof x === 'string')
      .join(' '),
}));

describe('SprintHighlightsSection', () => {
  const mockAwards: SprintAwardWithRelations[] = [
    {
      id: 'award-1',
      sprint_id: 'sprint-123',
      user_id: 'user-1',
      submission_id: 'sub-1',
      award_type: 'top_visual',
      created: '2025-01-15T00:00:00Z',
      updated: '2025-01-15T00:00:00Z',
      collectionId: 'sprint_awards',
      collectionName: 'sprint_awards',
      expand: {
        user_id: {
          id: 'user-1',
          name: 'Alice Designer',
          email: 'alice@example.com',
          total_xp: 500,
          badges: [],
          created: '2025-01-01T00:00:00Z',
          updated: '2025-01-15T00:00:00Z',
          collectionId: 'users',
          collectionName: 'users',
        },
        submission_id: {
          id: 'sub-1',
          sprint_id: 'sprint-123',
          user_id: 'user-1',
          title: 'Amazing Dashboard Design',
          image_url: 'https://example.com/image.jpg',
          submitted_at: '2025-01-14T00:00:00Z',
          created: '2025-01-14T00:00:00Z',
          updated: '2025-01-14T00:00:00Z',
          collectionId: 'submissions',
          collectionName: 'submissions',
        },
      },
    },
    {
      id: 'award-2',
      sprint_id: 'sprint-123',
      user_id: 'user-2',
      submission_id: 'sub-2',
      award_type: 'feedback_mvp',
      created: '2025-01-15T00:00:00Z',
      updated: '2025-01-15T00:00:00Z',
      collectionId: 'sprint_awards',
      collectionName: 'sprint_awards',
      expand: {
        user_id: {
          id: 'user-2',
          name: 'Bob Reviewer',
          email: 'bob@example.com',
          total_xp: 300,
          badges: [],
          created: '2025-01-01T00:00:00Z',
          updated: '2025-01-15T00:00:00Z',
          collectionId: 'users',
          collectionName: 'users',
        },
      },
    },
  ];

  describe('rendering', () => {
    it('should render section title', () => {
      render(<SprintHighlightsSection awards={mockAwards} />);

      expect(screen.getByText('Sprint Highlights')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(
        <SprintHighlightsSection awards={mockAwards} title="Top Performers" />
      );

      expect(screen.getByText('Top Performers')).toBeInTheDocument();
    });

    it('should render sprint number when provided', () => {
      render(<SprintHighlightsSection awards={mockAwards} sprintNumber={5} />);

      expect(screen.getByText('Sprint 5')).toBeInTheDocument();
    });

    it('should render awards count badge', () => {
      render(<SprintHighlightsSection awards={mockAwards} />);

      expect(screen.getByText('2 Awards')).toBeInTheDocument();
    });
  });

  describe('award cards', () => {
    it('should render award type labels', () => {
      render(<SprintHighlightsSection awards={mockAwards} />);

      expect(screen.getByText('Best Visual Design')).toBeInTheDocument();
      expect(screen.getByText('Feedback MVP')).toBeInTheDocument();
    });

    it('should render winner names', () => {
      render(<SprintHighlightsSection awards={mockAwards} />);

      expect(screen.getByText('Alice Designer')).toBeInTheDocument();
      expect(screen.getByText('Bob Reviewer')).toBeInTheDocument();
    });

    it('should render submission title when available', () => {
      render(<SprintHighlightsSection awards={mockAwards} />);

      expect(screen.getByText('Amazing Dashboard Design')).toBeInTheDocument();
    });

    it('should handle missing user gracefully', () => {
      const awardWithoutUser: SprintAwardWithRelations[] = [
        {
          ...mockAwards[0],
          expand: undefined,
        },
      ];
      render(<SprintHighlightsSection awards={awardWithoutUser} />);

      expect(screen.getByText('Unknown Designer')).toBeInTheDocument();
    });
  });

  describe('current user highlighting', () => {
    it('should highlight current user award', () => {
      render(
        <SprintHighlightsSection
          awards={mockAwards}
          currentUserId="user-1"
        />
      );

      expect(screen.getByText('Your Award!')).toBeInTheDocument();
    });

    it('should not highlight other users awards', () => {
      render(
        <SprintHighlightsSection
          awards={mockAwards}
          currentUserId="user-999"
        />
      );

      expect(screen.queryByText('Your Award!')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render empty state when no awards', () => {
      render(<SprintHighlightsSection awards={[]} />);

      expect(screen.getByText('No awards yet for this sprint.')).toBeInTheDocument();
    });

    it('should show helpful message in empty state', () => {
      render(<SprintHighlightsSection awards={[]} />);

      expect(
        screen.getByText('Awards will be announced after the retrospective.')
      ).toBeInTheDocument();
    });
  });

  describe('award types', () => {
    it('should render all supported award types', () => {
      const allAwardTypes: SprintAwardWithRelations[] = [
        { ...mockAwards[0], id: 'a1', award_type: 'top_visual' },
        { ...mockAwards[0], id: 'a2', award_type: 'top_usability' },
        { ...mockAwards[0], id: 'a3', award_type: 'top_clarity' },
        { ...mockAwards[0], id: 'a4', award_type: 'top_originality' },
        { ...mockAwards[0], id: 'a5', award_type: 'feedback_mvp' },
        { ...mockAwards[0], id: 'a6', award_type: 'most_improved' },
        { ...mockAwards[0], id: 'a7', award_type: 'participation_champion' },
      ];

      render(<SprintHighlightsSection awards={allAwardTypes} />);

      expect(screen.getByText('Best Visual Design')).toBeInTheDocument();
      expect(screen.getByText('Best Usability')).toBeInTheDocument();
      expect(screen.getByText('Most Clear')).toBeInTheDocument();
      expect(screen.getByText('Most Original')).toBeInTheDocument();
      expect(screen.getByText('Feedback MVP')).toBeInTheDocument();
      expect(screen.getByText('Most Improved')).toBeInTheDocument();
      expect(screen.getByText('Participation Champion')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <SprintHighlightsSection awards={mockAwards} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
