/**
 * useStartSprint Hook Tests
 *
 * Unit tests for the useStartSprint TanStack Query hook.
 * Tests cover Gherkin Scenarios: 1 (Sprint creation), 3 (Random selection),
 * 14-15 (Error handling), 33 (Cache invalidation), 34 (Debouncing)
 *
 * @module __tests__/lib/hooks/use-start-sprint.test
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStartSprint, startSprintKeys } from '@/lib/hooks/use-start-sprint';
import * as challengesApi from '@/lib/api/challenges';
import * as sprintsApi from '@/lib/api/sprints';
import type { Challenge, Sprint } from '@/lib/types';

// Mock the API modules
jest.mock('@/lib/api/challenges', () => ({
  getAvailableChallenges: jest.fn(),
  getRandomAvailableChallenge: jest.fn(),
}));

jest.mock('@/lib/api/sprints', () => ({
  createSprint: jest.fn(),
  validateSprintDates: jest.fn(),
  getNextSprintNumber: jest.fn(),
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
];

const mockCreatedSprint: Sprint = {
  id: 'sprint_006',
  sprint_number: 6,
  name: 'Sprint #6 - Dashboard Analytics',
  challenge_id: 'challenge_001',
  status: 'active',
  start_at: '2025-02-01T00:00:00Z',
  end_at: '2025-02-15T00:00:00Z',
  voting_end_at: null,
  retro_day: null,
  duration_days: 14,
  started_by_id: null,
  ended_by_id: null,
  created: '2025-02-01T00:00:00Z',
  updated: '2025-02-01T00:00:00Z',
  collectionId: 'sprints',
  collectionName: 'sprints',
};

// =============================================================================
// Test Utilities
// =============================================================================

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

// =============================================================================
// Tests: useStartSprint Hook
// =============================================================================

describe('useStartSprint', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  // ===========================================================================
  // Available Challenges Query Tests
  // ===========================================================================

  describe('availableChallenges query', () => {
    /**
     * Scenario 16: Loading state during challenge fetch
     * When the available challenges are being fetched
     * Then the challenge dropdown displays a loading spinner
     */
    it('should show loading state initially', async () => {
      // Setup mock to resolve after a delay
      (challengesApi.getAvailableChallenges as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockChallenges), 100))
      );

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      expect(result.current.availableChallenges.isLoading).toBe(true);
      expect(result.current.availableChallenges.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.availableChallenges.isLoading).toBe(false);
      });
    });

    it('should fetch available challenges on mount', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockResolvedValue(mockChallenges);

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.availableChallenges.data).toEqual(mockChallenges);
      });

      expect(challengesApi.getAvailableChallenges).toHaveBeenCalledWith(
        new Date().getFullYear()
      );
    });

    it('should use the specified year parameter', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockResolvedValue(mockChallenges);

      const { result } = renderHook(() => useStartSprint({ year: 2024 }), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.availableChallenges.data).toBeDefined();
      });

      expect(challengesApi.getAvailableChallenges).toHaveBeenCalledWith(2024);
    });

    /**
     * Scenario 14: Handle API error during challenge fetch
     * Given the PocketBase API is unavailable
     * Then the challenge dropdown displays: "Failed to load challenges"
     */
    it('should handle API errors gracefully', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(
        () => {
          expect(result.current.availableChallenges.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.availableChallenges.error).toBeDefined();
      expect(result.current.availableChallenges.error?.message).toBe('Network error');
    });

    /**
     * Scenario 21: No available challenges in current year
     * Given all 100 challenges have been used
     * Then display: "All challenges have been used this year"
     */
    it('should map "No available challenges" error to user-friendly message', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockRejectedValue(
        new Error('No available challenges for 2025')
      );

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.availableChallenges.isError).toBe(true);
      });

      expect(result.current.availableChallenges.error?.message).toContain(
        'All challenges have been used this year'
      );
    });

    it('should not retry on "all challenges used" error', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockRejectedValue(
        new Error('No available challenges')
      );

      renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        // Wait for the query to settle
      });

      // Should only be called once (no retries)
      expect(challengesApi.getAvailableChallenges).toHaveBeenCalledTimes(1);
    });

    it('should support refetch functionality', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockResolvedValue(mockChallenges);

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.availableChallenges.data).toBeDefined();
      });

      // Clear and refetch
      act(() => {
        result.current.availableChallenges.refetch();
      });

      await waitFor(() => {
        expect(challengesApi.getAvailableChallenges).toHaveBeenCalledTimes(2);
      });
    });

    it('should not fetch when enabled is false', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockResolvedValue(mockChallenges);

      renderHook(() => useStartSprint({ enabled: false }), {
        wrapper: createWrapper(queryClient),
      });

      // Wait a bit to ensure no calls are made
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(challengesApi.getAvailableChallenges).not.toHaveBeenCalled();
    });

    it('should cache results for 5 minutes (staleTime)', async () => {
      (challengesApi.getAvailableChallenges as jest.Mock).mockResolvedValue(mockChallenges);

      const { result, rerender } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.availableChallenges.data).toBeDefined();
      });

      // Rerender should use cached data
      rerender();

      // Only one call should have been made
      expect(challengesApi.getAvailableChallenges).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // Select Random Challenge Tests
  // ===========================================================================

  describe('selectRandomChallenge', () => {
    /**
     * Scenario 3: Random challenge selection
     * When I select "Random" from the challenge dropdown
     * Then the system randomly selects one of the available challenges
     */
    it('should call getRandomAvailableChallenge and return result', async () => {
      const randomChallenge = mockChallenges[0];
      (challengesApi.getRandomAvailableChallenge as jest.Mock).mockResolvedValue(randomChallenge);

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      let selectedChallenge: Challenge | null = null;
      await act(async () => {
        selectedChallenge = await result.current.selectRandomChallenge();
      });

      expect(selectedChallenge).toEqual(randomChallenge);
      expect(challengesApi.getRandomAvailableChallenge).toHaveBeenCalledWith(
        new Date().getFullYear()
      );
    });

    it('should use the specified year parameter for random selection', async () => {
      (challengesApi.getRandomAvailableChallenge as jest.Mock).mockResolvedValue(mockChallenges[0]);

      const { result } = renderHook(() => useStartSprint({ year: 2024 }), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        await result.current.selectRandomChallenge();
      });

      expect(challengesApi.getRandomAvailableChallenge).toHaveBeenCalledWith(2024);
    });

    it('should return null when random selection fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (challengesApi.getRandomAvailableChallenge as jest.Mock).mockRejectedValue(
        new Error('No challenges available')
      );

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      let selectedChallenge: Challenge | null = null;
      await act(async () => {
        selectedChallenge = await result.current.selectRandomChallenge();
      });

      expect(selectedChallenge).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Validate Dates Tests
  // ===========================================================================

  describe('validateDates', () => {
    /**
     * Scenario 34: Real-time validation debouncing
     * Date validation should be available for use
     */
    it('should call validateSprintDates with provided dates', async () => {
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      const startDate = new Date('2025-02-01T00:00:00Z');
      const endDate = new Date('2025-02-15T00:00:00Z');

      await act(async () => {
        const validationResult = await result.current.validateDates(startDate, endDate);
        expect(validationResult.valid).toBe(true);
      });

      expect(sprintsApi.validateSprintDates).toHaveBeenCalledWith(startDate, endDate);
    });

    it('should return validation error when dates are invalid', async () => {
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({
        valid: false,
        error: 'End date must be after start date',
      });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      const startDate = new Date('2025-02-15T00:00:00Z');
      const endDate = new Date('2025-02-01T00:00:00Z');

      await act(async () => {
        const validationResult = await result.current.validateDates(startDate, endDate);
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe('End date must be after start date');
      });
    });

    it('should return overlap error with conflicting sprint info', async () => {
      const conflictingSprint = {
        id: 'sprint_005',
        name: 'Sprint #5',
        status: 'active',
      };

      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({
        valid: false,
        error: 'Sprint dates overlap with Sprint #5',
        conflictingSprint,
      });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        const validationResult = await result.current.validateDates(
          new Date('2025-01-20T00:00:00Z'),
          new Date('2025-01-27T00:00:00Z')
        );
        expect(validationResult.valid).toBe(false);
        expect(validationResult.conflictingSprint).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // Get Next Number Tests
  // ===========================================================================

  describe('getNextNumber', () => {
    /**
     * Scenario 28: Sprint number increments automatically
     * Given the last sprint created was Sprint #5
     * Then the created sprint has sprint_number 6
     */
    it('should call getNextSprintNumber and return result', async () => {
      (sprintsApi.getNextSprintNumber as jest.Mock).mockResolvedValue(6);

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      let nextNumber: number = 0;
      await act(async () => {
        nextNumber = await result.current.getNextNumber();
      });

      expect(nextNumber).toBe(6);
      expect(sprintsApi.getNextSprintNumber).toHaveBeenCalled();
    });

    it('should return 1 when getNextSprintNumber fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (sprintsApi.getNextSprintNumber as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      let nextNumber: number = 0;
      await act(async () => {
        nextNumber = await result.current.getNextNumber();
      });

      expect(nextNumber).toBe(1);
      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Create Sprint Mutation Tests
  // ===========================================================================

  describe('createSprintMutation', () => {
    /**
     * Scenario 1: Successfully create standard 2-week sprint
     * When I click the "Start Sprint" button
     * Then a new sprint is created with status "active"
     */
    it('should create sprint successfully', async () => {
      (sprintsApi.createSprint as jest.Mock).mockResolvedValue(mockCreatedSprint);
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        await result.current.createSprintMutation.mutateAsync({
          sprint_number: 6,
          name: 'Sprint #6 - Dashboard Analytics',
          challenge_id: 'challenge_001',
          status: 'active',
          start_at: '2025-02-01T00:00:00Z',
          end_at: '2025-02-15T00:00:00Z',
          duration_days: 14,
        });
      });

      expect(result.current.createSprintMutation.isSuccess).toBe(true);
      expect(result.current.createSprintMutation.data).toEqual(mockCreatedSprint);
    });

    /**
     * Scenario 17: Loading state during sprint creation
     * When I click the "Start Sprint" button
     * Then the button shows a loading spinner
     */
    it('should show loading state during creation', async () => {
      let resolvePromise: (value: typeof mockCreatedSprint) => void;
      (sprintsApi.createSprint as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      act(() => {
        result.current.createSprintMutation.mutate({
          sprint_number: 6,
          name: 'Sprint #6',
          challenge_id: 'challenge_001',
        });
      });

      // Check loading state is true during mutation
      await waitFor(() => {
        expect(result.current.createSprintMutation.isLoading).toBe(true);
      });

      // Resolve the promise
      act(() => {
        resolvePromise!(mockCreatedSprint);
      });

      await waitFor(() => {
        expect(result.current.createSprintMutation.isLoading).toBe(false);
      });
    });

    /**
     * Scenario 15: Handle API error during sprint creation
     * When the PocketBase API returns a 500 error
     * Then I see an error message
     */
    it('should handle creation errors', async () => {
      (sprintsApi.createSprint as jest.Mock).mockRejectedValue(
        new Error('Server error')
      );
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        try {
          await result.current.createSprintMutation.mutateAsync({
            sprint_number: 6,
            name: 'Sprint #6',
            challenge_id: 'challenge_001',
            start_at: '2025-02-01T00:00:00Z',
            end_at: '2025-02-15T00:00:00Z',
          });
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.createSprintMutation.isError).toBe(true);
      });

      expect(result.current.createSprintMutation.error?.message).toBe('Server error');
    });

    it('should validate dates before creating sprint', async () => {
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({
        valid: false,
        error: 'Sprint dates overlap',
      });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        try {
          await result.current.createSprintMutation.mutateAsync({
            sprint_number: 6,
            name: 'Sprint #6',
            challenge_id: 'challenge_001',
            start_at: '2025-02-01T00:00:00Z',
            end_at: '2025-02-15T00:00:00Z',
          });
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.createSprintMutation.isError).toBe(true);
      });
      expect(result.current.createSprintMutation.error?.message).toContain('overlap');
    });

    it('should skip date validation if dates are not provided', async () => {
      (sprintsApi.createSprint as jest.Mock).mockResolvedValue(mockCreatedSprint);

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        await result.current.createSprintMutation.mutateAsync({
          sprint_number: 6,
          name: 'Sprint #6',
          challenge_id: 'challenge_001',
          // No start_at or end_at
        });
      });

      expect(sprintsApi.validateSprintDates).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(result.current.createSprintMutation.isSuccess).toBe(true);
      });
    });

    /**
     * Scenario 33: Query cache invalidation after sprint creation
     * When I successfully create Sprint #6
     * Then the "Current Sprint" query cache is invalidated
     * And the "Available Challenges" query cache is invalidated
     */
    it('should invalidate caches on successful creation', async () => {
      (sprintsApi.createSprint as jest.Mock).mockResolvedValue(mockCreatedSprint);
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({ valid: true });

      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        await result.current.createSprintMutation.mutateAsync({
          sprint_number: 6,
          name: 'Sprint #6',
          challenge_id: 'challenge_001',
          start_at: '2025-02-01T00:00:00Z',
          end_at: '2025-02-15T00:00:00Z',
        });
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['current-sprint'],
        })
      );
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: startSprintKeys.availableChallenges(new Date().getFullYear()),
        })
      );
    });

    it('should map authentication errors to user-friendly message', async () => {
      (sprintsApi.createSprint as jest.Mock).mockRejectedValue(
        new Error('User not authenticated')
      );
      (sprintsApi.validateSprintDates as jest.Mock).mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useStartSprint(), {
        wrapper: createWrapper(queryClient),
      });

      await act(async () => {
        try {
          await result.current.createSprintMutation.mutateAsync({
            sprint_number: 6,
            name: 'Sprint #6',
            challenge_id: 'challenge_001',
            start_at: '2025-02-01T00:00:00Z',
            end_at: '2025-02-15T00:00:00Z',
          });
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.createSprintMutation.isError).toBe(true);
      });

      expect(result.current.createSprintMutation.error?.message).toContain(
        'log in as an admin'
      );
    });
  });

  // ===========================================================================
  // Query Key Factory Tests
  // ===========================================================================

  describe('startSprintKeys', () => {
    it('should generate correct query keys', () => {
      expect(startSprintKeys.all).toEqual(['start-sprint']);
      expect(startSprintKeys.availableChallenges(2025)).toEqual([
        'start-sprint',
        'available-challenges',
        2025,
      ]);
    });
  });
});
