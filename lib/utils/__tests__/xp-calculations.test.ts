/**
 * Unit Tests for XP Calculation Utilities
 *
 * Tests cover level calculations, XP thresholds, progress percentages,
 * user titles, and XP formatting with boundary and edge cases.
 */

import {
  LEVEL_THRESHOLDS,
  LEVEL_TITLES,
  MAX_LEVEL,
  calculateLevel,
  getXPForNextLevel,
  getXPForCurrentLevel,
  calculateLevelProgress,
  getUserTitle,
  formatXPProgress,
} from '../xp-calculations';

describe('XP Calculation Utilities', () => {
  describe('Constants', () => {
    it('should have correct LEVEL_THRESHOLDS array', () => {
      expect(LEVEL_THRESHOLDS).toEqual([0, 100, 250, 500, 1000, 2000, 5000, 10000]);
    });

    it('should have 8 level thresholds', () => {
      expect(LEVEL_THRESHOLDS.length).toBe(8);
    });

    it('should have titles for all 8 levels', () => {
      expect(Object.keys(LEVEL_TITLES).length).toBe(8);
    });

    it('should have MAX_LEVEL equal to 8', () => {
      expect(MAX_LEVEL).toBe(8);
    });
  });

  describe('calculateLevel', () => {
    describe('Level 1 (0-99 XP)', () => {
      it('should return level 1 for 0 XP', () => {
        expect(calculateLevel(0)).toBe(1);
      });

      it('should return level 1 for 50 XP', () => {
        expect(calculateLevel(50)).toBe(1);
      });

      it('should return level 1 for 99 XP (boundary)', () => {
        expect(calculateLevel(99)).toBe(1);
      });
    });

    describe('Level 2 (100-249 XP)', () => {
      it('should return level 2 for 100 XP (boundary)', () => {
        expect(calculateLevel(100)).toBe(2);
      });

      it('should return level 2 for 200 XP', () => {
        expect(calculateLevel(200)).toBe(2);
      });

      it('should return level 2 for 249 XP (boundary)', () => {
        expect(calculateLevel(249)).toBe(2);
      });
    });

    describe('Level 3 (250-499 XP)', () => {
      it('should return level 3 for 250 XP (boundary)', () => {
        expect(calculateLevel(250)).toBe(3);
      });

      it('should return level 3 for 499 XP (boundary)', () => {
        expect(calculateLevel(499)).toBe(3);
      });
    });

    describe('Level 4 (500-999 XP)', () => {
      it('should return level 4 for 500 XP (boundary)', () => {
        expect(calculateLevel(500)).toBe(4);
      });

      it('should return level 4 for 999 XP (boundary)', () => {
        expect(calculateLevel(999)).toBe(4);
      });
    });

    describe('Level 5 (1000-1999 XP)', () => {
      it('should return level 5 for 1000 XP (boundary)', () => {
        expect(calculateLevel(1000)).toBe(5);
      });

      it('should return level 5 for 1999 XP (boundary)', () => {
        expect(calculateLevel(1999)).toBe(5);
      });
    });

    describe('Level 6 (2000-4999 XP)', () => {
      it('should return level 6 for 2000 XP (boundary)', () => {
        expect(calculateLevel(2000)).toBe(6);
      });

      it('should return level 6 for 4999 XP (boundary)', () => {
        expect(calculateLevel(4999)).toBe(6);
      });
    });

    describe('Level 7 (5000-9999 XP)', () => {
      it('should return level 7 for 5000 XP (boundary)', () => {
        expect(calculateLevel(5000)).toBe(7);
      });

      it('should return level 7 for 9999 XP (boundary)', () => {
        expect(calculateLevel(9999)).toBe(7);
      });
    });

    describe('Level 8 (10000+ XP)', () => {
      it('should return level 8 for 10000 XP (boundary)', () => {
        expect(calculateLevel(10000)).toBe(8);
      });

      it('should return level 8 for 50000 XP', () => {
        expect(calculateLevel(50000)).toBe(8);
      });

      it('should return level 8 for very high XP values', () => {
        expect(calculateLevel(1000000)).toBe(8);
      });
    });

    describe('Edge cases', () => {
      it('should return level 1 for negative XP', () => {
        expect(calculateLevel(-100)).toBe(1);
      });
    });
  });

  describe('getXPForNextLevel', () => {
    it('should return 100 for level 1', () => {
      expect(getXPForNextLevel(1)).toBe(100);
    });

    it('should return 250 for level 2', () => {
      expect(getXPForNextLevel(2)).toBe(250);
    });

    it('should return 500 for level 3', () => {
      expect(getXPForNextLevel(3)).toBe(500);
    });

    it('should return 1000 for level 4', () => {
      expect(getXPForNextLevel(4)).toBe(1000);
    });

    it('should return 2000 for level 5', () => {
      expect(getXPForNextLevel(5)).toBe(2000);
    });

    it('should return 5000 for level 6', () => {
      expect(getXPForNextLevel(6)).toBe(5000);
    });

    it('should return 10000 for level 7', () => {
      expect(getXPForNextLevel(7)).toBe(10000);
    });

    it('should return 10000 for level 8 (max level)', () => {
      expect(getXPForNextLevel(8)).toBe(10000);
    });

    describe('Edge cases', () => {
      it('should return 0 for level 0', () => {
        expect(getXPForNextLevel(0)).toBe(0);
      });

      it('should return 10000 for levels above max', () => {
        expect(getXPForNextLevel(10)).toBe(10000);
      });
    });
  });

  describe('getXPForCurrentLevel', () => {
    it('should return 0 for level 1', () => {
      expect(getXPForCurrentLevel(1)).toBe(0);
    });

    it('should return 100 for level 2', () => {
      expect(getXPForCurrentLevel(2)).toBe(100);
    });

    it('should return 250 for level 3', () => {
      expect(getXPForCurrentLevel(3)).toBe(250);
    });

    it('should return 500 for level 4', () => {
      expect(getXPForCurrentLevel(4)).toBe(500);
    });

    it('should return 1000 for level 5', () => {
      expect(getXPForCurrentLevel(5)).toBe(1000);
    });

    it('should return 2000 for level 6', () => {
      expect(getXPForCurrentLevel(6)).toBe(2000);
    });

    it('should return 5000 for level 7', () => {
      expect(getXPForCurrentLevel(7)).toBe(5000);
    });

    it('should return 10000 for level 8', () => {
      expect(getXPForCurrentLevel(8)).toBe(10000);
    });

    describe('Edge cases', () => {
      it('should return 0 for level 0', () => {
        expect(getXPForCurrentLevel(0)).toBe(0);
      });

      it('should return 10000 for levels above max', () => {
        expect(getXPForCurrentLevel(10)).toBe(10000);
      });
    });
  });

  describe('calculateLevelProgress', () => {
    describe('Basic progress calculations', () => {
      it('should return 0% at the start of level 1', () => {
        expect(calculateLevelProgress(0, 1)).toBe(0);
      });

      it('should return 50% halfway through level 1', () => {
        expect(calculateLevelProgress(50, 1)).toBe(50);
      });

      it('should return 99% near end of level 1', () => {
        expect(calculateLevelProgress(99, 1)).toBe(99);
      });

      it('should return 0% at the start of level 2', () => {
        expect(calculateLevelProgress(100, 2)).toBe(0);
      });

      it('should return 50% halfway through level 2', () => {
        // Level 2: 100-249, midpoint is 175
        expect(calculateLevelProgress(175, 2)).toBe(50);
      });
    });

    describe('Progress at level boundaries', () => {
      it('should return approximately 0% right after leveling up', () => {
        expect(calculateLevelProgress(100, 2)).toBe(0);
        expect(calculateLevelProgress(250, 3)).toBe(0);
        expect(calculateLevelProgress(500, 4)).toBe(0);
      });

      it('should return high percentage just before leveling up', () => {
        // 99/100 = 99%
        expect(calculateLevelProgress(99, 1)).toBe(99);
        // 249-100=149 / 150 = 99.33% = 99
        expect(calculateLevelProgress(249, 2)).toBe(99);
      });
    });

    describe('Max level progress', () => {
      it('should return 100% at max level', () => {
        expect(calculateLevelProgress(10000, 8)).toBe(100);
      });

      it('should return 100% for XP beyond max threshold', () => {
        expect(calculateLevelProgress(50000, 8)).toBe(100);
      });
    });

    describe('Edge cases', () => {
      it('should return 0% for negative XP', () => {
        expect(calculateLevelProgress(-100, 1)).toBe(0);
      });

      it('should return 0% for level 0', () => {
        expect(calculateLevelProgress(50, 0)).toBe(0);
      });

      it('should return 100% for levels above max', () => {
        expect(calculateLevelProgress(10000, 10)).toBe(100);
      });
    });

    describe('Specific level calculations', () => {
      it('should calculate correct progress for level 5', () => {
        // Level 5: 1000-1999 (range of 1000)
        // At 1500, progress = (1500-1000)/(2000-1000) = 500/1000 = 50%
        expect(calculateLevelProgress(1500, 5)).toBe(50);
      });

      it('should calculate correct progress for level 6', () => {
        // Level 6: 2000-4999 (range of 3000)
        // At 3500, progress = (3500-2000)/(5000-2000) = 1500/3000 = 50%
        expect(calculateLevelProgress(3500, 6)).toBe(50);
      });

      it('should calculate correct progress for level 7', () => {
        // Level 7: 5000-9999 (range of 5000)
        // At 7500, progress = (7500-5000)/(10000-5000) = 2500/5000 = 50%
        expect(calculateLevelProgress(7500, 7)).toBe(50);
      });
    });
  });

  describe('getUserTitle', () => {
    it('should return "Design Novice" for level 1', () => {
      expect(getUserTitle(1)).toBe('Design Novice');
    });

    it('should return "Creative Explorer" for level 2', () => {
      expect(getUserTitle(2)).toBe('Creative Explorer');
    });

    it('should return "Interaction Alchemist" for level 3', () => {
      expect(getUserTitle(3)).toBe('Interaction Alchemist');
    });

    it('should return "UX Specialist" for level 4', () => {
      expect(getUserTitle(4)).toBe('UX Specialist');
    });

    it('should return "Design Master" for level 5', () => {
      expect(getUserTitle(5)).toBe('Design Master');
    });

    it('should return "Visual Virtuoso" for level 6', () => {
      expect(getUserTitle(6)).toBe('Visual Virtuoso');
    });

    it('should return "Design Architect" for level 7', () => {
      expect(getUserTitle(7)).toBe('Design Architect');
    });

    it('should return "Design Legend" for level 8', () => {
      expect(getUserTitle(8)).toBe('Design Legend');
    });

    describe('Edge cases', () => {
      it('should return "Design Novice" for level 0', () => {
        expect(getUserTitle(0)).toBe('Design Novice');
      });

      it('should return "Design Legend" for levels above max', () => {
        expect(getUserTitle(10)).toBe('Design Legend');
      });

      it('should return "Design Novice" for negative levels', () => {
        expect(getUserTitle(-1)).toBe('Design Novice');
      });
    });
  });

  describe('formatXPProgress', () => {
    it('should format "0/100 XP" for level 1 with 0 XP', () => {
      expect(formatXPProgress(0, 1)).toBe('0/100 XP');
    });

    it('should format "50/100 XP" for level 1 with 50 XP', () => {
      expect(formatXPProgress(50, 1)).toBe('50/100 XP');
    });

    it('should format "720/1000 XP" for level 4 with 720 XP', () => {
      expect(formatXPProgress(720, 4)).toBe('720/1000 XP');
    });

    it('should format "1500/2000 XP" for level 5 with 1500 XP', () => {
      expect(formatXPProgress(1500, 5)).toBe('1500/2000 XP');
    });

    it('should format "10000/10000 XP" for max level', () => {
      expect(formatXPProgress(10000, 8)).toBe('10000/10000 XP');
    });

    it('should format "10500/10000 XP" for XP beyond max threshold', () => {
      expect(formatXPProgress(10500, 8)).toBe('10500/10000 XP');
    });

    describe('Edge cases', () => {
      it('should format "0/100 XP" for negative XP', () => {
        expect(formatXPProgress(-100, 1)).toBe('0/100 XP');
      });

      it('should handle level 0 gracefully', () => {
        expect(formatXPProgress(50, 0)).toBe('50/0 XP');
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should correctly track a user progressing from level 1 to 2', () => {
      // User starts at 0 XP
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevelProgress(0, 1)).toBe(0);
      expect(getUserTitle(1)).toBe('Design Novice');
      expect(formatXPProgress(0, 1)).toBe('0/100 XP');

      // User earns 50 XP
      expect(calculateLevel(50)).toBe(1);
      expect(calculateLevelProgress(50, 1)).toBe(50);

      // User earns 100 XP total
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevelProgress(100, 2)).toBe(0);
      expect(getUserTitle(2)).toBe('Creative Explorer');
      expect(formatXPProgress(100, 2)).toBe('100/250 XP');
    });

    it('should correctly handle a user at max level', () => {
      const totalXP = 15000;
      const level = calculateLevel(totalXP);

      expect(level).toBe(8);
      expect(calculateLevelProgress(totalXP, level)).toBe(100);
      expect(getUserTitle(level)).toBe('Design Legend');
      expect(formatXPProgress(totalXP, level)).toBe('15000/10000 XP');
    });

    it('should maintain consistency between level calculation and thresholds', () => {
      LEVEL_THRESHOLDS.forEach((threshold, index) => {
        const level = index + 1;
        expect(calculateLevel(threshold)).toBe(level);
        expect(getXPForCurrentLevel(level)).toBe(threshold);
      });
    });
  });
});
