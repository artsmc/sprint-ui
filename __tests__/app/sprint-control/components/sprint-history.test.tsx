/**
 * SprintHistory Component Tests
 *
 * Unit tests for the SprintHistory component.
 * Tests cover data display, loading states, error states, empty states, and filtering.
 *
 * @module __tests__/app/sprint-control/components/sprint-history.test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SprintHistory } from '@/app/sprint-control/components/sprint-history';
import * as hooksModule from '@/lib/hooks';
import type { ListResult, SprintWithRelations } from '@/lib/types';

// Mock the hooks module
jest.mock('@/lib/hooks', () => ({
  __esModule: true,
  useSprintHistory: jest.fn(),
}));

// Mock pocketbase
jest.mock('pocketbase', () => {
  return jest.fn().mockImplementation(() => ({
    collection: jest.fn(),
    authStore: { token: '', model: null, isValid: false },
  }));
});

jest.mock('@/lib/pocketbase', () => ({
  __esModule: true,
  default: {
    collection: jest.fn(),
    authStore: { token: '', model: null, isValid: false },
  },
}));

jest.mock('@/env', () => ({
  __esModule: true,
  env: {
    NEXT_PUBLIC_POCKETBASE_URL: 'http://localhost:8090',
  },
}));

// Mock Subframe components
jest.mock('@/ui/components/Button', () => ({
  Button: ({ children, onClick, iconRight, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/ui/components/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock('@/ui/components/Table', () => ({
  Table: ({ children, header }: any) => (
    <table data-testid="table">
      <thead>{header}</thead>
      <tbody>{children}</tbody>
    </table>
  ),
  HeaderRow: ({ children }: any) => <tr>{children}</tr>,
  HeaderCell: ({ children }: any) => <th>{children}</th>,
  Row: ({ children }: any) => <tr data-testid="table-row">{children}</tr>,
  Cell: ({ children }: any) => <td>{children}</td>,
}));

jest.mock('@/ui/components/DropdownMenu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownItem: ({ children, onClick }: any) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
}));

// Mock Subframe core
jest.mock('@subframe/core', () => ({
  FeatherChevronDown: () => <span>▼</span>,
  DropdownMenu: {
    Root: ({ children }: any) => <div>{children}</div>,
    Trigger: ({ children, asChild }: any) => <div>{children}</div>,
    Portal: ({ children }: any) => <div>{children}</div>,
    Content: ({ children, asChild }: any) => <div>{children}</div>,
  },
}));

// Add Table subcomponents to mock
Object.assign(jest.requireMock('@/ui/components/Table').Table, {
  HeaderRow: jest.requireMock('@/ui/components/Table').HeaderRow,
  HeaderCell: jest.requireMock('@/ui/components/Table').HeaderCell,
  Row: jest.requireMock('@/ui/components/Table').Row,
  Cell: jest.requireMock('@/ui/components/Table').Cell,
});

// =============================================================================
// Test Setup
// =============================================================================

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockSprintHistory: ListResult<SprintWithRelations> = {
  page: 1,
  perPage: 20,
  totalItems: 2,
  totalPages: 1,
  items: [
    {
      id: 'sprint123',
      sprint_number: 42,
      name: 'Sprint 42',
      challenge_id: 'challenge42',
      status: 'completed',
      start_at: '2024-06-01T00:00:00Z',
      end_at: '2024-06-14T00:00:00Z',
      voting_end_at: null,
      retro_day: null,
      duration_days: 14,
      started_by_id: 'user1',
      ended_by_id: 'user2',
      created: '2024-06-01T00:00:00Z',
      updated: '2024-06-14T00:00:00Z',
      expand: {
        challenge_id: {
          id: 'challenge42',
          challenge_number: 42,
          title: 'To-do List',
          brief: '<p>Design a to-do list app</p>',
          created: '2024-01-01T00:00:00Z',
          updated: '2024-01-01T00:00:00Z',
        },
        started_by_id: {
          id: 'user1',
          name: 'Emily Designer',
          email: 'emily@example.com',
          avatar: '',
          role: 'designer',
          created: '2024-01-01T00:00:00Z',
          updated: '2024-01-01T00:00:00Z',
          verified: true,
        },
        ended_by_id: {
          id: 'user2',
          name: 'Mike Admin',
          email: 'mike@example.com',
          avatar: '',
          role: 'admin',
          created: '2024-01-01T00:00:00Z',
          updated: '2024-01-01T00:00:00Z',
          verified: true,
        },
      },
    },
    {
      id: 'sprint124',
      sprint_number: 41,
      name: 'Sprint 41',
      challenge_id: 'challenge41',
      status: 'cancelled',
      start_at: '2024-05-15T00:00:00Z',
      end_at: '2024-05-29T00:00:00Z',
      voting_end_at: null,
      retro_day: null,
      duration_days: 14,
      started_by_id: 'user1',
      ended_by_id: 'user2',
      created: '2024-05-15T00:00:00Z',
      updated: '2024-05-29T00:00:00Z',
      expand: {
        challenge_id: {
          id: 'challenge41',
          challenge_number: 41,
          title: 'Workout Tracker',
          brief: '<p>Design a workout tracker</p>',
          created: '2024-01-01T00:00:00Z',
          updated: '2024-01-01T00:00:00Z',
        },
        started_by_id: {
          id: 'user1',
          name: 'Emily Designer',
          email: 'emily@example.com',
          avatar: '',
          role: 'designer',
          created: '2024-01-01T00:00:00Z',
          updated: '2024-01-01T00:00:00Z',
          verified: true,
        },
        ended_by_id: {
          id: 'user2',
          name: 'Mike Admin',
          email: 'mike@example.com',
          avatar: '',
          role: 'admin',
          created: '2024-01-01T00:00:00Z',
          updated: '2024-01-01T00:00:00Z',
          verified: true,
        },
      },
    },
  ],
};

// =============================================================================
// Tests
// =============================================================================

describe('SprintHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading message when data is being fetched', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('Sprint History')).toBeInTheDocument();
      expect(screen.getByText('Loading sprint history...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: { message: 'Failed to load data' },
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('Sprint History')).toBeInTheDocument();
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    it('should display generic error message when error has no message', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(
        screen.getByText('Failed to load sprint history')
      ).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no sprints exist', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: { items: [], page: 1, perPage: 20, totalItems: 0, totalPages: 0 },
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('Sprint History')).toBeInTheDocument();
      expect(screen.getByText('No sprints found')).toBeInTheDocument();
    });

    it('should display filtered empty message when filter returns no results', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: { items: [], page: 1, perPage: 20, totalItems: 0, totalPages: 0 },
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: 'completed',
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('No completed sprints found')).toBeInTheDocument();
    });
  });

  describe('Success State with Data', () => {
    it('should display sprint history table with data', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: mockSprintHistory,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('Sprint History')).toBeInTheDocument();
      expect(screen.getByTestId('table')).toBeInTheDocument();

      // Check for table headers
      expect(screen.getByText('Sprint')).toBeInTheDocument();
      expect(screen.getByText('Challenge')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Date Range')).toBeInTheDocument();
      expect(screen.getByText('Managed By')).toBeInTheDocument();

      // Check for sprint data
      expect(screen.getByText('Sprint 42')).toBeInTheDocument();
      expect(screen.getByText('Challenge #42 - To-do List')).toBeInTheDocument();
      expect(screen.getByText('Sprint 41')).toBeInTheDocument();
      expect(screen.getByText('Challenge #41 - Workout Tracker')).toBeInTheDocument();
    });

    it('should display sprint status badges with correct variants', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: mockSprintHistory,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      const badges = screen.getAllByTestId('badge');
      expect(badges).toHaveLength(2);
      expect(badges[0]).toHaveAttribute('data-variant', 'neutral'); // completed
      expect(badges[0]).toHaveTextContent('Completed');
      expect(badges[1]).toHaveAttribute('data-variant', 'warning'); // cancelled
      expect(badges[1]).toHaveTextContent('Cancelled');
    });

    it('should display formatted date ranges', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: mockSprintHistory,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      // Dates should be formatted as "Jun 1 - Jun 14"
      expect(screen.getByText(/Jun 1 - Jun 14/i)).toBeInTheDocument();
      expect(screen.getByText(/May 15 - May 29/i)).toBeInTheDocument();
    });

    it('should display who started and ended each sprint', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: mockSprintHistory,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(
        screen.getAllByText(/Started by Emily Designer - Ended by Mike Admin/i)
      ).toHaveLength(2);
    });

    it('should render correct number of table rows', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: mockSprintHistory,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      const rows = screen.getAllByTestId('table-row');
      expect(rows).toHaveLength(2);
    });
  });

  describe('Filtering', () => {
    it('should display current filter in button text', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: mockSprintHistory,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: 'completed',
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should display "Filter" when no filter is active', () => {
      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: mockSprintHistory,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      const filterButtons = screen.getAllByText('Filter');
      expect(filterButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Missing Data Handling', () => {
    it('should handle sprints without expanded challenge data', () => {
      const sprintWithoutChallenge: ListResult<SprintWithRelations> = {
        ...mockSprintHistory,
        items: [
          {
            ...mockSprintHistory.items[0],
            expand: {
              started_by_id: mockSprintHistory.items[0].expand!.started_by_id,
              ended_by_id: mockSprintHistory.items[0].expand!.ended_by_id,
            },
          },
        ],
      };

      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: sprintWithoutChallenge,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle sprints without started_by or ended_by users', () => {
      const sprintWithoutUsers: ListResult<SprintWithRelations> = {
        ...mockSprintHistory,
        items: [
          {
            ...mockSprintHistory.items[0],
            expand: {
              challenge_id: mockSprintHistory.items[0].expand!.challenge_id,
            },
          },
        ],
      };

      (hooksModule.useSprintHistory as jest.Mock).mockReturnValue({
        data: sprintWithoutUsers,
        isLoading: false,
        isError: false,
        error: null,
        statusFilter: undefined,
        setStatusFilter: jest.fn(),
      });

      render(<SprintHistory />, { wrapper: createWrapper() });

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });
});
