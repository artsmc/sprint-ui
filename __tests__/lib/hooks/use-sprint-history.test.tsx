/**
 * useSprintHistory Hook Tests
 *
 * Unit tests for the useSprintHistory custom hook.
 * Tests cover data fetching, pagination, filtering, loading states, and error handling.
 *
 * @module __tests__/lib/hooks/use-sprint-history.test
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSprintHistory } from '@/lib/hooks/use-sprint-history';
import * as sprintsApi from '@/lib/api/sprints';
import type { ListResult, SprintWithRelations } from '@/lib/types';

// Mock the API module
jest.mock('@/lib/api/sprints');

// Mock pocketbase to avoid ESM issues
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

// =============================================================================
// Test Setup
// =============================================================================

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0, // Disable retries completely
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Mock sprint history data
const mockSprintHistory: ListResult<SprintWithRelations> = {
  page: 1,
  perPage: 20,
  totalItems: 3,
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
      status: 'active',
      start_at: '2024-05-15T00:00:00Z',
      end_at: '2024-05-29T00:00:00Z',
      voting_end_at: null,
      retro_day: null,
      duration_days: 14,
      started_by_id: 'user1',
      ended_by_id: null,
      created: '2024-05-15T00:00:00Z',
      updated: '2024-05-15T00:00:00Z',
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
      },
    },
    {
      id: 'sprint125',
      sprint_number: 40,
      name: 'Sprint 40',
      challenge_id: 'challenge40',
      status: 'cancelled',
      start_at: '2024-05-01T00:00:00Z',
      end_at: '2024-05-07T00:00:00Z',
      voting_end_at: null,
      retro_day: null,
      duration_days: 7,
      started_by_id: 'user1',
      ended_by_id: 'user2',
      created: '2024-05-01T00:00:00Z',
      updated: '2024-05-07T00:00:00Z',
      expand: {
        challenge_id: {
          id: 'challenge40',
          challenge_number: 40,
          title: 'Dribbble Invite',
          brief: '<p>Design a dribbble invite</p>',
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

describe('useSprintHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Data Fetching', () => {
    it('should fetch sprint history successfully', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockResolvedValueOnce(mockSprintHistory);

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      // Initial loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isInitialLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify final state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isInitialLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toEqual(mockSprintHistory);
      expect(result.current.data?.items).toHaveLength(3);
      expect(mockGetSprintHistory).toHaveBeenCalledWith(1, 20, undefined);
    });

    it('should fetch sprint history with custom perPage', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockResolvedValueOnce(mockSprintHistory);

      renderHook(() => useSprintHistory({ perPage: 10 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockGetSprintHistory).toHaveBeenCalledWith(1, 10, undefined);
      });
    });

    it('should include expanded relations in data', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockResolvedValueOnce(mockSprintHistory);

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const firstSprint = result.current.data?.items[0];
      expect(firstSprint?.expand?.challenge_id).toBeDefined();
      expect(firstSprint?.expand?.challenge_id?.title).toBe('To-do List');
      expect(firstSprint?.expand?.started_by_id).toBeDefined();
      expect(firstSprint?.expand?.started_by_id?.name).toBe('Emily Designer');
      expect(firstSprint?.expand?.ended_by_id).toBeDefined();
      expect(firstSprint?.expand?.ended_by_id?.name).toBe('Mike Admin');
    });
  });

  describe('Status Filtering', () => {
    it('should filter by completed status', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      const completedSprints: ListResult<SprintWithRelations> = {
        ...mockSprintHistory,
        totalItems: 1,
        items: [mockSprintHistory.items[0]],
      };
      mockGetSprintHistory.mockResolvedValueOnce(completedSprints);

      const { result } = renderHook(
        () => useSprintHistory({ initialStatusFilter: 'completed' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.statusFilter).toBe('completed');
      expect(mockGetSprintHistory).toHaveBeenCalledWith(1, 20, 'completed');
      expect(result.current.data?.items).toHaveLength(1);
      expect(result.current.data?.items[0].status).toBe('completed');
    });

    it('should update filter and reset to page 1', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockResolvedValue(mockSprintHistory);

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Change status filter
      act(() => {
        result.current.setStatusFilter('active');
      });

      await waitFor(() => {
        expect(result.current.statusFilter).toBe('active');
        expect(result.current.page).toBe(1); // Should reset to page 1
      });

      expect(mockGetSprintHistory).toHaveBeenCalledWith(1, 20, 'active');
    });
  });

  describe('Pagination', () => {
    it('should handle page changes', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockResolvedValue(mockSprintHistory);

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Change page
      act(() => {
        result.current.setPage(2);
      });

      await waitFor(() => {
        expect(result.current.page).toBe(2);
      });

      expect(mockGetSprintHistory).toHaveBeenCalledWith(2, 20, undefined);
    });

    it('should start at initial page', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockResolvedValueOnce(mockSprintHistory);

      const { result } = renderHook(
        () => useSprintHistory({ initialPage: 3 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.page).toBe(3);
      expect(mockGetSprintHistory).toHaveBeenCalledWith(3, 20, undefined);
    });
  });

  describe('Error Handling', () => {
    it.skip('should handle fetch errors', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      const testError = new Error('Network error');
      mockGetSprintHistory.mockRejectedValue(testError);

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      // Wait for initial loading to complete
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 3000 }
      );

      // After loading completes, should be in error state
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('Network error');
      expect(result.current.data).toBeUndefined();
    });

    it('should handle authentication errors', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockRejectedValueOnce(
        new Error('User is not authenticated')
      );

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(
        'Please log in to view sprint history.'
      );
    });

    it('should not retry on authentication errors', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockRejectedValue(
        new Error('Please log in to view sprint history.')
      );

      renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockGetSprintHistory).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Refetch Functionality', () => {
    it('should refetch data when refetch is called', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockResolvedValue(mockSprintHistory);

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetSprintHistory).toHaveBeenCalledTimes(1);

      // Trigger refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(mockGetSprintHistory).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Loading States', () => {
    it('should show initial loading state correctly', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');
      mockGetSprintHistory.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockSprintHistory), 100)
          )
      );

      const { result } = renderHook(() => useSprintHistory(), {
        wrapper: createWrapper(),
      });

      // During initial load
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isInitialLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // After load completes
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isInitialLoading).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  });

  describe('Disabled State', () => {
    it('should not fetch when enabled is false', async () => {
      const mockGetSprintHistory = jest.spyOn(sprintsApi, 'getSprintHistory');

      const { result } = renderHook(
        () => useSprintHistory({ enabled: false }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetSprintHistory).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });
  });
});
