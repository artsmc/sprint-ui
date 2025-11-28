/**
 * Unit Tests for Date Formatting Utilities
 */

import {
  formatCountdownTime,
  getCountdownUrgencyColor,
  formatDateShort,
} from '../date-formatting';

describe('formatCountdownTime', () => {
  describe('with days remaining', () => {
    it('should format multiple days correctly', () => {
      expect(formatCountdownTime(3, 5, 30, 45)).toBe(
        '3 days 5 hours remaining'
      );
    });

    it('should handle singular day correctly', () => {
      expect(formatCountdownTime(1, 12, 0, 0)).toBe('1 day 12 hours remaining');
    });

    it('should handle singular hour with days correctly', () => {
      expect(formatCountdownTime(2, 1, 30, 0)).toBe('2 days 1 hour remaining');
    });

    it('should handle singular day and singular hour', () => {
      expect(formatCountdownTime(1, 1, 45, 30)).toBe('1 day 1 hour remaining');
    });

    it('should handle days with zero hours', () => {
      expect(formatCountdownTime(5, 0, 30, 15)).toBe(
        '5 days 0 hours remaining'
      );
    });
  });

  describe('with hours only (no days)', () => {
    it('should format multiple hours correctly', () => {
      expect(formatCountdownTime(0, 5, 30, 0)).toBe('5 hours 30 min remaining');
    });

    it('should handle singular hour correctly', () => {
      expect(formatCountdownTime(0, 1, 15, 45)).toBe('1 hour 15 min remaining');
    });

    it('should handle hours with zero minutes', () => {
      expect(formatCountdownTime(0, 3, 0, 30)).toBe('3 hours 0 min remaining');
    });

    it('should handle exactly 1 hour 0 min', () => {
      expect(formatCountdownTime(0, 1, 0, 0)).toBe('1 hour 0 min remaining');
    });
  });

  describe('with minutes only (no days or hours)', () => {
    it('should format multiple minutes correctly', () => {
      expect(formatCountdownTime(0, 0, 45, 30)).toBe('45 min 30 sec remaining');
    });

    it('should handle singular minute correctly', () => {
      expect(formatCountdownTime(0, 0, 1, 30)).toBe('1 min 30 sec remaining');
    });

    it('should handle minutes with zero seconds', () => {
      expect(formatCountdownTime(0, 0, 10, 0)).toBe('10 min 0 sec remaining');
    });
  });

  describe('with seconds only', () => {
    it('should format multiple seconds correctly', () => {
      expect(formatCountdownTime(0, 0, 0, 45)).toBe('45 sec remaining');
    });

    it('should handle singular second correctly', () => {
      expect(formatCountdownTime(0, 0, 0, 1)).toBe('1 sec remaining');
    });

    it('should handle zero seconds', () => {
      expect(formatCountdownTime(0, 0, 0, 0)).toBe('0 sec remaining');
    });
  });
});

describe('getCountdownUrgencyColor', () => {
  describe('expired state', () => {
    it('should return gray when expired regardless of hours', () => {
      expect(getCountdownUrgencyColor(100, true)).toBe('gray');
    });

    it('should return gray when expired with zero hours', () => {
      expect(getCountdownUrgencyColor(0, true)).toBe('gray');
    });

    it('should return gray when expired with negative hours', () => {
      expect(getCountdownUrgencyColor(-5, true)).toBe('gray');
    });
  });

  describe('more than 72 hours (green)', () => {
    it('should return green for 100 hours', () => {
      expect(getCountdownUrgencyColor(100, false)).toBe('green');
    });

    it('should return green for 73 hours', () => {
      expect(getCountdownUrgencyColor(73, false)).toBe('green');
    });

    it('should not return green for exactly 72 hours', () => {
      expect(getCountdownUrgencyColor(72, false)).not.toBe('green');
    });
  });

  describe('24-72 hours (yellow)', () => {
    it('should return yellow for 72 hours', () => {
      expect(getCountdownUrgencyColor(72, false)).toBe('yellow');
    });

    it('should return yellow for 48 hours', () => {
      expect(getCountdownUrgencyColor(48, false)).toBe('yellow');
    });

    it('should return yellow for exactly 24 hours', () => {
      expect(getCountdownUrgencyColor(24, false)).toBe('yellow');
    });

    it('should return yellow for 25 hours', () => {
      expect(getCountdownUrgencyColor(25, false)).toBe('yellow');
    });
  });

  describe('less than 24 hours (red)', () => {
    it('should return red for 23 hours', () => {
      expect(getCountdownUrgencyColor(23, false)).toBe('red');
    });

    it('should return red for 12 hours', () => {
      expect(getCountdownUrgencyColor(12, false)).toBe('red');
    });

    it('should return red for 1 hour', () => {
      expect(getCountdownUrgencyColor(1, false)).toBe('red');
    });

    it('should return red for 0 hours when not expired', () => {
      expect(getCountdownUrgencyColor(0, false)).toBe('red');
    });
  });
});

describe('formatDateShort', () => {
  describe('with Date object', () => {
    it('should format a Date object correctly', () => {
      const date = new Date('2025-11-27T10:30:00Z');
      expect(formatDateShort(date)).toBe('Nov 27, 2025');
    });

    it('should format January date correctly', () => {
      const date = new Date('2025-01-15T00:00:00Z');
      expect(formatDateShort(date)).toBe('Jan 15, 2025');
    });

    it('should format December date correctly', () => {
      const date = new Date('2025-12-31T23:59:59Z');
      expect(formatDateShort(date)).toBe('Dec 31, 2025');
    });

    it('should format single-digit day correctly', () => {
      const date = new Date('2025-03-05T12:00:00Z');
      expect(formatDateShort(date)).toBe('Mar 5, 2025');
    });
  });

  describe('with ISO string', () => {
    it('should format an ISO date string correctly', () => {
      expect(formatDateShort('2025-12-15T00:00:00Z')).toBe('Dec 15, 2025');
    });

    it('should handle ISO string with timezone offset', () => {
      expect(formatDateShort('2025-07-04T12:00:00-05:00')).toMatch(
        /Jul \d{1,2}, 2025/
      );
    });

    it('should format a date-only ISO string', () => {
      expect(formatDateShort('2025-06-20')).toBe('Jun 20, 2025');
    });
  });

  describe('edge cases and error handling', () => {
    it('should throw TypeError for invalid date string', () => {
      expect(() => formatDateShort('not-a-date')).toThrow(TypeError);
    });

    it('should throw TypeError with descriptive message', () => {
      expect(() => formatDateShort('invalid')).toThrow(
        'Invalid date provided to formatDateShort'
      );
    });

    it('should throw TypeError for invalid Date object', () => {
      const invalidDate = new Date('invalid');
      expect(() => formatDateShort(invalidDate)).toThrow(TypeError);
    });
  });
});
