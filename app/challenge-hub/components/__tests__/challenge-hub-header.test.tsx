/**
 * Unit Tests for ChallengeHubHeader Component
 */

import { render, screen } from '@testing-library/react';
import { ChallengeHubHeader } from '../challenge-hub-header';

// Mock the JoinSprintButton component
jest.mock('../join-sprint-button', () => ({
  JoinSprintButton: ({ sprintId }: { sprintId: string }) => (
    <button data-testid="join-sprint-button">Join Sprint {sprintId}</button>
  ),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock Subframe Button component
jest.mock('@/app/ui/components/Button', () => ({
  Button: ({ children, onClick, variant }: { children: React.ReactNode; onClick?: () => void; variant?: string }) => (
    <button onClick={onClick} data-variant={variant}>{children}</button>
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

describe('ChallengeHubHeader', () => {
  describe('rendering', () => {
    it('should render page title', () => {
      render(<ChallengeHubHeader />);

      expect(screen.getByText('Design Challenge Hub')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(<ChallengeHubHeader />);

      expect(
        screen.getByText(/Join biweekly design challenges/i)
      ).toBeInTheDocument();
    });

    it('should render My Submissions button', () => {
      render(<ChallengeHubHeader />);

      expect(screen.getByText('My Submissions')).toBeInTheDocument();
      // Link wraps the button
      const link = screen.getByText('My Submissions').closest('a');
      expect(link).toHaveAttribute('href', '/submissions');
    });
  });

  describe('admin controls', () => {
    it('should show Sprint Control button for admins', () => {
      render(<ChallengeHubHeader isAdmin={true} />);

      expect(screen.getByText('Sprint Control')).toBeInTheDocument();
      const link = screen.getByText('Sprint Control').closest('a');
      expect(link).toHaveAttribute('href', '/admin/sprints');
    });

    it('should not show Sprint Control button for non-admins', () => {
      render(<ChallengeHubHeader isAdmin={false} />);

      expect(screen.queryByText('Sprint Control')).not.toBeInTheDocument();
    });

    it('should not show Sprint Control button by default', () => {
      render(<ChallengeHubHeader />);

      expect(screen.queryByText('Sprint Control')).not.toBeInTheDocument();
    });
  });

  describe('join sprint button', () => {
    it('should show JoinSprintButton when not participant and sprint is active', () => {
      render(
        <ChallengeHubHeader
          isParticipant={false}
          activeSprintId="sprint-123"
        />
      );

      expect(screen.getByTestId('join-sprint-button')).toBeInTheDocument();
    });

    it('should not show JoinSprintButton when already a participant', () => {
      render(
        <ChallengeHubHeader
          isParticipant={true}
          activeSprintId="sprint-123"
        />
      );

      expect(screen.queryByTestId('join-sprint-button')).not.toBeInTheDocument();
    });

    it('should not show JoinSprintButton when no active sprint', () => {
      render(
        <ChallengeHubHeader
          isParticipant={false}
          activeSprintId={undefined}
        />
      );

      expect(screen.queryByTestId('join-sprint-button')).not.toBeInTheDocument();
    });

    it('should not show JoinSprintButton by default', () => {
      render(<ChallengeHubHeader />);

      expect(screen.queryByTestId('join-sprint-button')).not.toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ChallengeHubHeader className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('combined scenarios', () => {
    it('should render all elements for admin not participating', () => {
      render(
        <ChallengeHubHeader
          isAdmin={true}
          isParticipant={false}
          activeSprintId="sprint-456"
        />
      );

      expect(screen.getByText('Design Challenge Hub')).toBeInTheDocument();
      expect(screen.getByText('My Submissions')).toBeInTheDocument();
      expect(screen.getByText('Sprint Control')).toBeInTheDocument();
      expect(screen.getByTestId('join-sprint-button')).toBeInTheDocument();
    });

    it('should render correctly for admin already participating', () => {
      render(
        <ChallengeHubHeader
          isAdmin={true}
          isParticipant={true}
          activeSprintId="sprint-456"
        />
      );

      expect(screen.getByText('Design Challenge Hub')).toBeInTheDocument();
      expect(screen.getByText('My Submissions')).toBeInTheDocument();
      expect(screen.getByText('Sprint Control')).toBeInTheDocument();
      expect(screen.queryByTestId('join-sprint-button')).not.toBeInTheDocument();
    });
  });
});
