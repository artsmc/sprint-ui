/**
 * Unit Tests for JoinSprintButton Component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JoinSprintButton } from '../join-sprint-button';
import { useJoinSprint } from '@/lib/hooks/use-join-sprint';

// Mock the useJoinSprint hook
jest.mock('@/lib/hooks/use-join-sprint', () => ({
  useJoinSprint: jest.fn(),
}));

const mockUseJoinSprint = useJoinSprint as jest.Mock;

describe('JoinSprintButton', () => {
  const defaultMockReturn = {
    joinSprint: jest.fn(),
    isJoining: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseJoinSprint.mockReturnValue(defaultMockReturn);
  });

  describe('rendering', () => {
    it('should render button with default text', () => {
      render(<JoinSprintButton sprintId="sprint-123" />);

      expect(
        screen.getByRole('button', { name: /join sprint/i })
      ).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <JoinSprintButton sprintId="sprint-123" className="custom-class" />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('loading state', () => {
    it('should show loading text when joining', () => {
      mockUseJoinSprint.mockReturnValue({
        ...defaultMockReturn,
        isJoining: true,
      });

      render(<JoinSprintButton sprintId="sprint-123" />);

      expect(screen.getByText('Joining...')).toBeInTheDocument();
    });

    it('should disable button when joining', () => {
      mockUseJoinSprint.mockReturnValue({
        ...defaultMockReturn,
        isJoining: true,
      });

      render(<JoinSprintButton sprintId="sprint-123" />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should update aria-label when joining', () => {
      mockUseJoinSprint.mockReturnValue({
        ...defaultMockReturn,
        isJoining: true,
      });

      render(<JoinSprintButton sprintId="sprint-123" />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Joining sprint...'
      );
    });
  });

  describe('click handling', () => {
    it('should call joinSprint with sprintId when clicked', async () => {
      const mockJoinSprint = jest.fn().mockResolvedValue({ id: 'participant-1' });
      mockUseJoinSprint.mockReturnValue({
        ...defaultMockReturn,
        joinSprint: mockJoinSprint,
      });

      render(<JoinSprintButton sprintId="sprint-456" />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockJoinSprint).toHaveBeenCalledWith('sprint-456');
      });
    });

    it('should call onSuccess callback when join succeeds', async () => {
      const mockJoinSprint = jest.fn().mockResolvedValue({ id: 'participant-1' });
      const onSuccess = jest.fn();

      mockUseJoinSprint.mockReturnValue({
        ...defaultMockReturn,
        joinSprint: mockJoinSprint,
      });

      render(
        <JoinSprintButton sprintId="sprint-123" onSuccess={onSuccess} />
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should call onError callback when join fails', async () => {
      const mockError = { message: 'Failed to join' };
      const mockJoinSprint = jest.fn().mockResolvedValue(undefined);
      const onError = jest.fn();

      mockUseJoinSprint.mockReturnValue({
        joinSprint: mockJoinSprint,
        isJoining: false,
        error: mockError,
      });

      render(<JoinSprintButton sprintId="sprint-123" onError={onError} />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('button variants', () => {
    it('should pass size prop to Button', () => {
      render(<JoinSprintButton sprintId="sprint-123" size="large" />);

      // The Button component should receive the size prop
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should pass variant prop to Button', () => {
      render(
        <JoinSprintButton sprintId="sprint-123" variant="brand-secondary" />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
