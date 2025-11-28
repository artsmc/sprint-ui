/**
 * ChallengeSelector Component Tests
 *
 * Unit tests for the ChallengeSelector dropdown component.
 * Tests cover Gherkin Scenarios: 3 (Random selection), 16 (Loading state),
 * 14 (Error state), 21 (No available challenges)
 *
 * @module __tests__/app/sprint-control/components/start-next-sprint/challenge-selector.test
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChallengeSelector } from '@/app/sprint-control/components/start-next-sprint/challenge-selector';
import type { Challenge } from '@/lib/types';

// Mock Subframe components
jest.mock('@/app/ui/components/Select', () => ({
  Select: Object.assign(
    ({ children, value, onValueChange, disabled, placeholder, ...props }: any) => (
      <div data-testid="select-wrapper" {...props}>
        <select
          data-testid="select"
          value={value || ''}
          onChange={(e) => onValueChange?.(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
      </div>
    ),
    {
      Item: ({ value, children }: any) => (
        <option value={value}>{children}</option>
      ),
    }
  ),
}));

jest.mock('@/app/ui/components/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// =============================================================================
// Test Data
// =============================================================================

const mockChallenges: Challenge[] = [
  {
    id: 'challenge_001',
    challenge_number: 1,
    title: 'Dashboard Analytics',
    brief: '<p>Design a dashboard...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
    collectionId: 'challenges',
    collectionName: 'challenges',
  },
  {
    id: 'challenge_002',
    challenge_number: 2,
    title: 'E-commerce Checkout',
    brief: '<p>Design a checkout flow...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
    collectionId: 'challenges',
    collectionName: 'challenges',
  },
  {
    id: 'challenge_003',
    challenge_number: 12,
    title: 'Mobile Banking App',
    brief: '<p>Design a banking app...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
    collectionId: 'challenges',
    collectionName: 'challenges',
  },
];

// =============================================================================
// Tests: ChallengeSelector Component
// =============================================================================

describe('ChallengeSelector', () => {
  const defaultProps = {
    challenges: mockChallenges,
    value: undefined,
    onChange: jest.fn(),
    onRandomSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // Normal State Tests
  // ===========================================================================

  describe('normal state (with challenges)', () => {
    it('should render the select dropdown', () => {
      render(<ChallengeSelector {...defaultProps} />);

      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should display all challenge options', () => {
      render(<ChallengeSelector {...defaultProps} />);

      expect(screen.getByText(/Challenge #1: Dashboard Analytics/)).toBeInTheDocument();
      expect(screen.getByText(/Challenge #2: E-commerce Checkout/)).toBeInTheDocument();
      expect(screen.getByText(/Challenge #12: Mobile Banking App/)).toBeInTheDocument();
    });

    it('should include the "Random" option', () => {
      render(<ChallengeSelector {...defaultProps} />);

      expect(screen.getByText(/Random/)).toBeInTheDocument();
    });

    it('should display placeholder when no value selected', () => {
      render(<ChallengeSelector {...defaultProps} />);

      expect(screen.getByText('Select a challenge')).toBeInTheDocument();
    });

    it('should call onChange when a challenge is selected', () => {
      const onChange = jest.fn();
      render(<ChallengeSelector {...defaultProps} onChange={onChange} />);

      fireEvent.change(screen.getByTestId('select'), {
        target: { value: 'challenge_002' },
      });

      expect(onChange).toHaveBeenCalledWith('challenge_002');
    });

    /**
     * Scenario 3: Random challenge selection
     * When I select "Random" from the challenge dropdown
     * Then the system randomly selects one of the available challenges
     */
    it('should call onRandomSelect when "Random" option is selected', () => {
      const onRandomSelect = jest.fn();
      render(<ChallengeSelector {...defaultProps} onRandomSelect={onRandomSelect} />);

      fireEvent.change(screen.getByTestId('select'), {
        target: { value: 'random' },
      });

      expect(onRandomSelect).toHaveBeenCalled();
    });

    it('should show the currently selected value', () => {
      render(<ChallengeSelector {...defaultProps} value="challenge_001" />);

      const select = screen.getByTestId('select') as HTMLSelectElement;
      expect(select.value).toBe('challenge_001');
    });
  });

  // ===========================================================================
  // Loading State Tests
  // ===========================================================================

  describe('loading state', () => {
    /**
     * Scenario 16: Loading state during challenge fetch
     * When the available challenges are being fetched
     * Then the challenge dropdown displays a loading spinner
     * And the dropdown is disabled
     */
    it('should display loading placeholder', () => {
      render(<ChallengeSelector {...defaultProps} isLoading={true} />);

      expect(screen.getByText('Loading challenges...')).toBeInTheDocument();
    });

    it('should disable the select while loading', () => {
      render(<ChallengeSelector {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId('select')).toBeDisabled();
    });

    it('should not call onChange while loading', () => {
      const onChange = jest.fn();
      render(<ChallengeSelector {...defaultProps} isLoading={true} onChange={onChange} />);

      fireEvent.change(screen.getByTestId('select'), {
        target: { value: 'challenge_001' },
      });

      // Should not call onChange because it's disabled
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Error State Tests
  // ===========================================================================

  describe('error state', () => {
    /**
     * Scenario 14: Handle API error during challenge fetch
     * Given the PocketBase API is unavailable
     * Then the challenge dropdown displays: "Failed to load challenges"
     * And a retry button is displayed
     */
    it('should display error message', () => {
      render(
        <ChallengeSelector
          {...defaultProps}
          error="Failed to load challenges. Please try again."
        />
      );

      expect(screen.getByText('Failed to load challenges. Please try again.')).toBeInTheDocument();
    });

    it('should disable the select in error state', () => {
      render(<ChallengeSelector {...defaultProps} error="Error message" />);

      expect(screen.getByTestId('select')).toBeDisabled();
    });

    it('should display retry button when onRetry is provided', () => {
      const onRetry = jest.fn();
      render(
        <ChallengeSelector
          {...defaultProps}
          error="Error message"
          onRetry={onRetry}
        />
      );

      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const onRetry = jest.fn();
      render(
        <ChallengeSelector
          {...defaultProps}
          error="Error message"
          onRetry={onRetry}
        />
      );

      fireEvent.click(screen.getByText('Retry'));

      expect(onRetry).toHaveBeenCalled();
    });

    it('should not display retry button when onRetry is not provided', () => {
      render(
        <ChallengeSelector
          {...defaultProps}
          error="Error message"
          onRetry={undefined}
        />
      );

      expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Empty State Tests
  // ===========================================================================

  describe('empty state (no challenges)', () => {
    /**
     * Scenario 21: No available challenges in current year
     * Given all 100 challenges have been used in 2025
     * Then the challenge dropdown displays: "No available challenges for this year"
     * And a message displays about when new challenges will be available
     */
    it('should display "No available challenges" when challenges array is empty', () => {
      render(<ChallengeSelector {...defaultProps} challenges={[]} />);

      expect(screen.getByText('No available challenges for this year')).toBeInTheDocument();
    });

    it('should display message about when challenges will be available', () => {
      render(<ChallengeSelector {...defaultProps} challenges={[]} />);

      expect(
        screen.getByText(/All challenges have been used this year/)
      ).toBeInTheDocument();
      expect(screen.getByText(/January 1/)).toBeInTheDocument();
    });

    it('should display "No available challenges" when challenges is undefined', () => {
      render(<ChallengeSelector {...defaultProps} challenges={undefined} />);

      expect(screen.getByText('No available challenges for this year')).toBeInTheDocument();
    });

    it('should disable the select when no challenges are available', () => {
      render(<ChallengeSelector {...defaultProps} challenges={[]} />);

      expect(screen.getByTestId('select')).toBeDisabled();
    });
  });

  // ===========================================================================
  // Display Format Tests
  // ===========================================================================

  describe('challenge display format', () => {
    it('should format challenges as "Challenge #N: Title"', () => {
      render(<ChallengeSelector {...defaultProps} />);

      expect(screen.getByText('Challenge #1: Dashboard Analytics')).toBeInTheDocument();
      expect(screen.getByText('Challenge #12: Mobile Banking App')).toBeInTheDocument();
    });

    it('should preserve challenge number (not use array index)', () => {
      const challengesWithGaps: Challenge[] = [
        { ...mockChallenges[0], challenge_number: 5, id: 'c5' },
        { ...mockChallenges[1], challenge_number: 42, id: 'c42' },
        { ...mockChallenges[2], challenge_number: 100, id: 'c100' },
      ];

      render(<ChallengeSelector {...defaultProps} challenges={challengesWithGaps} />);

      expect(screen.getByText(/Challenge #5/)).toBeInTheDocument();
      expect(screen.getByText(/Challenge #42/)).toBeInTheDocument();
      expect(screen.getByText(/Challenge #100/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================

  describe('accessibility', () => {
    it('should use challenge id as option value', () => {
      render(<ChallengeSelector {...defaultProps} />);

      const options = screen.getAllByRole('option');
      // Find the challenge options (excluding placeholder and random)
      const challengeOptions = options.filter(
        (opt) => !['', 'random', 'Select a challenge', 'loading', 'none', 'error'].includes(opt.getAttribute('value') || '')
      );

      expect(challengeOptions).toHaveLength(3);
    });

    it('should have a placeholder option', () => {
      render(<ChallengeSelector {...defaultProps} />);

      expect(screen.getByText('Select a challenge')).toBeInTheDocument();
    });
  });
});
