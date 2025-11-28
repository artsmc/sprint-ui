/**
 * Sprints API Service Tests
 *
 * Unit tests for the sprint date validation functions used in the "Start Next Sprint" feature.
 * Tests cover Gherkin Scenarios: 5-7 (Date overlap validation), 11 (End date validation), 35 (Adjacent sprints)
 *
 * @module __tests__/lib/api/sprints.test
 */

import {
  getOverlappingSprints,
  validateSprintDates,
  getStatusLabel,
} from '@/lib/api/sprints';
import pb from '@/lib/pocketbase';
import type { Sprint, SprintStatus } from '@/lib/types';

// Mock PocketBase
jest.mock('@/lib/pocketbase', () => ({
  __esModule: true,
  default: {
    collection: jest.fn(),
  },
}));

// =============================================================================
// Test Data Factory
// =============================================================================

function createMockSprint(overrides: Partial<Sprint> = {}): Sprint {
  return {
    id: 'sprint_001',
    sprint_number: 1,
    name: 'Sprint #1 - Test',
    challenge_id: 'challenge_001',
    status: 'active' as SprintStatus,
    start_at: '2025-01-15T00:00:00Z',
    end_at: '2025-01-29T00:00:00Z',
    voting_end_at: null,
    retro_day: null,
    duration_days: 14,
    started_by_id: null,
    ended_by_id: null,
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
    collectionId: 'sprints',
    collectionName: 'sprints',
    ...overrides,
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

function setupMocks(options: {
  sprints?: Sprint[];
  error?: Error;
}) {
  const mockPb = pb as jest.Mocked<typeof pb>;

  mockPb.collection.mockImplementation(() => ({
    getFullList: jest.fn().mockImplementation(() => {
      if (options.error) {
        return Promise.reject(options.error);
      }
      return Promise.resolve(options.sprints ?? []);
    }),
  } as any));
}

// =============================================================================
// Tests: getOverlappingSprints
// =============================================================================

describe('getOverlappingSprints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('overlap detection algorithm', () => {
    /**
     * Scenario 5: Prevent date overlap with active sprint
     * Given Sprint #5 is active from "2025-01-15" to "2025-01-29"
     * And I set the start time to "2025-01-20" with end date "2025-01-27"
     * Then I see a validation error about overlap
     */
    it('should detect complete overlap (new sprint entirely within existing)', async () => {
      const existingSprint = createMockSprint({
        id: 'sprint_005',
        sprint_number: 5,
        name: 'Sprint #5',
        status: 'active',
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const startDate = new Date('2025-01-20T00:00:00Z');
      const endDate = new Date('2025-01-27T00:00:00Z');

      const overlappingSprints = await getOverlappingSprints(startDate, endDate);

      expect(overlappingSprints).toHaveLength(1);
      expect(overlappingSprints[0].id).toBe('sprint_005');
    });

    it('should detect overlap when new sprint starts before existing ends', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const startDate = new Date('2025-01-25T00:00:00Z');
      const endDate = new Date('2025-02-05T00:00:00Z');

      const overlappingSprints = await getOverlappingSprints(startDate, endDate);

      expect(overlappingSprints).toHaveLength(1);
    });

    it('should detect overlap when new sprint ends after existing starts', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const startDate = new Date('2025-01-10T00:00:00Z');
      const endDate = new Date('2025-01-20T00:00:00Z');

      const overlappingSprints = await getOverlappingSprints(startDate, endDate);

      expect(overlappingSprints).toHaveLength(1);
    });

    it('should detect overlap when new sprint completely contains existing', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const startDate = new Date('2025-01-10T00:00:00Z');
      const endDate = new Date('2025-02-05T00:00:00Z');

      const overlappingSprints = await getOverlappingSprints(startDate, endDate);

      expect(overlappingSprints).toHaveLength(1);
    });

    /**
     * Scenario 7: Allow adjacent sprints (no overlap)
     * Given Sprint #5 ends on "2025-01-29"
     * When I set the start time to "2025-01-30"
     * Then date validation passes
     */
    it('should NOT detect overlap for adjacent sprints', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const startDate = new Date('2025-01-30T00:00:00Z');
      const endDate = new Date('2025-02-13T00:00:00Z');

      const overlappingSprints = await getOverlappingSprints(startDate, endDate);

      expect(overlappingSprints).toHaveLength(0);
    });

    /**
     * Scenario 35: Validation passes when dates are exactly adjacent
     * Given Sprint #5 ends on "2025-01-29 23:59:59"
     * When I set the start time to "2025-01-30 00:00:00"
     * Then date validation passes (no overlap)
     */
    it('should NOT detect overlap for exactly adjacent sprints (end equals start)', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T23:59:59Z',
      });

      setupMocks({ sprints: [existingSprint] });

      // Start exactly at midnight after the end
      const startDate = new Date('2025-01-30T00:00:00Z');
      const endDate = new Date('2025-02-13T00:00:00Z');

      const overlappingSprints = await getOverlappingSprints(startDate, endDate);

      expect(overlappingSprints).toHaveLength(0);
    });

    it('should NOT detect overlap for sprints in the past (before existing start)', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const startDate = new Date('2025-01-01T00:00:00Z');
      const endDate = new Date('2025-01-14T00:00:00Z');

      const overlappingSprints = await getOverlappingSprints(startDate, endDate);

      expect(overlappingSprints).toHaveLength(0);
    });
  });

  describe('status filtering', () => {
    /**
     * Scenario 5: Prevent date overlap with active sprint
     * Scenario 6: Prevent date overlap with scheduled sprint
     */
    it('should include active sprints in overlap check', async () => {
      const activeSprint = createMockSprint({
        status: 'active',
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [activeSprint] });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-25T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(1);
    });

    it('should include scheduled sprints in overlap check', async () => {
      const scheduledSprint = createMockSprint({
        status: 'scheduled',
        start_at: '2025-02-01T00:00:00Z',
        end_at: '2025-02-14T00:00:00Z',
      });

      setupMocks({ sprints: [scheduledSprint] });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-02-05T00:00:00Z'),
        new Date('2025-02-10T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(1);
    });

    it('should include voting sprints in overlap check', async () => {
      const votingSprint = createMockSprint({
        status: 'voting',
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [votingSprint] });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-25T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(1);
    });

    it('should include retro sprints in overlap check', async () => {
      const retroSprint = createMockSprint({
        status: 'retro',
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [retroSprint] });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-25T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(1);
    });

    it('should NOT include completed sprints (handled by filter, but tested for completeness)', async () => {
      // Note: In real implementation, completed sprints are filtered by the API query
      // This test verifies the in-memory filtering doesn't affect completed sprints
      setupMocks({ sprints: [] }); // API returns no relevant sprints

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-25T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(0);
    });
  });

  describe('sprints with null dates', () => {
    it('should skip sprints with null start_at', async () => {
      const sprintWithNullStart = createMockSprint({
        start_at: null as any,
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [sprintWithNullStart] });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-25T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(0);
    });

    it('should skip sprints with null end_at', async () => {
      const sprintWithNullEnd = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: null as any,
      });

      setupMocks({ sprints: [sprintWithNullEnd] });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-25T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(0);
    });
  });

  describe('multiple sprints', () => {
    it('should return all overlapping sprints when multiple overlap', async () => {
      const sprints = [
        createMockSprint({
          id: 'sprint_001',
          start_at: '2025-01-01T00:00:00Z',
          end_at: '2025-01-15T00:00:00Z',
        }),
        createMockSprint({
          id: 'sprint_002',
          start_at: '2025-01-10T00:00:00Z',
          end_at: '2025-01-20T00:00:00Z',
        }),
        createMockSprint({
          id: 'sprint_003',
          start_at: '2025-02-01T00:00:00Z',
          end_at: '2025-02-15T00:00:00Z',
        }),
      ];

      setupMocks({ sprints });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-12T00:00:00Z'),
        new Date('2025-01-18T00:00:00Z')
      );

      // Should overlap with sprint_001 and sprint_002, but not sprint_003
      expect(overlappingSprints).toHaveLength(2);
      expect(overlappingSprints.map((s) => s.id)).toContain('sprint_001');
      expect(overlappingSprints.map((s) => s.id)).toContain('sprint_002');
    });

    it('should return empty array when no sprints exist', async () => {
      setupMocks({ sprints: [] });

      const overlappingSprints = await getOverlappingSprints(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-02-05T00:00:00Z')
      );

      expect(overlappingSprints).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should throw descriptive error when API call fails', async () => {
      setupMocks({ error: new Error('Database connection failed') });

      await expect(
        getOverlappingSprints(
          new Date('2025-01-20T00:00:00Z'),
          new Date('2025-02-05T00:00:00Z')
        )
      ).rejects.toThrow('Failed to check for overlapping sprints: Database connection failed');
    });

    it('should handle unknown error types', async () => {
      const mockPb = pb as jest.Mocked<typeof pb>;
      mockPb.collection.mockImplementation(() => ({
        getFullList: jest.fn().mockRejectedValue('String error'),
      } as any));

      await expect(
        getOverlappingSprints(
          new Date('2025-01-20T00:00:00Z'),
          new Date('2025-02-05T00:00:00Z')
        )
      ).rejects.toThrow('Failed to check for overlapping sprints: Unknown error');
    });
  });
});

// =============================================================================
// Tests: validateSprintDates
// =============================================================================

describe('validateSprintDates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Scenario 11: End date must be after start date
   * Given I set the start time to "2025-02-10"
   * And I set the end date to "2025-02-05" (before start date)
   * Then I see a validation error: "End date must be after start date"
   */
  describe('basic date validation', () => {
    it('should return invalid when end date is before start date', async () => {
      setupMocks({ sprints: [] });

      const result = await validateSprintDates(
        new Date('2025-02-10T00:00:00Z'),
        new Date('2025-02-05T00:00:00Z')
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('should return invalid when end date equals start date', async () => {
      setupMocks({ sprints: [] });

      const sameDate = new Date('2025-02-10T00:00:00Z');
      const result = await validateSprintDates(sameDate, new Date(sameDate));

      expect(result.valid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('should return valid when end date is after start date', async () => {
      setupMocks({ sprints: [] });

      const result = await validateSprintDates(
        new Date('2025-02-10T00:00:00Z'),
        new Date('2025-02-24T00:00:00Z')
      );

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  /**
   * Scenario 5: Prevent date overlap with active sprint
   * Then I see a validation error: "Sprint dates overlap with Sprint #5 (active from 2025-01-15 to 2025-01-29)"
   */
  describe('overlap validation', () => {
    it('should return invalid with descriptive error when dates overlap', async () => {
      const existingSprint = createMockSprint({
        id: 'sprint_005',
        sprint_number: 5,
        name: 'Sprint #5 - Design Challenge',
        status: 'active',
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const result = await validateSprintDates(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-27T00:00:00Z')
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Sprint dates overlap');
      expect(result.error).toContain('Sprint #5');
      expect(result.error).toContain('active');
      expect(result.conflictingSprint).toEqual(existingSprint);
    });

    it('should include the status label in the error message', async () => {
      const scheduledSprint = createMockSprint({
        name: 'Sprint #6 - Upcoming',
        status: 'scheduled',
        start_at: '2025-02-01T00:00:00Z',
        end_at: '2025-02-14T00:00:00Z',
      });

      setupMocks({ sprints: [scheduledSprint] });

      const result = await validateSprintDates(
        new Date('2025-02-05T00:00:00Z'),
        new Date('2025-02-10T00:00:00Z')
      );

      expect(result.error).toContain('scheduled');
    });

    it('should include formatted dates in the error message', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const result = await validateSprintDates(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-27T00:00:00Z')
      );

      expect(result.error).toContain('2025-01-15');
      expect(result.error).toContain('2025-01-29');
    });

    it('should return the conflicting sprint in the result', async () => {
      const existingSprint = createMockSprint({
        id: 'sprint_conflict',
        name: 'Conflicting Sprint',
      });

      setupMocks({ sprints: [existingSprint] });

      const result = await validateSprintDates(
        new Date('2025-01-20T00:00:00Z'),
        new Date('2025-01-27T00:00:00Z')
      );

      expect(result.conflictingSprint).toBeDefined();
      expect(result.conflictingSprint?.id).toBe('sprint_conflict');
    });
  });

  /**
   * Scenario 7: Allow adjacent sprints (no overlap)
   * Given Sprint #5 ends on "2025-01-29"
   * When I set the start time to "2025-01-30"
   * Then date validation passes
   */
  describe('adjacent sprints', () => {
    it('should return valid for adjacent sprints', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const result = await validateSprintDates(
        new Date('2025-01-30T00:00:00Z'),
        new Date('2025-02-13T00:00:00Z')
      );

      expect(result.valid).toBe(true);
    });

    it('should return valid for non-overlapping future sprints', async () => {
      const existingSprint = createMockSprint({
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
      });

      setupMocks({ sprints: [existingSprint] });

      const result = await validateSprintDates(
        new Date('2025-03-01T00:00:00Z'),
        new Date('2025-03-15T00:00:00Z')
      );

      expect(result.valid).toBe(true);
    });

    it('should return valid when no other sprints exist', async () => {
      setupMocks({ sprints: [] });

      const result = await validateSprintDates(
        new Date('2025-01-15T00:00:00Z'),
        new Date('2025-01-29T00:00:00Z')
      );

      expect(result.valid).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should validate dates spanning year boundaries', async () => {
      setupMocks({ sprints: [] });

      const result = await validateSprintDates(
        new Date('2025-12-25T00:00:00Z'),
        new Date('2026-01-08T00:00:00Z')
      );

      expect(result.valid).toBe(true);
    });

    it('should handle very short duration (1 day)', async () => {
      setupMocks({ sprints: [] });

      const result = await validateSprintDates(
        new Date('2025-01-15T00:00:00Z'),
        new Date('2025-01-16T00:00:00Z')
      );

      expect(result.valid).toBe(true);
    });

    it('should handle very long duration', async () => {
      setupMocks({ sprints: [] });

      const result = await validateSprintDates(
        new Date('2025-01-01T00:00:00Z'),
        new Date('2025-12-31T00:00:00Z')
      );

      expect(result.valid).toBe(true);
    });
  });
});

// =============================================================================
// Tests: getStatusLabel
// =============================================================================

describe('getStatusLabel', () => {
  it('should return correct label for each status', () => {
    expect(getStatusLabel('scheduled')).toBe('Scheduled');
    expect(getStatusLabel('active')).toBe('Active');
    expect(getStatusLabel('voting')).toBe('Voting');
    expect(getStatusLabel('retro')).toBe('Retrospective');
    expect(getStatusLabel('completed')).toBe('Completed');
    expect(getStatusLabel('cancelled')).toBe('Cancelled');
  });
});
