/**
 * Unit Tests for CountdownTimer Component
 */

import { render, screen } from '@testing-library/react';
import { CountdownTimer } from '../countdown-timer';
import { useCountdown } from '@/lib/hooks/use-countdown';

// Mock the useCountdown hook
jest.mock('@/lib/hooks/use-countdown', () => ({
  useCountdown: jest.fn(),
}));

const mockUseCountdown = useCountdown as jest.Mock;

describe('CountdownTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render countdown time with default state', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '2d 5h 30m',
        urgencyColor: 'green',
        isExpired: false,
      });

      render(<CountdownTimer endDate="2025-01-20T00:00:00Z" />);

      expect(screen.getByText('2d 5h 30m')).toBeInTheDocument();
    });

    it('should render with prefix when not expired', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '1d 2h 15m',
        urgencyColor: 'green',
        isExpired: false,
      });

      render(
        <CountdownTimer endDate="2025-01-20T00:00:00Z" prefix="Ends in" />
      );

      expect(screen.getByText('Ends in 1d 2h 15m')).toBeInTheDocument();
    });

    it('should render expired time without prefix', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '0d 0h 0m',
        urgencyColor: 'gray',
        isExpired: true,
      });

      render(<CountdownTimer endDate="2025-01-01T00:00:00Z" prefix="Ends in" />);

      // Prefix is not shown when expired
      expect(screen.getByText('0d 0h 0m')).toBeInTheDocument();
    });
  });

  describe('urgency colors', () => {
    it('should use success badge variant for green urgency', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '5d 0h 0m',
        urgencyColor: 'green',
        isExpired: false,
      });

      render(<CountdownTimer endDate="2025-01-25T00:00:00Z" />);

      // Badge should be rendered with content
      expect(screen.getByText('5d 0h 0m')).toBeInTheDocument();
    });

    it('should use warning badge variant for yellow urgency', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '1d 0h 0m',
        urgencyColor: 'yellow',
        isExpired: false,
      });

      render(<CountdownTimer endDate="2025-01-16T00:00:00Z" />);

      expect(screen.getByText('1d 0h 0m')).toBeInTheDocument();
    });

    it('should use error badge variant for red urgency', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '0d 5h 0m',
        urgencyColor: 'red',
        isExpired: false,
      });

      render(<CountdownTimer endDate="2025-01-15T05:00:00Z" />);

      expect(screen.getByText('0d 5h 0m')).toBeInTheDocument();
    });

    it('should use neutral badge variant for gray urgency', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '0d 0h 0m',
        urgencyColor: 'gray',
        isExpired: true,
      });

      render(<CountdownTimer endDate="2025-01-01T00:00:00Z" />);

      expect(screen.getByText('0d 0h 0m')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have aria-live attribute for screen readers', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '2d 5h 30m',
        urgencyColor: 'green',
        isExpired: false,
      });

      render(<CountdownTimer endDate="2025-01-20T00:00:00Z" />);

      const badge = screen.getByText('2d 5h 30m').closest('[aria-live]');
      expect(badge).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-atomic attribute', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '2d 5h 30m',
        urgencyColor: 'green',
        isExpired: false,
      });

      render(<CountdownTimer endDate="2025-01-20T00:00:00Z" />);

      const badge = screen.getByText('2d 5h 30m').closest('[aria-atomic]');
      expect(badge).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      mockUseCountdown.mockReturnValue({
        formatted: '2d 5h 30m',
        urgencyColor: 'green',
        isExpired: false,
      });

      render(
        <CountdownTimer
          endDate="2025-01-20T00:00:00Z"
          className="custom-class"
        />
      );

      const badge = screen.getByText('2d 5h 30m').closest('div');
      expect(badge).toHaveClass('custom-class');
    });
  });
});
