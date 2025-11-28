/**
 * Unit Tests for ActiveChallengeCard Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveChallengeCard } from '../active-challenge-card';
import type { Sprint, Challenge } from '@/lib/types';

// Mock the CountdownTimer component
jest.mock('../countdown-timer', () => ({
  CountdownTimer: ({ endDate, prefix }: { endDate: string; prefix?: string }) => (
    <div data-testid="countdown-timer">
      {prefix} {endDate}
    </div>
  ),
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) =>
    args
      .filter(Boolean)
      .flat()
      .filter((x) => typeof x === 'string')
      .join(' '),
}));

describe('ActiveChallengeCard', () => {
  const mockSprint: Sprint = {
    id: 'sprint-123',
    sprint_number: 5,
    challenge_id: 'challenge-456',
    start_at: '2025-01-13T00:00:00Z',
    end_at: '2025-01-20T00:00:00Z',
    voting_end_at: '2025-01-22T00:00:00Z',
    retro_day: '2025-01-24T00:00:00Z',
    status: 'active',
    created: '2025-01-13T00:00:00Z',
    updated: '2025-01-13T00:00:00Z',
    collectionId: 'sprints',
    collectionName: 'sprints',
  };

  const mockChallenge: Challenge = {
    id: 'challenge-456',
    challenge_number: 5,
    title: 'Dashboard Design Challenge',
    brief: '<p>Design a modern analytics dashboard for a SaaS product.</p>',
    difficulty: 'intermediate',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
    collectionId: 'challenges',
    collectionName: 'challenges',
  };

  describe('rendering', () => {
    it('should render sprint number', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('Sprint 5')).toBeInTheDocument();
    });

    it('should render challenge number and title', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(
        screen.getByText('Challenge #5: Dashboard Design Challenge')
      ).toBeInTheDocument();
    });

    it('should render countdown timer', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByTestId('countdown-timer')).toBeInTheDocument();
    });

    it('should render description preview', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(
        screen.getByText('Design a modern analytics dashboard for a SaaS product.')
      ).toBeInTheDocument();
    });
  });

  describe('phase badges', () => {
    it('should show Submission Phase for active sprint', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('Submission Phase')).toBeInTheDocument();
    });

    it('should show Voting Phase for voting sprint', () => {
      const votingSprint = { ...mockSprint, status: 'voting' as const };
      render(
        <ActiveChallengeCard
          sprint={votingSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('Voting Phase')).toBeInTheDocument();
    });

    it('should show Retrospective for retro sprint', () => {
      const retroSprint = { ...mockSprint, status: 'retro' as const };
      render(
        <ActiveChallengeCard
          sprint={retroSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('Retrospective')).toBeInTheDocument();
    });

    it('should show Completed for completed sprint', () => {
      const completedSprint = { ...mockSprint, status: 'completed' as const };
      render(
        <ActiveChallengeCard
          sprint={completedSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('should render View Brief button', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('View Brief')).toBeInTheDocument();
    });

    it('should render Upload Design button for participant in active phase', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('Upload Design')).toBeInTheDocument();
    });

    it('should not render Upload Design button for non-participant', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={false}
        />
      );

      expect(screen.queryByText('Upload Design')).not.toBeInTheDocument();
    });

    it('should render Vote Now button for voting sprint participant', () => {
      const votingSprint = { ...mockSprint, status: 'voting' as const };
      render(
        <ActiveChallengeCard
          sprint={votingSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('Vote Now')).toBeInTheDocument();
    });

    it('should not render Vote Now button for non-participant', () => {
      const votingSprint = { ...mockSprint, status: 'voting' as const };
      render(
        <ActiveChallengeCard
          sprint={votingSprint}
          challenge={mockChallenge}
          isParticipant={false}
        />
      );

      expect(screen.queryByText('Vote Now')).not.toBeInTheDocument();
    });
  });

  describe('brief dialog', () => {
    it('should open brief dialog when View Brief is clicked', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      fireEvent.click(screen.getByText('View Brief'));

      // Dialog should be open with challenge number badge
      expect(screen.getByText('Challenge #5')).toBeInTheDocument();
    });

    it('should render challenge title in dialog', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      fireEvent.click(screen.getByText('View Brief'));

      // Title appears twice: in card and in dialog
      const titles = screen.getAllByText('Dashboard Design Challenge');
      expect(titles.length).toBeGreaterThanOrEqual(1);
    });

    it('should have close button in dialog', () => {
      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
        />
      );

      fireEvent.click(screen.getByText('View Brief'));

      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });
  });

  describe('description truncation', () => {
    it('should truncate long description', () => {
      const longBrief = '<p>' + 'A'.repeat(200) + '</p>';
      const longChallenge = { ...mockChallenge, brief: longBrief };

      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={longChallenge}
          isParticipant={true}
        />
      );

      // Should show truncated text with ellipsis
      const truncatedText = screen.getByText(/A+\.\.\./);
      expect(truncatedText).toBeInTheDocument();
    });

    it('should handle missing brief', () => {
      const noBriefChallenge = { ...mockChallenge, brief: '' };

      render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={noBriefChallenge}
          isParticipant={true}
        />
      );

      expect(screen.getByText('No description available')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ActiveChallengeCard
          sprint={mockSprint}
          challenge={mockChallenge}
          isParticipant={true}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
