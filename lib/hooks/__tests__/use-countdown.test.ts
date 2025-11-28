/**
 * Unit Tests for useCountdown Hook
 */

import { renderHook, act } from '@testing-library/react';
import { useCountdown } from '../use-countdown';

// Mock timers for testing
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useCountdown', () => {
  describe('initial state', () => {
    it('should calculate time remaining correctly for future date', () => {
      // Set a date 2 days, 5 hours, 30 minutes, 45 seconds in the future
      const now = new Date('2025-01-01T12:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-03T17:30:45Z');
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.time.days).toBe(2);
      expect(result.current.time.hours).toBe(5);
      expect(result.current.time.minutes).toBe(30);
      expect(result.current.time.seconds).toBe(45);
      expect(result.current.isExpired).toBe(false);
    });

    it('should accept ISO string as endDate', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const { result } = renderHook(() => useCountdown('2025-01-02T00:00:00Z'));

      expect(result.current.time.days).toBe(1);
      expect(result.current.time.hours).toBe(0);
      expect(result.current.time.minutes).toBe(0);
      expect(result.current.time.seconds).toBe(0);
      expect(result.current.isExpired).toBe(false);
    });

    it('should return expired state for past date', () => {
      const now = new Date('2025-01-15T12:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T00:00:00Z');
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.time.days).toBe(0);
      expect(result.current.time.hours).toBe(0);
      expect(result.current.time.minutes).toBe(0);
      expect(result.current.time.seconds).toBe(0);
      expect(result.current.isExpired).toBe(true);
      expect(result.current.formatted).toBe('Ended');
    });
  });

  describe('countdown updates', () => {
    it('should update every second', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T00:01:00Z'); // 1 minute from now
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.time.seconds).toBe(0);
      expect(result.current.time.minutes).toBe(1);

      // Advance by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.time.seconds).toBe(59);
      expect(result.current.time.minutes).toBe(0);
    });

    it('should transition to expired when countdown reaches zero', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T00:00:03Z'); // 3 seconds from now
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.isExpired).toBe(false);
      expect(result.current.time.seconds).toBe(3);

      // Advance by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.isExpired).toBe(true);
      expect(result.current.formatted).toBe('Ended');
    });
  });

  describe('formatted output', () => {
    it('should format days and hours correctly', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-04T05:00:00Z'); // 3 days 5 hours
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.formatted).toBe('3 days 5 hours remaining');
    });

    it('should format hours and minutes when less than 1 day', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T05:30:00Z'); // 5 hours 30 minutes
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.formatted).toBe('5 hours 30 min remaining');
    });

    it('should format minutes and seconds when less than 1 hour', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T00:15:30Z'); // 15 minutes 30 seconds
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.formatted).toBe('15 min 30 sec remaining');
    });

    it('should format seconds only when less than 1 minute', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T00:00:45Z'); // 45 seconds
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.formatted).toBe('45 sec remaining');
    });
  });

  describe('urgency color', () => {
    it('should return green for more than 72 hours', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-05T00:00:00Z'); // 4 days
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.urgencyColor).toBe('green');
    });

    it('should return yellow for 24-72 hours', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-02T12:00:00Z'); // 36 hours
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.urgencyColor).toBe('yellow');
    });

    it('should return red for less than 24 hours', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T12:00:00Z'); // 12 hours
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.urgencyColor).toBe('red');
    });

    it('should return gray when expired', () => {
      const now = new Date('2025-01-15T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-01T00:00:00Z'); // past date
      const { result } = renderHook(() => useCountdown(endDate));

      expect(result.current.urgencyColor).toBe('gray');
    });
  });

  describe('cleanup', () => {
    it('should clear interval on unmount', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const endDate = new Date('2025-01-02T00:00:00Z');
      const { unmount } = renderHook(() => useCountdown(endDate));

      // Clear any pending timers before unmount
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    it('should not start interval for already expired date', () => {
      const now = new Date('2025-01-15T00:00:00Z');
      jest.setSystemTime(now);

      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      const endDate = new Date('2025-01-01T00:00:00Z'); // past date
      renderHook(() => useCountdown(endDate));

      expect(setIntervalSpy).not.toHaveBeenCalled();
      setIntervalSpy.mockRestore();
    });
  });

  describe('endDate changes', () => {
    it('should update when endDate prop changes', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const initialEndDate = new Date('2025-01-02T00:00:00Z'); // 1 day
      const { result, rerender } = renderHook(
        ({ endDate }) => useCountdown(endDate),
        { initialProps: { endDate: initialEndDate } }
      );

      expect(result.current.time.days).toBe(1);

      // Change the end date to 3 days from now
      const newEndDate = new Date('2025-01-04T00:00:00Z');
      rerender({ endDate: newEndDate });

      expect(result.current.time.days).toBe(3);
    });
  });
});
