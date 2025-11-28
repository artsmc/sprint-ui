/**
 * Challenges API Service Tests
 *
 * Unit tests for the challenge availability functions used in the "Start Next Sprint" feature.
 * Tests cover Gherkin Scenarios: 2.1-2.3 (Challenge availability validation), 3.1 (Random selection)
 *
 * @module __tests__/lib/api/challenges.test
 */

import { getAvailableChallenges, getRandomAvailableChallenge } from '@/lib/api/challenges';
import pb from '@/lib/pocketbase';

// Mock PocketBase
jest.mock('@/lib/pocketbase', () => ({
  __esModule: true,
  default: {
    collection: jest.fn(),
  },
}));

// =============================================================================
// Test Data
// =============================================================================

const mockChallenges = [
  {
    id: 'challenge_001',
    challenge_number: 1,
    title: 'Dashboard Analytics',
    brief: '<p>Design a dashboard...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
  },
  {
    id: 'challenge_002',
    challenge_number: 2,
    title: 'E-commerce Checkout',
    brief: '<p>Design a checkout flow...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
  },
  {
    id: 'challenge_003',
    challenge_number: 3,
    title: 'Mobile Banking App',
    brief: '<p>Design a banking app...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
  },
  {
    id: 'challenge_004',
    challenge_number: 4,
    title: 'Social Media Feed',
    brief: '<p>Design a social feed...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
  },
  {
    id: 'challenge_005',
    challenge_number: 5,
    title: 'Calendar App',
    brief: '<p>Design a calendar...</p>',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
  },
];

const mockSprintsInYear = [
  {
    id: 'sprint_001',
    sprint_number: 1,
    name: 'Sprint #1 - Dashboard Analytics',
    challenge_id: 'challenge_001',
    start_at: '2025-01-15T00:00:00Z',
    end_at: '2025-01-29T00:00:00Z',
    status: 'completed',
  },
  {
    id: 'sprint_002',
    sprint_number: 2,
    name: 'Sprint #2 - E-commerce Checkout',
    challenge_id: 'challenge_002',
    start_at: '2025-02-01T00:00:00Z',
    end_at: '2025-02-15T00:00:00Z',
    status: 'active',
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

function setupMocks(options: {
  sprints?: typeof mockSprintsInYear;
  challenges?: typeof mockChallenges;
  sprintError?: Error;
  challengeError?: Error;
}) {
  const mockPb = pb as jest.Mocked<typeof pb>;

  mockPb.collection.mockImplementation((collectionName: string) => {
    if (collectionName === 'sprints') {
      return {
        getFullList: jest.fn().mockImplementation(() => {
          if (options.sprintError) {
            return Promise.reject(options.sprintError);
          }
          return Promise.resolve(options.sprints ?? mockSprintsInYear);
        }),
      } as any;
    }

    if (collectionName === 'challenges') {
      return {
        getFullList: jest.fn().mockImplementation(() => {
          if (options.challengeError) {
            return Promise.reject(options.challengeError);
          }
          return Promise.resolve(options.challenges ?? mockChallenges);
        }),
      } as any;
    }

    return {} as any;
  });
}

// =============================================================================
// Tests: getAvailableChallenges
// =============================================================================

describe('getAvailableChallenges', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Scenario 4: Prevent duplicate challenge in same year
   * Given "Challenge #1" was used in Sprint #1 on "2025-01-15"
   * When I view the challenge dropdown
   * Then "Challenge #1" is NOT in the available list
   */
  describe('filtering out used challenges', () => {
    it('should filter out challenges used in sprints during the specified year', async () => {
      setupMocks({
        sprints: mockSprintsInYear,
        challenges: mockChallenges,
      });

      const availableChallenges = await getAvailableChallenges(2025);

      // Challenges 1 and 2 were used in sprints
      expect(availableChallenges).toHaveLength(3);
      expect(availableChallenges.map((c) => c.id)).not.toContain('challenge_001');
      expect(availableChallenges.map((c) => c.id)).not.toContain('challenge_002');

      // Challenges 3, 4, 5 should be available
      expect(availableChallenges.map((c) => c.id)).toContain('challenge_003');
      expect(availableChallenges.map((c) => c.id)).toContain('challenge_004');
      expect(availableChallenges.map((c) => c.id)).toContain('challenge_005');
    });

    it('should return all challenges when no sprints exist for the year', async () => {
      setupMocks({
        sprints: [],
        challenges: mockChallenges,
      });

      const availableChallenges = await getAvailableChallenges(2025);

      expect(availableChallenges).toHaveLength(5);
    });

    it('should return empty array when all challenges have been used', async () => {
      const allUsedSprints = mockChallenges.map((challenge, index) => ({
        id: `sprint_${index + 1}`,
        sprint_number: index + 1,
        name: `Sprint #${index + 1}`,
        challenge_id: challenge.id,
        start_at: `2025-0${index + 1}-15T00:00:00Z`,
        end_at: `2025-0${index + 1}-29T00:00:00Z`,
        status: 'completed',
      }));

      setupMocks({
        sprints: allUsedSprints,
        challenges: mockChallenges,
      });

      const availableChallenges = await getAvailableChallenges(2025);

      expect(availableChallenges).toHaveLength(0);
    });
  });

  /**
   * Scenario 22: Challenges reset on new calendar year
   * Given all 100 challenges were used in 2025
   * And the current date is "2026-01-02"
   * Then the challenge dropdown displays all 100 challenges
   */
  describe('year-based filtering', () => {
    it('should use current year when no year is specified', async () => {
      const currentYear = new Date().getFullYear();
      const mockPb = pb as jest.Mocked<typeof pb>;

      let capturedFilter = '';
      mockPb.collection.mockImplementation((collectionName: string) => {
        if (collectionName === 'sprints') {
          return {
            getFullList: jest.fn().mockImplementation((options: any) => {
              capturedFilter = options?.filter ?? '';
              return Promise.resolve([]);
            }),
          } as any;
        }
        return {
          getFullList: jest.fn().mockResolvedValue(mockChallenges),
        } as any;
      });

      await getAvailableChallenges();

      // Should filter by current year
      expect(capturedFilter).toContain(`${currentYear}-01-01`);
      expect(capturedFilter).toContain(`${currentYear}-12-31`);
    });

    it('should filter sprints for the specified year only', async () => {
      const mockPb = pb as jest.Mocked<typeof pb>;

      let capturedFilter = '';
      mockPb.collection.mockImplementation((collectionName: string) => {
        if (collectionName === 'sprints') {
          return {
            getFullList: jest.fn().mockImplementation((options: any) => {
              capturedFilter = options?.filter ?? '';
              return Promise.resolve([]);
            }),
          } as any;
        }
        return {
          getFullList: jest.fn().mockResolvedValue(mockChallenges),
        } as any;
      });

      await getAvailableChallenges(2024);

      expect(capturedFilter).toContain('2024-01-01');
      expect(capturedFilter).toContain('2024-12-31');
    });

    it('should return all challenges for a new year with no sprints', async () => {
      setupMocks({
        sprints: [], // No sprints in 2026
        challenges: mockChallenges,
      });

      const availableChallenges = await getAvailableChallenges(2026);

      // All challenges should be available in a new year
      expect(availableChallenges).toHaveLength(5);
    });
  });

  describe('error handling', () => {
    it('should throw an error with descriptive message when sprint fetch fails', async () => {
      setupMocks({
        sprintError: new Error('Network error'),
        challenges: mockChallenges,
      });

      await expect(getAvailableChallenges(2025)).rejects.toThrow(
        'Failed to fetch available challenges: Network error'
      );
    });

    it('should throw an error with descriptive message when challenge fetch fails', async () => {
      setupMocks({
        sprints: [],
        challengeError: new Error('Database connection failed'),
      });

      await expect(getAvailableChallenges(2025)).rejects.toThrow(
        'Failed to fetch available challenges: Database connection failed'
      );
    });

    it('should handle unknown error types', async () => {
      const mockPb = pb as jest.Mocked<typeof pb>;
      mockPb.collection.mockImplementation(() => ({
        getFullList: jest.fn().mockRejectedValue('String error'),
      } as any));

      await expect(getAvailableChallenges(2025)).rejects.toThrow(
        'Failed to fetch available challenges: Unknown error'
      );
    });
  });

  describe('data integrity', () => {
    it('should preserve challenge properties in returned data', async () => {
      setupMocks({
        sprints: [],
        challenges: mockChallenges,
      });

      const availableChallenges = await getAvailableChallenges(2025);

      expect(availableChallenges[0]).toMatchObject({
        id: 'challenge_001',
        challenge_number: 1,
        title: 'Dashboard Analytics',
        brief: '<p>Design a dashboard...</p>',
      });
    });

    it('should handle challenges with null or undefined IDs gracefully', async () => {
      const challengesWithNullId = [
        ...mockChallenges,
        { id: null, challenge_number: 6, title: 'Null ID Challenge', brief: '' },
      ];

      setupMocks({
        sprints: [],
        challenges: challengesWithNullId as any,
      });

      const availableChallenges = await getAvailableChallenges(2025);

      // Should include challenges with null ID (they won't match any sprint)
      expect(availableChallenges).toHaveLength(6);
    });
  });
});

// =============================================================================
// Tests: getRandomAvailableChallenge
// =============================================================================

describe('getRandomAvailableChallenge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Scenario 3: Random challenge selection
   * Given there are 25 available challenges not used in the current year
   * When I select "Random" from the challenge dropdown
   * Then the system randomly selects one of the 25 available challenges
   */
  describe('random selection', () => {
    it('should return a random challenge from available challenges', async () => {
      setupMocks({
        sprints: [],
        challenges: mockChallenges,
      });

      const randomChallenge = await getRandomAvailableChallenge(2025);

      expect(randomChallenge).toBeDefined();
      expect(mockChallenges.map((c) => c.id)).toContain(randomChallenge.id);
    });

    it('should only return from available (unused) challenges', async () => {
      setupMocks({
        sprints: mockSprintsInYear, // Uses challenges 1 and 2
        challenges: mockChallenges,
      });

      // Run multiple times to increase confidence
      for (let i = 0; i < 10; i++) {
        const randomChallenge = await getRandomAvailableChallenge(2025);

        // Should never return challenges used in sprints
        expect(randomChallenge.id).not.toBe('challenge_001');
        expect(randomChallenge.id).not.toBe('challenge_002');
      }
    });

    it('should return different challenges on multiple calls (randomness test)', async () => {
      setupMocks({
        sprints: [],
        challenges: mockChallenges,
      });

      const results = new Set<string>();

      // Run multiple times to test randomness
      for (let i = 0; i < 20; i++) {
        const randomChallenge = await getRandomAvailableChallenge(2025);
        results.add(randomChallenge.id);
      }

      // With 5 challenges and 20 attempts, we should get multiple different results
      // (statistically very likely, but test might flake very rarely)
      expect(results.size).toBeGreaterThan(1);
    });
  });

  /**
   * Scenario 21: No available challenges in current year
   * Given all 100 challenges have been used in 2025
   * Then the challenge dropdown displays: "No available challenges for this year"
   */
  describe('no available challenges', () => {
    it('should throw an error when no challenges are available for the year', async () => {
      const allUsedSprints = mockChallenges.map((challenge, index) => ({
        id: `sprint_${index + 1}`,
        sprint_number: index + 1,
        name: `Sprint #${index + 1}`,
        challenge_id: challenge.id,
        start_at: `2025-0${index + 1}-15T00:00:00Z`,
        end_at: `2025-0${index + 1}-29T00:00:00Z`,
        status: 'completed',
      }));

      setupMocks({
        sprints: allUsedSprints,
        challenges: mockChallenges,
      });

      await expect(getRandomAvailableChallenge(2025)).rejects.toThrow(
        'No available challenges for 2025. All challenges have been used this year.'
      );
    });

    it('should include the year in the error message', async () => {
      setupMocks({
        sprints: mockChallenges.map((c, i) => ({
          id: `sprint_${i}`,
          sprint_number: i + 1,
          name: `Sprint ${i + 1}`,
          challenge_id: c.id,
          start_at: '2024-01-15T00:00:00Z',
          end_at: '2024-01-29T00:00:00Z',
          status: 'completed',
        })),
        challenges: mockChallenges,
      });

      await expect(getRandomAvailableChallenge(2024)).rejects.toThrow('2024');
    });

    it('should throw error when no challenges exist at all', async () => {
      setupMocks({
        sprints: [],
        challenges: [],
      });

      await expect(getRandomAvailableChallenge(2025)).rejects.toThrow(
        'No available challenges for 2025'
      );
    });
  });

  describe('year parameter', () => {
    it('should use current year when no year is specified', async () => {
      setupMocks({
        sprints: [],
        challenges: mockChallenges,
      });

      const randomChallenge = await getRandomAvailableChallenge();

      expect(randomChallenge).toBeDefined();
    });

    it('should respect the specified year parameter', async () => {
      // All challenges used in 2025
      const sprints2025 = mockChallenges.map((c, i) => ({
        id: `sprint_${i}`,
        sprint_number: i + 1,
        name: `Sprint ${i + 1}`,
        challenge_id: c.id,
        start_at: '2025-01-15T00:00:00Z',
        end_at: '2025-01-29T00:00:00Z',
        status: 'completed',
      }));

      setupMocks({
        sprints: sprints2025,
        challenges: mockChallenges,
      });

      // 2025 should have no available challenges
      await expect(getRandomAvailableChallenge(2025)).rejects.toThrow();
    });
  });

  describe('error propagation', () => {
    it('should propagate errors from getAvailableChallenges', async () => {
      setupMocks({
        sprintError: new Error('API unavailable'),
        challenges: mockChallenges,
      });

      await expect(getRandomAvailableChallenge(2025)).rejects.toThrow(
        'Failed to fetch available challenges'
      );
    });
  });
});
