/**
 * Unit Tests for SprintProgressTracker Component
 */

import { render, screen } from '@testing-library/react';
import { SprintProgressTracker, type TaskItem } from '../sprint-progress-tracker';

describe('SprintProgressTracker', () => {
  const mockTasks: TaskItem[] = [
    { id: '1', name: 'Submit design', xp: 50, completed: true },
    { id: '2', name: 'Give feedback', xp: 25, completed: false },
    { id: '3', name: 'Vote on designs', xp: 25, completed: false },
  ];

  describe('rendering', () => {
    it('should render title', () => {
      render(
        <SprintProgressTracker tasks={mockTasks} totalXP={50} maxXP={100} />
      );

      expect(screen.getByText('Sprint Progress')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(
        <SprintProgressTracker
          tasks={mockTasks}
          totalXP={50}
          maxXP={100}
          title="My Progress"
        />
      );

      expect(screen.getByText('My Progress')).toBeInTheDocument();
    });

    it('should render all tasks', () => {
      render(
        <SprintProgressTracker tasks={mockTasks} totalXP={50} maxXP={100} />
      );

      expect(screen.getByText('Submit design')).toBeInTheDocument();
      expect(screen.getByText('Give feedback')).toBeInTheDocument();
      expect(screen.getByText('Vote on designs')).toBeInTheDocument();
    });

    it('should show XP rewards for each task', () => {
      render(
        <SprintProgressTracker tasks={mockTasks} totalXP={50} maxXP={100} />
      );

      expect(screen.getByText('+50 XP')).toBeInTheDocument();
      expect(screen.getAllByText('+25 XP')).toHaveLength(2);
    });
  });

  describe('progress display', () => {
    it('should display task completion count', () => {
      render(
        <SprintProgressTracker tasks={mockTasks} totalXP={50} maxXP={100} />
      );

      // 1 of 3 tasks completed
      expect(screen.getByText('1/3 tasks completed')).toBeInTheDocument();
    });

    it('should display XP progress', () => {
      render(
        <SprintProgressTracker tasks={mockTasks} totalXP={50} maxXP={100} />
      );

      expect(screen.getByText('50/100 XP')).toBeInTheDocument();
    });

    it('should show 0 XP when no tasks completed', () => {
      const incompleteTasks = mockTasks.map((t) => ({ ...t, completed: false }));
      render(
        <SprintProgressTracker tasks={incompleteTasks} totalXP={0} maxXP={100} />
      );

      expect(screen.getByText('0/100 XP')).toBeInTheDocument();
    });

    it('should show full XP when all tasks completed', () => {
      const completedTasks = mockTasks.map((t) => ({ ...t, completed: true }));
      render(
        <SprintProgressTracker tasks={completedTasks} totalXP={100} maxXP={100} />
      );

      expect(screen.getByText('100/100 XP')).toBeInTheDocument();
    });
  });

  describe('completion celebration', () => {
    it('should show celebration when all tasks completed', () => {
      const completedTasks = mockTasks.map((t) => ({ ...t, completed: true }));
      render(
        <SprintProgressTracker
          tasks={completedTasks}
          totalXP={100}
          maxXP={100}
        />
      );

      expect(screen.getByText('All tasks complete! Great work!')).toBeInTheDocument();
    });

    it('should not show celebration when tasks incomplete', () => {
      render(
        <SprintProgressTracker tasks={mockTasks} totalXP={50} maxXP={100} />
      );

      expect(
        screen.queryByText('All tasks complete! Great work!')
      ).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should handle empty tasks array', () => {
      render(<SprintProgressTracker tasks={[]} totalXP={0} maxXP={0} />);

      expect(screen.getByText('Sprint Progress')).toBeInTheDocument();
      expect(screen.getByText('0/0 tasks completed')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <SprintProgressTracker
          tasks={mockTasks}
          totalXP={50}
          maxXP={100}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('should have progress bar with aria-label', () => {
      render(
        <SprintProgressTracker tasks={mockTasks} totalXP={50} maxXP={100} />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should have celebration message with role status', () => {
      const completedTasks = mockTasks.map((t) => ({ ...t, completed: true }));
      render(
        <SprintProgressTracker
          tasks={completedTasks}
          totalXP={100}
          maxXP={100}
        />
      );

      const celebration = screen.getByRole('status');
      expect(celebration).toHaveAttribute('aria-live', 'polite');
    });
  });
});
