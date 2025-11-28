/**
 * Unit Tests for Challenge Hub Loading State
 */

import { render, screen } from '@testing-library/react';
import ChallengeHubLoading from '../loading';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) =>
    args
      .filter(Boolean)
      .flat()
      .filter((x) => typeof x === 'string')
      .join(' '),
}));

describe('ChallengeHubLoading', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ChallengeHubLoading />);
      expect(container).toBeInTheDocument();
    });

    it('should render container with correct structure', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Should have main container
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('container');
    });
  });

  describe('skeleton elements', () => {
    it('should render header skeleton', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Header skeleton should have title placeholder (h-9 for title)
      const titleSkeleton = container.querySelector('.h-9');
      expect(titleSkeleton).toBeInTheDocument();
    });

    it('should render active challenge skeleton', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Should have card-like elements with rounded-lg and border
      const cards = container.querySelectorAll('.rounded-lg.border');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should render progress tracker skeleton with task items', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Progress tracker has 5 task item skeletons
      // Each has a checkbox skeleton (h-5 w-5)
      const checkboxSkeletons = container.querySelectorAll('.h-5.w-5');
      expect(checkboxSkeletons.length).toBeGreaterThanOrEqual(5);
    });

    it('should render profile card skeleton with avatar', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Profile card has a circular avatar skeleton (rounded-full)
      const avatarSkeletons = container.querySelectorAll('.rounded-full');
      expect(avatarSkeletons.length).toBeGreaterThan(0);
    });

    it('should render skills section skeleton', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Skills section has progress bars (h-2 w-full rounded-full)
      const progressBars = container.querySelectorAll('.h-2.w-full.rounded-full');
      expect(progressBars.length).toBeGreaterThanOrEqual(2);
    });

    it('should render highlights section skeleton', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Highlights section has grid
      const grids = container.querySelectorAll('.grid');
      expect(grids.length).toBeGreaterThan(0);
    });
  });

  describe('animation', () => {
    it('should have animate-pulse class on skeleton elements', () => {
      const { container } = render(<ChallengeHubLoading />);

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  describe('responsive layout', () => {
    it('should have two-column grid for profile and skills', () => {
      const { container } = render(<ChallengeHubLoading />);

      // Should have lg:grid-cols-2 for responsive layout
      const twoColGrid = container.querySelector('.lg\\:grid-cols-2');
      expect(twoColGrid).toBeInTheDocument();
    });
  });
});
