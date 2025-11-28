/**
 * Unit Tests for RetrospectiveSummary Component
 */

import { render, screen } from '@testing-library/react';
import { RetrospectiveSummary } from '../retrospective-summary';
import type { SprintRetroSummary } from '@/lib/types';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) =>
    args
      .filter(Boolean)
      .flat()
      .filter((x) => typeof x === 'string')
      .join(' '),
}));

describe('RetrospectiveSummary', () => {
  const mockRetroSummary: SprintRetroSummary = {
    id: 'retro-123',
    sprint_id: 'sprint-456',
    submissions_count: 25,
    votes_count: 150,
    comments_count: 80,
    what_was_good: '<p>Great participation and high quality designs</p>',
    what_can_improve: '<p>More detailed feedback would help</p>',
    what_was_asked: '<p>More time for voting phase</p>',
    created: '2025-01-15T00:00:00Z',
    updated: '2025-01-15T00:00:00Z',
    collectionId: 'sprint_retro_summaries',
    collectionName: 'sprint_retro_summaries',
  };

  describe('rendering', () => {
    it('should render section title', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.getByText('Retrospective Summary')).toBeInTheDocument();
    });

    it('should render sprint number when provided', () => {
      render(
        <RetrospectiveSummary
          summary={mockRetroSummary}
          sprintNumber={5}
        />
      );

      expect(screen.getByText('Sprint 5')).toBeInTheDocument();
    });
  });

  describe('statistics', () => {
    it('should render submissions count', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.getByText('25 submissions')).toBeInTheDocument();
    });

    it('should render votes count', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.getByText('150 votes')).toBeInTheDocument();
    });

    it('should render comments count', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.getByText('80 comments')).toBeInTheDocument();
    });
  });

  describe('feedback columns', () => {
    it('should render what was good section', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.getByText('What Was Good')).toBeInTheDocument();
      expect(
        screen.getByText('Great participation and high quality designs')
      ).toBeInTheDocument();
    });

    it('should render what can improve section', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.getByText('What Can Improve')).toBeInTheDocument();
      expect(
        screen.getByText('More detailed feedback would help')
      ).toBeInTheDocument();
    });

    it('should render what was asked section', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.getByText('What Was Asked')).toBeInTheDocument();
      expect(
        screen.getByText('More time for voting phase')
      ).toBeInTheDocument();
    });
  });

  describe('empty content handling', () => {
    it('should handle null what_was_good', () => {
      const summaryWithNullGood: SprintRetroSummary = {
        ...mockRetroSummary,
        what_was_good: null,
      };
      render(<RetrospectiveSummary summary={summaryWithNullGood} />);

      expect(screen.getByText('What Was Good')).toBeInTheDocument();
      expect(screen.getByText('No content available')).toBeInTheDocument();
    });

    it('should handle null what_can_improve', () => {
      const summaryWithNullImprove: SprintRetroSummary = {
        ...mockRetroSummary,
        what_can_improve: null,
      };
      render(<RetrospectiveSummary summary={summaryWithNullImprove} />);

      expect(screen.getByText('What Can Improve')).toBeInTheDocument();
    });

    it('should handle null what_was_asked', () => {
      const summaryWithNullAsked: SprintRetroSummary = {
        ...mockRetroSummary,
        what_was_asked: null,
      };
      render(<RetrospectiveSummary summary={summaryWithNullAsked} />);

      expect(screen.getByText('What Was Asked')).toBeInTheDocument();
    });
  });

  describe('content truncation', () => {
    it('should truncate long content', () => {
      const longContent = '<p>' + 'A'.repeat(300) + '</p>';
      const summaryWithLongContent: SprintRetroSummary = {
        ...mockRetroSummary,
        what_was_good: longContent,
      };
      render(<RetrospectiveSummary summary={summaryWithLongContent} />);

      // Content should be truncated with ellipsis
      const truncatedText = screen.getByText(/A+\.\.\./);
      expect(truncatedText).toBeInTheDocument();
    });
  });

  describe('HTML stripping', () => {
    it('should strip HTML tags from content', () => {
      const htmlContent = '<p><strong>Bold</strong> and <em>italic</em> text</p>';
      const summaryWithHtml: SprintRetroSummary = {
        ...mockRetroSummary,
        what_was_good: htmlContent,
      };
      render(<RetrospectiveSummary summary={summaryWithHtml} />);

      expect(screen.getByText('Bold and italic text')).toBeInTheDocument();
    });
  });

  describe('view full results link', () => {
    it('should render link when sprintId provided', () => {
      render(
        <RetrospectiveSummary
          summary={mockRetroSummary}
          sprintId="sprint-456"
        />
      );

      expect(screen.getByText('View Full Results')).toBeInTheDocument();
    });

    it('should not render link when sprintId not provided', () => {
      render(<RetrospectiveSummary summary={mockRetroSummary} />);

      expect(screen.queryByText('View Full Results')).not.toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <RetrospectiveSummary
          summary={mockRetroSummary}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
