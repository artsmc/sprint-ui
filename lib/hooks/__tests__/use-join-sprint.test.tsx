/**
 * Unit Tests for useJoinSprint Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJoinSprint, useJoinSprintSimple } from '../use-join-sprint';
import { joinSprint as joinSprintApi } from '@/lib/api/participants';
import { useRouter } from 'next/navigation';
import type { SprintParticipant } from '@/lib/types';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@/lib/api/participants', () => ({
  joinSprint: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Helper to create a wrapper with QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

// Mock data
const mockSprintParticipant: SprintParticipant = {
  id: 'participant-123',
  sprint_id: 'sprint-456',
  user_id: 'user-789',
  joined_at: '2025-01-15T10:00:00Z',
  created: '2025-01-15T10:00:00Z',
  updated: '2025-01-15T10:00:00Z',
  collectionId: 'sprint_participants',
  collectionName: 'sprint_participants',
};

describe('useJoinSprint', () => {
  const mockRouter = {
    refresh: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('initial state', () => {
    it('should return initial state with no pending mutation', () => {
      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isJoining).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.joinSprint).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('successful join', () => {
    it('should handle successful sprint join', async () => {
      (joinSprintApi as jest.Mock).mockResolvedValueOnce(mockSprintParticipant);

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      let participant: SprintParticipant | undefined;

      await act(async () => {
        participant = await result.current.joinSprint('sprint-456');
      });

      expect(participant).toEqual(mockSprintParticipant);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should call router.refresh on success', async () => {
      (joinSprintApi as jest.Mock).mockResolvedValueOnce(mockSprintParticipant);

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it('should set isJoining to true during mutation', async () => {
      let resolveJoin: (value: SprintParticipant) => void;
      const joinPromise = new Promise<SprintParticipant>((resolve) => {
        resolveJoin = resolve;
      });
      (joinSprintApi as jest.Mock).mockReturnValueOnce(joinPromise);

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      // Start the join
      let joinPromiseResult: Promise<SprintParticipant | undefined>;
      act(() => {
        joinPromiseResult = result.current.joinSprint('sprint-456');
      });

      // Check that isJoining is true while pending
      await waitFor(() => {
        expect(result.current.isJoining).toBe(true);
      });

      // Resolve the join
      await act(async () => {
        resolveJoin!(mockSprintParticipant);
        await joinPromiseResult;
      });

      // Check that isJoining is false after completion
      await waitFor(() => {
        expect(result.current.isJoining).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should handle not authenticated error', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce(
        new Error('Not authenticated')
      );

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error?.message).toBe(
        'You must be logged in to join a sprint.'
      );
    });

    it('should handle already participating error', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce(
        new Error('Already participating in this sprint')
      );

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error?.message).toBe(
        "You're already participating in this sprint."
      );
    });

    it('should handle unknown errors', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error?.message).toBe('Network error');
    });

    it('should handle non-Error exceptions', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce('Unknown error');

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error?.message).toBe(
        'Failed to join sprint. Please try again.'
      );
    });

    it('should return undefined on error', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce(
        new Error('Some error')
      );

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      let returnValue: SprintParticipant | undefined;
      await act(async () => {
        returnValue = await result.current.joinSprint('sprint-456');
      });

      expect(returnValue).toBeUndefined();
    });
  });

  describe('reset functionality', () => {
    it('should reset mutation state', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce(
        new Error('Some error')
      );

      const { result } = renderHook(() => useJoinSprint(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      act(() => {
        result.current.reset();
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(false);
      });
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});

describe('useJoinSprintSimple', () => {
  const mockRouter = {
    refresh: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useJoinSprintSimple());

      expect(result.current.isJoining).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('successful join', () => {
    it('should handle successful sprint join', async () => {
      (joinSprintApi as jest.Mock).mockResolvedValueOnce(mockSprintParticipant);

      const { result } = renderHook(() => useJoinSprintSimple());

      let participant: SprintParticipant | undefined;

      await act(async () => {
        participant = await result.current.joinSprint('sprint-456');
      });

      expect(participant).toEqual(mockSprintParticipant);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isJoining).toBe(false);
    });

    it('should call router.refresh on success', async () => {
      (joinSprintApi as jest.Mock).mockResolvedValueOnce(mockSprintParticipant);

      const { result } = renderHook(() => useJoinSprintSimple());

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle errors', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce(
        new Error('Not authenticated')
      );

      const { result } = renderHook(() => useJoinSprintSimple());

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe(
        'You must be logged in to join a sprint.'
      );
      expect(result.current.isJoining).toBe(false);
    });
  });

  describe('reset functionality', () => {
    it('should reset all state', async () => {
      (joinSprintApi as jest.Mock).mockRejectedValueOnce(
        new Error('Some error')
      );

      const { result } = renderHook(() => useJoinSprintSimple());

      await act(async () => {
        await result.current.joinSprint('sprint-456');
      });

      expect(result.current.isError).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isJoining).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
