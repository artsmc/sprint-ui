/**
 * ChallengePreview Component Tests
 *
 * Unit tests for the ChallengePreview component.
 * Tests cover Gherkin Scenarios: 13 (Challenge preview updates), 29 (Empty state)
 *
 * @module __tests__/app/sprint-control/components/start-next-sprint/challenge-preview.test
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChallengePreview } from '@/app/sprint-control/components/start-next-sprint/challenge-preview';
import type { Challenge } from '@/lib/types';

// Mock Subframe components
jest.mock('@/app/ui/components/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

// =============================================================================
// Test Data
// =============================================================================

const mockChallenge: Challenge = {
  id: 'challenge_012',
  challenge_number: 12,
  title: 'Dashboard Analytics',
  brief: '<p>Design a <strong>comprehensive dashboard</strong> for analytics. Include charts and metrics.</p>',
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-01T00:00:00Z',
  collectionId: 'challenges',
  collectionName: 'challenges',
};

const mockChallenge2: Challenge = {
  id: 'challenge_005',
  challenge_number: 5,
  title: 'E-commerce Checkout',
  brief: '<p>Design an e-commerce checkout flow with payment options.</p>',
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-01T00:00:00Z',
  collectionId: 'challenges',
  collectionName: 'challenges',
};

// =============================================================================
// Tests: ChallengePreview Component
// =============================================================================

describe('ChallengePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // Empty State Tests
  // ===========================================================================

  describe('empty state', () => {
    /**
     * Scenario 29: Empty state when no challenge selected
     * Given I am on the Sprint Control page
     * And no challenge is selected yet
     * Then the challenge preview displays: "Select a challenge to see details"
     */
    it('should display empty state message when challenge is null', () => {
      render(<ChallengePreview challenge={null} />);

      expect(screen.getByText('Select a challenge to see details')).toBeInTheDocument();
    });

    it('should display empty state message when challenge is undefined', () => {
      render(<ChallengePreview challenge={undefined} />);

      expect(screen.getByText('Select a challenge to see details')).toBeInTheDocument();
    });

    it('should display the "Challenge Preview" heading in empty state', () => {
      render(<ChallengePreview challenge={null} />);

      expect(screen.getByText('Challenge Preview')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Loading State Tests
  // ===========================================================================

  describe('loading state', () => {
    it('should display loading skeleton when isLoading is true', () => {
      render(<ChallengePreview challenge={null} isLoading={true} />);

      // Should have animated skeleton elements
      const container = screen.getByText('Challenge Preview').parentElement;
      expect(container).toContainElement(
        document.querySelector('.animate-pulse')
      );
    });

    it('should display the "Challenge Preview" heading while loading', () => {
      render(<ChallengePreview challenge={null} isLoading={true} />);

      expect(screen.getByText('Challenge Preview')).toBeInTheDocument();
    });

    it('should not display challenge content while loading', () => {
      render(<ChallengePreview challenge={mockChallenge} isLoading={true} />);

      // Even if challenge is provided, loading state should take precedence
      expect(screen.queryByText('Dashboard Analytics')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Challenge Display Tests
  // ===========================================================================

  describe('challenge display', () => {
    /**
     * Scenario 13: Challenge preview updates on selection
     * When I select "Challenge #12: Dashboard Analytics"
     * Then the challenge preview displays:
     *   - Challenge number: "12"
     *   - Title: "Dashboard Analytics"
     *   - Description: Full challenge description
     */
    it('should display challenge number as a badge', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      const badges = screen.getAllByTestId('badge');
      const numberBadge = badges.find((badge) => badge.textContent?.includes('#12'));
      expect(numberBadge).toHaveTextContent('#12');
    });

    it('should display challenge title', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      expect(screen.getByText('Dashboard Analytics')).toBeInTheDocument();
    });

    it('should display challenge description (brief) with HTML stripped', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      // Should display plain text without HTML tags
      expect(screen.getByText(/Design a comprehensive dashboard for analytics/)).toBeInTheDocument();
      // HTML tags should be removed
      expect(screen.queryByText(/<p>/)).not.toBeInTheDocument();
      expect(screen.queryByText(/<strong>/)).not.toBeInTheDocument();
    });

    it('should display the "Challenge Preview" heading', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      expect(screen.getByText('Challenge Preview')).toBeInTheDocument();
    });

    it('should display skill badges', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      // The component shows placeholder skills for now
      expect(screen.getByText('Visual Design')).toBeInTheDocument();
      expect(screen.getByText('Interaction')).toBeInTheDocument();
      expect(screen.getByText('User Experience')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Challenge Update Tests
  // ===========================================================================

  describe('challenge updates', () => {
    /**
     * Scenario 13 (continued): When I select a different challenge
     * Then the preview immediately updates to show the new challenge details
     */
    it('should update when challenge prop changes', () => {
      const { rerender } = render(<ChallengePreview challenge={mockChallenge} />);

      expect(screen.getByText('Dashboard Analytics')).toBeInTheDocument();
      expect(screen.getByText('#12')).toBeInTheDocument();

      // Update to different challenge
      rerender(<ChallengePreview challenge={mockChallenge2} />);

      expect(screen.getByText('E-commerce Checkout')).toBeInTheDocument();
      expect(screen.getByText('#5')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard Analytics')).not.toBeInTheDocument();
    });

    it('should show empty state when challenge is removed', () => {
      const { rerender } = render(<ChallengePreview challenge={mockChallenge} />);

      expect(screen.getByText('Dashboard Analytics')).toBeInTheDocument();

      // Remove challenge
      rerender(<ChallengePreview challenge={null} />);

      expect(screen.getByText('Select a challenge to see details')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard Analytics')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Brief Text Processing Tests
  // ===========================================================================

  describe('brief text processing', () => {
    it('should strip HTML tags from brief', () => {
      const challengeWithRichHtml: Challenge = {
        ...mockChallenge,
        brief: '<div><h1>Title</h1><p>Paragraph with <em>emphasis</em> and <a href="#">links</a>.</p></div>',
      };

      render(<ChallengePreview challenge={challengeWithRichHtml} />);

      // Should show plain text content
      expect(screen.getByText(/Title/)).toBeInTheDocument();
      expect(screen.getByText(/Paragraph with emphasis and links/)).toBeInTheDocument();
    });

    it('should handle empty brief', () => {
      const challengeWithEmptyBrief: Challenge = {
        ...mockChallenge,
        brief: '',
      };

      render(<ChallengePreview challenge={challengeWithEmptyBrief} />);

      // Should still render without error
      expect(screen.getByText('Dashboard Analytics')).toBeInTheDocument();
    });

    it('should handle brief with only HTML tags (no text content)', () => {
      const challengeWithEmptyHtml: Challenge = {
        ...mockChallenge,
        brief: '<p></p><div></div>',
      };

      render(<ChallengePreview challenge={challengeWithEmptyHtml} />);

      // Should render without error
      expect(screen.getByText('Dashboard Analytics')).toBeInTheDocument();
    });

    it('should handle brief with special characters', () => {
      const challengeWithSpecialChars: Challenge = {
        ...mockChallenge,
        brief: '<p>Design &amp; develop a dashboard &lt;test&gt; with "quotes".</p>',
      };

      render(<ChallengePreview challenge={challengeWithSpecialChars} />);

      // Note: &amp; etc. are HTML entities, they should be preserved as-is after tag stripping
      // Use getAllByText since "Design" may appear in both title and brief
      const designElements = screen.getAllByText(/Design/);
      expect(designElements.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Badge Display Tests
  // ===========================================================================

  describe('badge display', () => {
    it('should display challenge number badge with neutral variant', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      const numberBadge = screen.getAllByTestId('badge').find(
        (badge) => badge.textContent?.includes('#12')
      );
      expect(numberBadge).toHaveAttribute('data-variant', 'neutral');
    });

    it('should display skill badges', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      const badges = screen.getAllByTestId('badge');
      // Should have challenge number + 3 skill badges
      expect(badges.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ===========================================================================
  // Layout Tests
  // ===========================================================================

  describe('layout', () => {
    it('should render within a bordered container', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      const container = screen.getByText('Challenge Preview').closest('div');
      expect(container).toHaveClass('border');
    });

    it('should have scrollable description area', () => {
      render(<ChallengePreview challenge={mockChallenge} />);

      // Find the description container with max-height and overflow
      const descriptionContainer = screen.getByText(/Design a comprehensive dashboard/).closest('div');
      expect(descriptionContainer).toHaveClass('max-h-48');
      expect(descriptionContainer).toHaveClass('overflow-y-auto');
    });
  });
});
